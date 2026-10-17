const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const origin = request.headers.origin || '';
  const allowedOrigin = /^https:\/\/(?:www\.)?quantaflexmedia\.com$/.test(origin) || /^https:\/\/quantaflex-website(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
  if (origin && !allowedOrigin) return response.status(403).json({ error: 'Invalid origin' });

  const name = clean(request.body?.name, 120);
  const email = clean(request.body?.email, 254);
  const message = clean(request.body?.message, 4000);
  const website = clean(request.body?.website, 200);

  if (website) return response.status(200).json({ ok: true });
  if (name.length < 2 || !emailPattern.test(email) || message.length < 4) {
    return response.status(400).json({ error: 'Please complete all fields.' });
  }
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured');
    return response.status(503).json({ error: 'Contact service unavailable' });
  }

  try {
    const subject = `Quantaflex website enquiry — ${name}`;
    const textContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const htmlContent = `<h2>Quantaflex website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`;
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: 'Quantaflex', email: 'info@quantaflexmedia.com' },
        to: [{ email: 'info@quantaflexmedia.com', name: 'Quantaflex' }],
        replyTo: { email, name },
        subject,
        textContent,
        htmlContent
      })
    });
    if (!brevoResponse.ok) {
      console.error('Brevo contact delivery failed', brevoResponse.status);
      return response.status(502).json({ error: 'Contact delivery failed' });
    }
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact delivery error', error);
    return response.status(500).json({ error: 'Contact service unavailable' });
  }
};
