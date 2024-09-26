const Resend = require("resend").Resend;
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_ABOARD_TEMPLATE,
} = require("./emailTemplates.js");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await resend.emails.send({
      from: "Verify@Reminderly <aviral@aviral.ishn.link>", 
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      headers: { "X-Category": "Email Verification" },
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

const sendWelcomeEmail = async (email, fullname) => {
  try {
    const response = await resend.emails.send({
      from: "Welcome@Reminderly <aviral@aviral.ishn.link>", 
      to: email,
      subject: "Welcome!",
      html: WELCOME_ABOARD_TEMPLATE.replace("{fullname}", fullname),
      headers: { "X-Category": "Welcome Email" },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await resend.emails.send({
      from: "Reset-Password@Reminderly <aviral@aviral.ishn.link>", 
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      headers: { "X-Category": "Password Reset" },
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    const response = await resend.emails.send({
      from: "Reset-Success@Reminderly <aviral@aviral.ishn.link>", 
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      headers: { "X-Category": "Password Reset" },
    });

    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
