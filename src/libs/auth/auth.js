"server only";
import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  hashPassword,
  verifyPassword,
  generateOTP,
  generateToken,
  verifyToken,
} from "@/src/utils/crypto";
import { randomUUID } from "crypto";
import { sendOTPToMail } from "@/src/utils/mail";
import { getValidProSubscription } from "@/src/libs/proSubscription/subscriptionController";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function getUserByEmail(email) {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}users`,
    IndexName: "GSI1-index", // Ensure this matches your GSI name
    KeyConditionExpression: "#gsi1PKey = :email AND #gsi1SKey = :email", // Use expression attribute names
    ExpressionAttributeNames: {
      "#gsi1PKey": "GSI1-pKey", // Map placeholder to actual attribute name
      "#gsi1SKey": "GSI1-sKey", // Map placeholder to actual attribute name
    },
    ExpressionAttributeValues: {
      ":email": `USER#${email}`, // Match the GSI key structure
    },
  };

  try {
    const result = await dynamoDB.send(new QueryCommand(params));
    const user = result.Items[0];

    if (result.Items.length === 0) {
      throw new Error("User not found");
    }

    const isUpdated = await updateUserProSubscription(user);
    console.log("isUpdated", isUpdated);
    if (!isUpdated) {
      return user;
    }

    const updatedResult = await dynamoDB.send(new QueryCommand(params));
    const updatedUser = updatedResult.Items[0];
    console.log("updatedUser", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
    // throw new Error("Failed to retrieve user");
  }
}

export async function updateUserProSubscription(user) {
  // 1. Fetch the latest valid pro‐subscription for this user.
  const result = await getValidProSubscription(user.id);
  console.log("result", result);
  // 2. Determine desired fields:
  //    - If there's a successful active subscription that hasn't expired, user should be "PRO".
  //    - Otherwise, user should be "FREE".
  let desiredAccountType = "FREE";
  let desiredExpiresAt = null;
  let desiredSource = null;

  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    const sub = result.data[0]; // assume sorted so [0] is most relevant
    const now = Date.now();
    const isActive = sub.status === "active" && sub.expiresAt > now;

    if (isActive) {
      desiredAccountType = "PRO";
      desiredExpiresAt = sub.expiresAt;
      desiredSource = sub.subscriptionSource || null;
    }
  }

  // 3. If user currently is PRO but no valid subscription → revert to FREE
  //    (Note: desiredAccountType takes care of that.)

  // 4. Compare with existing user fields to see if any change is needed:
  const currentlyPro = user.accountType === "PRO";
  const currentExpiresAt = user.subscriptionExpiresAt || null;
  const currentSource = user.subscriptionSource || null;

  const noChange =
    user.accountType === desiredAccountType &&
    currentExpiresAt === desiredExpiresAt &&
    currentSource === desiredSource;

  if (noChange) {
    return false; // nothing to update
  }

  // 5. Build a minimal UpdateExpression that sets the three fields:
  const nowTs = Date.now();
  const updateParams = {
    TableName: USER_TABLE,
    Key: { pKey: user.pKey, sKey: user.sKey },
    UpdateExpression:
      "SET accountType = :acct, subscriptionExpiresAt = :exp, subscriptionSource = :src, updatedAt = :u",
    ExpressionAttributeValues: {
      ":acct": desiredAccountType,
      ":exp": desiredExpiresAt,
      ":src": desiredSource,
      ":u": nowTs,
    },
  };

  // 6. Execute the update
  try {
    await dynamoDB.send(new UpdateCommand(updateParams));
    return true;
  } catch (error) {
    console.error("Error updating user pro subscription:", error);
    throw new Error("Failed to update user pro subscription");
  }
}
export async function updateUserEmailVerified(email) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression: "set emailVerified = :emailVerified",
        ExpressionAttributeValues: { ":emailVerified": true },
      })
    );
  } catch (error) {
    console.error("Error updating user email verified:", error);
    throw new Error("Failed to update user email verified");
  }
}

export async function createUser({ email, name, password }) {
  const existingUser = await getUserByEmail(email);
  //check if user is already verified
  if (existingUser?.emailVerified) {
    throw new Error("A user with that email already exists");
  }
  if (existingUser) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: {
          pKey: existingUser.pKey,
          sKey: existingUser.sKey,
        },
      })
    );
  }

  const userID = randomUUID();
  const hashedPassword = await hashPassword(password);
  const params = {
    TableName: `${process.env.AWS_DB_NAME}users`,
    Item: {
      pKey: `USER#${userID}`,
      sKey: `USER#${userID}`,
      email,
      name: name || "",
      id: userID,
      password: hashedPassword,
      "GSI1-pKey": `USER#${email}`,
      "GSI1-sKey": `USER#${email}`,
      emailVerified: false, // or you might store a timestamp once verified
      role: "user", // user, admin, superadmin
      status: "active", // active, inactive, deleted
      otp: {
        otp: generateOTP(),
        expiresAt: Date.now() + 1000 * 60 * 5, // 5 minutes from now
        attemptsRemaining: 3,
      },
      phoneNumber: "",
      gender: "",
      accountType: "FREE",
      subscriptionExpiresAt: 0,
      billingInfo: [],
      subscriptionSource: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    ConditionExpression: "attribute_not_exists(email)",
  };

  try {
    await dynamoDB.send(new PutCommand(params));
    await sendOTPToMail({ to: email, otp: params.Item.otp.otp });
    return {
      success: true,
      message: "OTP sent to email",
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user");
  }
}

export async function resendOTP({ email }) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.otp.expiresAt > Date.now() && user.otp.attemptsRemaining > 0) {
    await sendOTPToMail({ to: email, otp: user.otp.otp });
    return {
      success: true,
      message: "OTP sent",
    };
  }

  if (user.otp.attemptsRemaining === 0) {
    throw new Error("OTP attempts exceeded");
  }

  user.otp.otp = generateOTP();
  user.otp.expiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes from now

  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression: "set otp.otp = :otp, otp.expiresAt = :expiresAt",
        ExpressionAttributeValues: {
          ":otp": user.otp.otp,
          ":expiresAt": user.otp.expiresAt,
        },
      })
    );
    await sendOTPToMail({ to: email, otp: user.otp.otp });
    return {
      success: true,
      message: "OTP sent",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}

