const WAITLIST_TO = process.env.WAITLIST_TO || "ikiapp.mkt@gmail.com";

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

async function sendWithResend(email) {
  const token = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || process.env.WAITLIST_FROM;
  if (!token || !from) return { ok: false, reason: "resend-not-configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [WAITLIST_TO],
      reply_to: email,
      subject: `IkiApp — pedido de vaga beta: ${email}`,
      text: [
        "Novo pedido de acesso ao beta (lista dos 100).",
        "",
        `E-mail: ${email}`,
        `Quando: ${new Date().toISOString()}`,
        "",
        "Origem: www.ikiapp.co — Quer estar entre os 100?",
      ].join("\n"),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[waitlist] Resend error:", data);
    return { ok: false, reason: "resend-failed", data };
  }
  return { ok: true, via: "resend", data };
}

/** Fallback sem segredo na Vercel — a caixa precisa confirmar o FormSubmit 1×. */
async function sendWithFormSubmit(email) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(WAITLIST_TO)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      _subject: `IkiApp — pedido de vaga beta: ${email}`,
      _template: "table",
      _captcha: "false",
      message: `Novo pedido de acesso ao beta (lista dos 100).\nE-mail: ${email}\nQuando: ${new Date().toISOString()}`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === "false") {
    console.error("[waitlist] FormSubmit error:", data);
    return { ok: false, reason: "formsubmit-failed", data };
  }
  return { ok: true, via: "formsubmit", data };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    let result = await sendWithResend(email);
    if (!result.ok) {
      result = await sendWithFormSubmit(email);
    }

    if (!result.ok) {
      return res.status(502).json({ ok: false, error: "delivery_failed" });
    }

    console.log(`[waitlist] lead ${email} via ${result.via} → ${WAITLIST_TO}`);
    return res.status(200).json({ ok: true, via: result.via });
  } catch (error) {
    console.error("[waitlist] internal:", error?.message || error);
    return res.status(500).json({ ok: false, error: "internal" });
  }
};
