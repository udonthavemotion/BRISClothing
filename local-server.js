// Simple local server to test the API route
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend with environment variable or fallback
const resend = new Resend(process.env.RESEND_API_KEY || 're_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt');

// API route - same as our Vercel function
app.post('/api/send-access-email', async (req, res) => {
  console.log('📧 Email API called:', req.body);
  
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // For testing: Use the submitted email directly
  // Note: In production with unverified domain, only godspeedbulldogs@gmail.com will work
  // But we'll try the submitted email anyway for local testing

  try {
    console.log(`[BRISC API] Sending access email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'BRISC Access <onboarding@resend.dev>',
      to: [email],
      subject: '🔥 Your BRISC Exclusive Access Code - Be Your Own Light',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>BRISC Exclusive Access</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
          
          <!-- Preheader Text (Hidden but shows in email preview) -->
          <div style="display: none; font-size: 1px; color: #000000; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
            Your exclusive access code: light2025 - Enter now to explore the BRISC collection
          </div>
          
          <!-- Main Email Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
            <tr>
              <td align="center" style="padding: 0;">
                
                <!-- Email Content -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
                  
                  <!-- Header Section -->
                  <tr>
                    <td align="center" style="padding: 60px 40px 40px 40px;">
                      <img src="https://www.brisclothing.com/images/Product%20Assets/M%20copy.png" 
                           alt="BRISC Logo" 
                           width="100" 
                           height="auto" 
                           style="display: block; margin: 0 auto 30px auto; max-width: 100px;" />
                      
                      <h1 style="color: #ffffff; font-size: 36px; font-weight: 300; margin: 0; letter-spacing: 3px; text-align: center; line-height: 1.2;">
                        BRISC
                      </h1>
                      
                      <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #ffffff 0%, #666666 100%); margin: 20px auto 0 auto;"></div>
                    </td>
                  </tr>
                  
                  <!-- Welcome Message -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      <h2 style="color: #ffffff; font-size: 32px; font-weight: 400; margin: 0 0 20px 0; text-align: center; line-height: 1.3;">
                        EXCLUSIVE ACCESS
                      </h2>
                      <h3 style="color: #ffffff; font-size: 24px; font-weight: 400; margin: 0 0 30px 0; text-align: center; line-height: 1.3;">
                        GRANTED
                      </h3>
                      
                      <p style="color: #cccccc; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                        Welcome to BRISC, ${email.split('@')[0]}.
                      </p>
                      
                      <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                        You've been granted exclusive access to our latest streetwear collection.<br>
                        <strong style="color: #ffffff; font-size: 18px;">Be Your Own Light.</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Access Code Section -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      
                      <!-- Access Code Container -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); border: 2px solid #333333; border-radius: 16px; box-shadow: 0 8px 32px rgba(255,255,255,0.1);">
                        <tr>
                          <td align="center" style="padding: 40px 30px;">
                            
                            <p style="color: #888888; font-size: 14px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 2px; text-align: center;">
                              Your Access Code
                            </p>
                            
                            <!-- The Access Code -->
                            <div style="background: #000000; border: 1px solid #444444; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                              <div style="font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 6px; font-family: 'Courier New', Consolas, monospace; text-align: center;">
                                light2025
                              </div>
                            </div>
                            
                            <p style="color: #888888; font-size: 13px; margin: 20px 0 0 0; text-align: center; line-height: 1.4;">
                              Copy this code exactly as shown<br>
                              <span style="color: #666666;">Case sensitive • No spaces</span>
                            </p>
                            
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Instructions Section -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #0a0a0a; border-radius: 12px; border: 1px solid #222222;">
                        <tr>
                          <td style="padding: 30px;">
                            
                            <h3 style="color: #ffffff; font-size: 20px; margin: 0 0 20px 0; text-align: center; font-weight: 500;">
                              How to Access Your Exclusive Collection
                            </h3>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="padding: 10px 0; vertical-align: top; width: 40px;">
                                  <div style="width: 30px; height: 30px; background: #ffffff; color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; text-align: center; line-height: 30px;">1</div>
                                </td>
                                <td style="padding: 10px 0 10px 15px; vertical-align: top;">
                                  <p style="color: #cccccc; font-size: 16px; margin: 0; line-height: 1.5;">
                                    Return to <a href="http://localhost:4328" style="color: #ffffff; text-decoration: underline; font-weight: 500;">the BRISC website</a>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; vertical-align: top;">
                                  <div style="width: 30px; height: 30px; background: #ffffff; color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; text-align: center; line-height: 30px;">2</div>
                                </td>
                                <td style="padding: 10px 0 10px 15px; vertical-align: top;">
                                  <p style="color: #cccccc; font-size: 16px; margin: 0; line-height: 1.5;">
                                    Enter your access code: <strong style="color: #ffffff;">light2025</strong>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; vertical-align: top;">
                                  <div style="width: 30px; height: 30px; background: #ffffff; color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; text-align: center; line-height: 30px;">3</div>
                                </td>
                                <td style="padding: 10px 0 10px 15px; vertical-align: top;">
                                  <p style="color: #cccccc; font-size: 16px; margin: 0; line-height: 1.5;">
                                    Explore the exclusive <strong style="color: #ffffff;">"Be Your Own Light"</strong> collection
                                  </p>
                                </td>
                              </tr>
                            </table>
                            
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Call to Action Button -->
                  <tr>
                    <td align="center" style="padding: 0 40px 50px 40px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); border-radius: 8px; box-shadow: 0 4px 16px rgba(255,255,255,0.2);">
                            <a href="http://localhost:4328" 
                               style="display: inline-block; padding: 18px 40px; color: #000000; text-decoration: none; font-weight: bold; font-size: 18px; letter-spacing: 1px; text-transform: uppercase;">
                              Enter Store Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Collection Preview -->
                  <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                      <h4 style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; text-align: center; font-weight: 400;">
                        What's Waiting for You
                      </h4>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 0 10px 20px 10px; width: 50%;">
                            <img src="https://www.brisclothing.com/images/fatlil.2_1755650727_3702989146314406154_305151088.jpg" 
                                 alt="BRISC White Tee" 
                                 width="200" 
                                 height="200" 
                                 style="display: block; border-radius: 8px; max-width: 100%; height: auto;" />
                            <p style="color: #cccccc; font-size: 14px; margin: 10px 0 0 0; text-align: center;">
                              Be Your Own Light (White)
                            </p>
                          </td>
                          <td align="center" style="padding: 0 10px 20px 10px; width: 50%;">
                            <img src="https://www.brisclothing.com/images/fatlil.2_1755650727_3702989146557587913_305151088.jpg" 
                                 alt="BRISC Black Tee" 
                                 width="200" 
                                 height="200" 
                                 style="display: block; border-radius: 8px; max-width: 100%; height: auto;" />
                            <p style="color: #cccccc; font-size: 14px; margin: 10px 0 0 0; text-align: center;">
                              Be Your Own Light (Black)
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 60px 40px; border-top: 1px solid #333333;">
                      
                      <p style="color: #888888; font-size: 14px; margin: 0 0 15px 0; text-align: center; line-height: 1.5;">
                        <strong style="color: #ffffff;">BRISC Streetwear</strong><br>
                        Exclusive Access • Limited Time Only
                      </p>
                      
                      <p style="color: #666666; font-size: 12px; margin: 0 0 20px 0; text-align: center; line-height: 1.4;">
                        Born in Thibodaux • Built for Leaders • Worn by Legends
                      </p>
                      
                      <div style="text-align: center; margin: 20px 0;">
                        <a href="https://www.instagram.com/fatlil.2/related_profiles/?api=1%2F&hl=zh-cn" 
                           style="color: #888888; text-decoration: none; font-size: 14px; margin: 0 15px;">
                          Follow the Light →
                        </a>
                      </div>
                      
                      <p style="color: #555555; font-size: 11px; margin: 20px 0 0 0; text-align: center; line-height: 1.3;">
                        This email was sent to ${email} because you requested exclusive access to BRISC.<br>
                        Your access code expires in 24 hours for security.
                      </p>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
      text: `
BRISC EXCLUSIVE ACCESS

Welcome to BRISC. You've been granted exclusive access to our latest collection.

Your Access Code: light2025

How to Access:
1. Visit localhost:4321
2. Enter the access code: light2025
3. Explore the exclusive BRISC collection

Be Your Own Light.

---
BRISC Streetwear - LOCAL TEST
Born in Thibodaux • Built for Leaders • Worn by Legends
      `
    });

    if (error) {
      console.error('[BRISC API] Resend error:', error);
      return res.status(400).json({ 
        error: 'Failed to send email', 
        details: error.message 
      });
    }

    console.log('[BRISC API] Email sent successfully:', data);
    
    return res.status(200).json({ 
      success: true, 
      messageId: data.id,
      message: 'Access email sent successfully'
    });

  } catch (error) {
    console.error('[BRISC API] Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BRISC Email API is running' });
});

app.listen(port, () => {
  console.log(`🚀 BRISC Email API running at http://localhost:${port}`);
  console.log(`📧 Test endpoint: http://localhost:${port}/api/send-access-email`);
  console.log(`💡 Make sure your frontend points to this URL for testing`);
});
