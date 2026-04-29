import { SendEmailCommand } from "@aws-sdk/client-ses";
import { ses } from "@/src/utils/awsAgent";

const SES_FROM_EMAIL = "no-reply@classory.app";

export const sendOTPToMail = async ({ to, otp, purpose = "verify" }) => {
  const subject = purpose === "reset"
    ? "Password Reset OTP - The Masters Academy"
    : "Verify Your Account - The Masters Academy";

  const plainTextBody =
    `Dear ${to.split("@")[0]},\n\n` +
    (purpose === "reset"
      ? `You requested a password reset for your The Masters Academy account.\n\n`
      : `Thank you for registering with The Masters Academy.\n\n`) +
    `Your one-time password (OTP) is: ${otp}\n\n` +
    `This OTP is valid for only 5 minutes.\n\n` +
    `If you did not request this, please ignore this email.\n\n` +
    `Best regards,\nThe Masters Academy Team`;

  const params = {
    Source: `The Masters Academy <${SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [SES_FROM_EMAIL],
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        // Plain text alternative — critical for avoiding spam filters
        Text: {
          Data: plainTextBody,
          Charset: "UTF-8",
        },
        Html: {
          Data: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #FEECC9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background-color: #187163;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }
            .content {
              padding: 30px;
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              margin-bottom: 20px;
              line-height: 1.5;
            }
            .otp {
              font-size: 32px;
              font-weight: bold;
              color: #ffffff;
              background-color: #FF8851;
              padding: 20px 40px;
              border-radius: 6px;
              letter-spacing: 3px;
              margin: 20px 0;
              display: inline-block;
            }
            .validity {
              font-size: 14px;
              color: #EB4646;
              margin-bottom: 20px;
            }
            .footer {
              background-color: #FEA800;
              color: #ffffff;
              text-align: center;
              padding: 15px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>The Masters Academy</h1>
            </div>
            <div class="content">
              <p>Dear ${to.split("@")[0]},</p>
              <p>
                ${purpose === "reset"
                  ? "You requested a password reset. Please use the one-time password (OTP) below to proceed."
                  : "Thank you for registering with The Masters Academy. Please use the one-time password (OTP) below to verify your email address."}
              </p>
              <div class="otp">${otp}</div>
              <p class="validity">
                This OTP is valid for only 5 minutes.
              </p>
              <p>
                If you did not request this, please ignore this email or contact our support team immediately.
              </p>
              <p>
                Best regards,<br />
                The Masters Academy Team
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} The Masters Academy. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const result = await ses.send(new SendEmailCommand(params));
    console.log(`[SES] OTP email sent successfully to ${to}, MessageId: ${result.MessageId}`);
    return result;
  } catch (error) {
    // Log detailed SES error for diagnosis
    console.error(`[SES] Failed to send OTP email to ${to}:`, {
      errorCode: error.Code || error.name,
      errorMessage: error.message,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
    });

    // Provide actionable diagnostic messages
    if (error.name === "MessageRejected") {
      console.error(
        "[SES] DIAGNOSIS: Email rejected. This usually means:\n" +
        "  1. SES is in SANDBOX mode — only verified email addresses can receive emails.\n" +
        "     Fix: Request production access in AWS Console → SES → Account Dashboard.\n" +
        "  2. The sender email (no-reply@classory.app) is not verified.\n" +
        "     Fix: Verify the domain 'classory.app' in AWS Console → SES → Verified Identities."
      );
    } else if (error.name === "MailFromDomainNotVerifiedException" || error.message?.includes("not verified")) {
      console.error(
        "[SES] DIAGNOSIS: The domain 'classory.app' or email 'no-reply@classory.app' is NOT verified in SES.\n" +
        "  Fix: Go to AWS Console → SES → Verified Identities → Add domain 'classory.app'.\n" +
        "  Then add the required DNS records (DKIM, SPF) to your domain registrar."
      );
    } else if (error.name === "AccessDeniedException" || error.name === "InvalidClientTokenId") {
      console.error(
        "[SES] DIAGNOSIS: The IAM credentials do not have permission to send emails via SES.\n" +
        "  Fix: Attach the 'AmazonSESFullAccess' policy to the IAM user."
      );
    }

    throw error;
  }
};

