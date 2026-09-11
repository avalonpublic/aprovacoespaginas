const LIFEOS_API =
  process.env.LIFEOS_API_URL || "https://ikiapp-lifeos-api.fly.dev";

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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

    const upstream = await fetch(`${LIFEOS_API.replace(/\/$/, "")}/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": req.headers["user-agent"] || "iki-lp-waitlist",
      },
      body: JSON.stringify({ email, source: "lp" }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("[waitlist] Life OS error:", upstream.status, data);
      return res.status(502).json({ ok: false, error: "upstream_failed" });
    }

    console.log(
      `[waitlist] lead ${email} → Fly id=${data.id} new=${data.is_new} emailed=${data.emailed}`,
    );
    return res.status(200).json({
      ok: true,
      via: "lifeos",
      is_new: Boolean(data.is_new),
      emailed: Boolean(data.emailed),
    });
  } catch (error) {
    console.error("[waitlist] internal:", error?.message || error);
    return res.status(500).json({ ok: false, error: "internal" });
  }
};
