require('dotenv').config();  // Load .env
const sendEmail = require('./utils/sendEmail');

sendEmail('soniya16997@gmail.com', 'Test Subject', 'Hello! This is a test.')
  .then(() => console.log('Test email sent.'))
  .catch((err) => console.error('Failed to send test email:', err));
