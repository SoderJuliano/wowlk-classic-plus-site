/**
 * Branded e-mail templates for the SERVER worker (not used by the browser).
 * Send with Abra API:  POST https://abra-api.top/email/send-email/html
 *   { "email": "...", "subject": "...", "htmlContent": "..." }
 * The JSON-body HTML endpoint is used because the text-only endpoint takes the message
 * as a URL path segment, which breaks links containing "/" and "?".
 */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function layout({ title, intro, cta, url, outro }) {
  return `<!doctype html><html><body style="margin:0;background:#060b12;font-family:Segoe UI,Arial,sans-serif;color:#c9d5e2">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060b12;padding:32px 12px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0c1724;border:1px solid #7a5519;border-radius:8px">
<tr><td style="padding:28px 32px 8px;text-align:center">
  <div style="font:700 13px Georgia,serif;letter-spacing:4px;color:#e9c46a">WOW CLASSIC PLUS LK</div>
  <h1 style="margin:18px 0 6px;font:700 24px Georgia,serif;color:#eef3f8">${esc(title)}</h1>
</td></tr>
<tr><td style="padding:8px 32px;font-size:15px;line-height:1.6">${intro}</td></tr>
<tr><td align="center" style="padding:18px 32px">
  <a href="${esc(url)}" style="display:inline-block;padding:14px 30px;border-radius:4px;background:#e9c46a;color:#2a1a04;font:700 14px Georgia,serif;letter-spacing:2px;text-decoration:none">${esc(cta)}</a>
</td></tr>
<tr><td style="padding:0 32px 8px;font-size:12px;color:#6e8093;word-break:break-all">Or paste this link into your browser:<br>${esc(url)}</td></tr>
<tr><td style="padding:16px 32px 28px;font-size:13px;color:#9aabbd;line-height:1.6">${outro}</td></tr>
</table>
<p style="font-size:11px;color:#6e8093;max-width:560px">WoW Classic Plus LK is an independent fan project, not affiliated with Blizzard Entertainment.</p>
</td></tr></table></body></html>`
}

export const downloadsReadyEmail = ({ siteUrl }) => ({
  subject: 'WoW Classic Plus LK — downloads are live',
  htmlContent: layout({
    title: 'The gates are open',
    intro: 'The game clients are now available. See you in Northrend.',
    cta: 'Download the game',
    url: `${siteUrl}/#downloads`,
    outro: 'You received this because you asked to be notified when downloads became available.'
  })
})
