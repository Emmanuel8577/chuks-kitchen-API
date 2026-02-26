import nodemailer from "nodemailer";

export const sendOTPByEmail = async (email, otp, name) => {
  // 1. Create a transporter (using Gmail for this example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your App Password (not your regular password)
    },
  });

  // 2. Define the email content
  const mailOptions = {
    from: `"Chuks Kitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Chuks Kitchen Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #e67e22;">Welcome to Chuks Kitchen, ${name}!</h2>
        <p>Thank you for signing up. To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 5px; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">Digital Food Ordering by TrueMinds Innovations Ltd.</p>
      </div>
    `,
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};