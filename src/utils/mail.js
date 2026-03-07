import { SendEmailCommand } from "@aws-sdk/client-ses";
import { ses } from "@/src/utils/awsAgent";

const SES_FROM_EMAIL = "no-reply@classory.app";

export const sendOTPToMail = async ({ to, otp }) => {
  const params = {
    Source: `The Masters Academy <${SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: "Verify Your Account - The Masters Academy",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Verify Your Account</title>
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
                Thank you for registering with The Masters Academy. Please use the
                one-time password (OTP) below to verify your email address.
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

  await ses.send(new SendEmailCommand(params));
};
