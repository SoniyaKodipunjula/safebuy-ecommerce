require('dotenv').config({ path: __dirname + '/.env' });
const sendEmail = require('./utils/sendEmail');

(async () => {
  try {
    const to = "soniya16997@gmail.com";
    const subject = "Test Subject";
    const text = "Hello! This is a test.";

    console.log(`Attempting to send email to: ${to}`);
    await sendEmail(to, subject, text);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
})();
