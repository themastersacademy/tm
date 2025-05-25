import nodemailer from "nodemailer";

export const sendOTPToMail = async ({ to, otp }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    name: process.env.MAIL_NAME,
    port: process.env.MAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  const mailInfo = {
    from: '"The Masters Academy" <no-reply@incrix.in>',
    to, // recipient email address
    subject: "Verify Your Account - The Masters Academy",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Verify Your Account</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #FEECC9; /* Accent Color 1 */
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
              background-color: #187163; /* Primary Color */
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
              background-color: #FF8851; /* Accent Color 2 */
              padding: 20px 40px;
              border-radius: 6px;
              letter-spacing: 3px;
              margin: 20px 0;
              display: inline-block;
            }
            .validity {
              font-size: 14px;
              color: #EB4646; /* Strong red - kept as is */
              margin-bottom: 20px;
            }
            .footer {
              background-color: #FEA800; /* Secondary Color */
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
              &copy; ${new Date().getFullYear()} The Masters Academy. All rights reserved.<br />
              This email was sent through Incrix CRM.
            </div>
          </div>
        </body>
      </html>
    `,
  };
  

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailInfo, function (error, info) {
      if (error) {
        reject(error);
        return error;
      } else {
        resolve(info);
      }
    });
  });
};
