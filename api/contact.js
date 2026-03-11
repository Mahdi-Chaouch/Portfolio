const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message, website } = req.body || {};

  // Honeypot anti-spam : si le champ caché est rempli, on ignore l'envoi.
  if (website) {
    return res.status(200).json({ success: true, ignored: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "mahdichaouch67@icloud.com",
      subject: `Portfolio contact: ${subject || "Message"}`,
      replyTo: email,
      html: `
        <h2>Nouveau message du portfolio</h2>

        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject || "Sans sujet"}</p>

        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });

    // Après l'envoi d'email, on tente d'envoyer également une notification sur Discord.
    if (discordWebhookUrl) {
      const plainMessage = String(message || "");
      const truncatedMessage =
        plainMessage.length > 1800
          ? `${plainMessage.slice(0, 1800)}…`
          : plainMessage;

      const discordPayload = {
        content: [
          "📨 **Nouveau message reçu depuis le portfolio**",
          `**Nom** : ${name}`,
          `**Email** : ${email}`,
          `**Sujet** : ${subject || "Sans sujet"}`,
          "",
          truncatedMessage || "_(message vide)_",
        ].join("\n"),
      };

      try {
        await fetch(discordWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(discordPayload),
        });
      } catch (discordError) {
        // On ne fait pas échouer la requête si Discord est indisponible.
        console.error("Discord webhook failed", discordError);
      }
    } else {
      // Pas de webhook configuré : on log seulement côté serveur.
      console.warn(
        "DISCORD_WEBHOOK_URL is not set; contact messages will not be mirrored to Discord."
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Email failed",
    });
  }
};