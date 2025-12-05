import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendGoalsReminderEmail(
  to: string,
  name: string | undefined,
  goalsImageUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to: [to],
      subject: "🎯 Your Goals from One Year Ago",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 40px 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                color: white;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
              }
              .content {
                background: #fff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .goals-image {
                width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .reflection {
                background: #f7fafc;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .reflection h3 {
                margin-top: 0;
                color: #667eea;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #718096;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎯 Time to Reflect!</h1>
              <p>One year ago, you set these goals...</p>
            </div>

            <div class="content">
              <p><strong>${name ? `Hi ${name},` : "Hello!"}</strong></p>

              <p>
                A year ago today, you took the time to visualize your goals and dreams.
                You created a vision board to guide your journey over the past year.
              </p>

              <p><strong>Here's your vision board from one year ago:</strong></p>

              <img src="${goalsImageUrl}" alt="Your Goals Vision Board" class="goals-image" />

              <div class="reflection">
                <h3>Take a moment to reflect:</h3>
                <ul>
                  <li>Which goals did you achieve?</li>
                  <li>What surprised you about your journey?</li>
                  <li>How have you grown over the past year?</li>
                  <li>What would you tell your past self?</li>
                </ul>
              </div>

              <p>
                Whether you achieved everything you set out to do or your path took an
                unexpected turn, remember that growth isn't always linear. Every step
                forward counts, and you've made it this far!
              </p>

              <p>
                <strong>What's next?</strong> Consider creating a new vision board for
                the year ahead, building on your experiences and dreaming even bigger.
              </p>

              <p style="margin-top: 30px;">
                Wishing you continued success and growth,<br>
                <strong>The Goals Vision Board Team</strong>
              </p>
            </div>

            <div class="footer">
              <p>This email was sent because you created a vision board on our platform one year ago.</p>
              <p>© ${new Date().getFullYear()} Goals Vision Board. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export { resend };
