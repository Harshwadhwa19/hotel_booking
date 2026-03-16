require('dotenv').config();
const { sendEmail } = require('./services/emailService');

async function test() {
    console.log('Testing email service...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    // Don't log full password for safety, but check if it exists
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

    const result = await sendEmail(
        process.env.EMAIL_USER, 
        'Test Email - Hotel Booking App', 
        'This is a test email to verify SMTP configuration.'
    );

    const fs = require('fs');
    if (result === true || result.success) {
        console.log('Test email sent successfully!');
        fs.writeFileSync('email_debug.txt', 'SUCCESS');
    } else {
        console.log('Test email failed to send:', result.error || 'Unknown error');
        fs.writeFileSync('email_debug.txt', 'FAILED: ' + (result.error || 'Unknown error'));
    }
}

test();
