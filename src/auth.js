import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { dynamoDB } from "@/src/utils/awsAgent"; // your AWS configuration file
import { getUserByEmail } from "@/src/libs/auth/auth";
import { verifyPassword } from "@/src/utils/crypto";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DynamoDBAdapter(dynamoDB, {
    tableName: `${process.env.AWS_DB_NAME}users`,
    partitionKey: "pKey",
    sortKey: "sKey",
    indexName: "GSI1-index",
    indexPartitionKey: "GSI1-pKey",
    indexSortKey: "GSI1-sKey",
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }
        const user = await getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("No user found with the given email");
        }
        if (!user?.emailVerified) {
          throw new Error("Email not verified");
        }
        try {
          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          return {
            id: user.pKey.split("#")[1],
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            provider: user.provider,
            image: user.image,
            accountType: user.accountType,
            subscriptionExpiresAt: user.subscriptionExpiresAt,
            subscriptionSource: user.subscriptionSource,
          };
        } catch (error) {
          throw new Error("Invalid password");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
          status: "active",
          phoneNumber: "",
          gender: "",
          provider: "google",
          accountType: "FREE",
          billingInfo: [],
          subscriptionExpiresAt: 0,
          subscriptionSource: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.provider = user.provider;
        token.accountType = user.accountType;
        token.subscriptionExpiresAt = user.subscriptionExpiresAt;
        token.subscriptionSource = user.subscriptionSource;
      }
      return token;
    },
    async session({ session, token }) {
      const user = await getUserByEmail(token.email);

      if (
        token.name === "" ||
        token.emailVerified === null ||
        token.emailVerified === undefined ||
        token.emailVerified === false
      ) {
        session.user.name = user.name;
        session.user.emailVerified = user.emailVerified;
      } else {
        session.user.name = token.name;
        session.user.emailVerified = token.emailVerified;
      }
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.provider = token.provider;
        session.user.accountType = user.accountType;
        session.user.subscriptionExpiresAt = user.subscriptionExpiresAt;
        session.user.subscriptionSource = user.subscriptionSource;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified;
      }
      return true;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  // debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