export async function verifyOTP({ email, otp }) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  //reduce OTP attempts
  if (user.otp.attemptsRemaining > 0) {
    user.otp.attemptsRemaining--;
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression: "set otp.attemptsRemaining = :attemptsRemaining",
        ExpressionAttributeValues: {
          ":attemptsRemaining": user.otp.attemptsRemaining,
        },
      })
    );
  } else {
    throw new Error("OTP attempts exceeded");
  }
  //check if OTP is correct
  if (user.otp.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  //check if OTP is expired
  if (user.otp.expiresAt < Date.now()) {
    throw new Error("OTP expired");
  }

  await dynamoDB.send(
    new UpdateCommand({
      TableName: `${process.env.AWS_DB_NAME}users`,
      Key: { pKey: user.pKey, sKey: user.sKey },
      UpdateExpression: "set emailVerified = :emailVerified",
      ExpressionAttributeValues: { ":emailVerified": true },
    })
  );
  return {
    success: true,
    message: "Email verified",
  };
}

export async function forgotPassword({ email }) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  user.otp = user.otp || {};
  user.otp.otp = generateOTP();
  user.otp.expiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes from now
  user.otp.attemptsRemaining = 3;
  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression: "set otp = :otp",
        ExpressionAttributeValues: { ":otp": user.otp },
      })
    );
    await sendOTPToMail({ to: email, otp: user.otp.otp });
    return {
      success: true,
      message: "OTP sent",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}

export async function verifyOTPForPasswordReset({ email, otp }) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  //reduce OTP attempts
  if (user.otp.attemptsRemaining > 0) {
    user.otp.attemptsRemaining--;
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression: "set otp.attemptsRemaining = :attemptsRemaining",
        ExpressionAttributeValues: {
          ":attemptsRemaining": user.otp.attemptsRemaining,
        },
      })
    );
  } else {
    throw new Error("OTP attempts exceeded");
  }
  //check if OTP is correct
  if (user.otp.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  //check if OTP is expired
  if (user.otp.expiresAt < Date.now()) {
    throw new Error("OTP expired");
  }

  //generate token
  const token = generateToken({ id: user.pKey.split("#")[1], email });
  //token is reserved keyword in dynamoDB so we need to use a different name
  await dynamoDB.send(
    new UpdateCommand({
      TableName: `${process.env.AWS_DB_NAME}users`,
      Key: { pKey: user.pKey, sKey: user.sKey },
      UpdateExpression: "set otp.#tk = :token, otp.isTokenUsed = :isTokenUsed",
      ExpressionAttributeNames: {
        "#tk": "token",
      },
      ExpressionAttributeValues: {
        ":token": token,
        ":isTokenUsed": false,
      },
    })
  );
  return {
    success: true,
    message: "OTP verified",
    data: {
      token: token,
    },
  };
}

export async function updateUserPassword({ password, token }) {
  const { email, id } = verifyToken(token);
  if (!email || !id) {
    throw new Error("Time out");
  }
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }
  if (user.otp.isTokenUsed) {
    throw new Error("Token already used");
  }
  try {
    if (id !== user.pKey.split("#")[1]) {
      throw new Error("Invalid token");
    }
  } catch (error) {
    throw new Error("Invalid token");
  }
  const hashedPassword = await hashPassword(password);
  //check if new password is the same as the old password
  if (user.password) {
    const isSamePassword = await verifyPassword(password, user.password);
    if (isSamePassword) {
      throw new Error("New password cannot be the same as the old password");
    }
  }
  try {
    await dynamoDB.send(
      new UpdateCommand({
        TableName: `${process.env.AWS_DB_NAME}users`,
        Key: { pKey: user.pKey, sKey: user.sKey },
        UpdateExpression:
          "set password = :password, otp.isTokenUsed = :isTokenUsed, otp.#tk = :token",
        ExpressionAttributeNames: {
          "#tk": "token",
        },
        ExpressionAttributeValues: {
          ":password": hashedPassword,
          ":isTokenUsed": true,
          ":token": null,
        },
      })
    );
    return {
      success: true,
      message: "Password updated",
    };
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Failed to update user password");
  }
}
