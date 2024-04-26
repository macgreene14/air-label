import puppeteer from "puppeteer";
import QR from "./qr.js";

// given an html string and pdfOptions
export default async function htmlToPDF(html, pdfOptions) {
  // add qr code
  const htmlWithQr = QR(html);

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ],
  });
  const page = await browser.newPage();

  // Set page content to modified HTML
  await page.setContent(htmlWithQr, {
    waitUntil: "networkidle0", // Wait for all network connections to finish
  });

  // Generate PDF and save to file
  // pdfOptions puppeteer docs https://pptr.dev/api/puppeteer.pdfoptions
  const pdfBuffer = await page.pdf(pdfOptions);

  await browser.close();

  // Return or save the PDF buffer as needed
  return pdfBuffer; // You can also save the buffer to a file, depending on your requirements
}
