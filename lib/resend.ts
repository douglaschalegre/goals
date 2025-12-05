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
      subject: "🎯 Suas Metas de Um Ano Atrás",
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
              <h1>🎯 Hora de Refletir!</h1>
              <p>Um ano atrás, você definiu essas metas...</p>
            </div>

            <div class="content">
              <p><strong>${name ? `Olá ${name},` : "Olá!"}</strong></p>

              <p>
                Há um ano atrás, você dedicou tempo para visualizar suas metas e sonhos.
                Você criou um quadro de visão para guiar sua jornada ao longo do último ano.
              </p>

              <p><strong>Aqui está seu quadro de visão de um ano atrás:</strong></p>

              <img src="${goalsImageUrl}" alt="Seu Quadro de Metas" class="goals-image" />

              <div class="reflection">
                <h3>Reserve um momento para refletir:</h3>
                <ul>
                  <li>Quais metas você conquistou?</li>
                  <li>O que te surpreendeu em sua jornada?</li>
                  <li>Como você cresceu ao longo do último ano?</li>
                  <li>O que você diria para seu eu do passado?</li>
                </ul>
              </div>

              <p>
                Seja você tendo conquistado tudo o que se propôs a fazer ou seu caminho tendo tomado um
                rumo inesperado, lembre-se de que o crescimento nem sempre é linear. Cada passo
                à frente conta, e você chegou até aqui!
              </p>

              <p>
                <strong>E agora?</strong> Considere criar um novo quadro de visão para
                o próximo ano, construindo sobre suas experiências e sonhando ainda maior.
              </p>

              <p style="margin-top: 30px;">
                Desejamos sucesso e crescimento contínuo,<br>
                <strong>Equipe Quadro de Metas</strong>
              </p>
            </div>

            <div class="footer">
              <p>Este e-mail foi enviado porque você criou um quadro de visão em nossa plataforma há um ano.</p>
              <p>© ${new Date().getFullYear()} Quadro de Metas. Todos os direitos reservados.</p>
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
