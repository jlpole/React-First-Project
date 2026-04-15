import transporter from '../config/emailConfig.js';
import pool from '../config/db.js';

export const sendInterest = async (req, res) => {
  try {
    const { businessId, message, businessName, businessOwnerEmail } = req.body;
    
    const marketerName = req.user.name || 'A Marketer';
    const marketerEmail = req.user.email;
    const marketerPhone = req.user.phone || 'Not provided';
    const userId = req.user.id; 

    console.log('📧 Sending interest from:', marketerEmail, 'to:', businessOwnerEmail);

    // Validate required fields
    if (!businessOwnerEmail || !message || !businessName || !businessId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    if (!marketerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Marketer email not found. Please login again.'
      });
    }

    // ✅ GET THE ACTUAL marketer_id from marketers table
    const [marketerRows] = await pool.query(
      'SELECT marketer_id FROM marketers WHERE user_id = ?',
      [userId]
    );

    if (!marketerRows || marketerRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marketer profile not found. Please contact support.'
      });
    }

    const marketerId = marketerRows[0].marketer_id; // ✅ Now we have the correct marketer_id
    console.log('✅ Found marketer_id:', marketerId, 'for user_id:', userId);

    // Email options
    const mailOptions = {
      from: {
        name: marketerName,
        address: process.env.EMAIL_USER
      },
      replyTo: {
        name: marketerName,
        address: marketerEmail
      },
      to: businessOwnerEmail,
      subject: `${marketerName} is interested in ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header {
              background: linear-gradient(135deg, #166534 0%, #15803d 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .from-section {
              background: #ecfdf5;
              border-left: 4px solid #166534;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .message-box {
              background: #f3f4f6;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .button {
              display: inline-block;
              background: #166534;
              color: white !important;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Partnership Inquiry</h1>
            </div>
            
            <div class="content">
              <p>Dear Business Owner,</p>
              
              <div class="from-section">
                <h3 style="margin: 0 0 10px 0; color: #166534;">Direct Message From:</h3>
                <p style="margin: 5px 0; font-size: 18px;"><strong>${marketerName}</strong></p>
                <p style="margin: 5px 0; color: #059669;">${marketerEmail}</p>
                <p style="margin: 5px 0; color: #6b7280;">${marketerPhone}</p>
              </div>
              
              <p><strong>${marketerName}</strong> has expressed interest in <strong>${businessName}</strong>.</p>
              
              <h3 style="color: #166534; margin-top: 25px;">💬 Message:</h3>
              <div class="message-box">
                <p style="margin: 0; white-space: pre-line;">${message}</p>
              </div>
              
              <p style="margin-top: 20px;"><strong>You can reply directly to this email to contact ${marketerName}.</strong></p>
              
              <center>
                <a href="mailto:${marketerEmail}" class="button">Reply to ${marketerName}</a>
              </center>
              
              <p style="margin-top: 25px; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                This message was sent via OIC Associates Platform
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // ✅ 1. Send email first
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    // ✅ 2. Save to database with the CORRECT marketer_id
    await pool.query(
      `INSERT INTO interest_messages 
       (business_id, marketer_id, message, business_name, business_owner_email, sent_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [businessId, marketerId, message, businessName, businessOwnerEmail]
    );
    console.log('✅ Message saved to database');

    res.status(200).json({
      success: true,
      message: 'Interest sent successfully! The business owner will be notified.',
      emailSent: true,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending interest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send interest. Please try again.',
      error: error.message
    });
  }
};