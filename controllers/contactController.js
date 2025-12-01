const nodemailer = require('nodemailer');

const submitContactForm = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      service, 
      message, 
      contactMethod, 
      companyName, 
      numEmployees, 
      interests, 
      uploadedFiles 
    } = req.body;

    if (!fullName || !email || !phone || !service || !message || !contactMethod) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, phone, service, message, and contact method are required"
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const interestsText = Array.isArray(interests) ? interests.join(', ') : interests;
    const filesText = Array.isArray(uploadedFiles) ? uploadedFiles.map(f => f.name).join(', ') : 'None';

    const mailOptions = {
      from: '"No Reply" <no-reply@yourdomain.com>',
      to: 'johnayomide920@gmail.com',
      subject: 'New Contact Form Submission',
      text: `
Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Service: ${service}
Contact Method: ${contactMethod}
Company Name: ${companyName || 'Not provided'}
Number of Employees: ${numEmployees || 'Not provided'}
Interests: ${interestsText || 'None'}
Uploaded Files: ${filesText}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h3 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Contact Form Submission</h3>
  
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h4 style="color: #555; margin-top: 0;">Contact Information</h4>
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Contact Method:</strong> ${contactMethod}</p>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h4 style="color: #555; margin-top: 0;">Business Details</h4>
    <p><strong>Company Name:</strong> ${companyName || 'Not provided'}</p>
    <p><strong>Number of Employees:</strong> ${numEmployees || 'Not provided'}</p>
    <p><strong>Service Interested In:</strong> ${service}</p>
    <p><strong>Interests:</strong> ${interestsText || 'None'}</p>
    <p><strong>Uploaded Files:</strong> ${filesText}</p>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h4 style="color: #555; margin-top: 0;">Message</h4>
    <p style="white-space: pre-wrap;">${message}</p>
  </div>
</div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully"
    });

  } catch (error) {
    console.error("Contact form error:", error);
    
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

module.exports = {
  submitContactForm
};