import QRCode from "qrcode-svg";

// given an html string, find <qr/> tags and replace with qr image
// todo: confirm all qrs are swapped
export default function QR(html) {
  // regular expression - match all qr tags in the html document string
  const qrMatch = html.match(/<qr[^>]*>/gi);

  // if there is a match, replace each with generated qr
  if (qrMatch) {
    for (const qrEl of qrMatch) {
      // locate the content attribute
      const contentMatch = qrEl.match(/content="([^"]+)"/i);
      const content = contentMatch ? contentMatch[1] : null;

      // locate the size attribute
      const sizeMatch = qrEl.match(/size="(\d+)"/i);
      const size = sizeMatch ? parseInt(sizeMatch[1], 10) : null;

      // generate new qr
      const qr = new QRCode({
        content: content,
        padding: 4,
        width: size,
        height: size,
        color: "#000000",
        background: "#ffffff",
      });

      // replace each element in match with qr svg
      html = html.replace(qrEl, qr.svg());
    }
  }

  return html;
}
