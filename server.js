import dotenv from "dotenv";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import htmlToPDF from "./utils/html-to-pdf.js";
import { uploadPDF2S3Signed } from "./utils/S3.js";

// access .env variables
dotenv.config({ path: "./.env.local" });
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;

// create instance of express server
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<p>Welcome to Airlabel. Submit post reqeust to /html-to-pdf.</p>");
});

app.post("/html-to-pdf", async (req, res) => {
  try {
    // access params
    const html = req.body.html;
    const pdfOptions = req.body.pdfOptions;

    // create pdf
    const pdfBuffer = await htmlToPDF(html, pdfOptions);

    // create pdfKey UUID
    let pdfKey = uuidv4();

    const url = await uploadPDF2S3Signed(
      accessKeyId,
      secretAccessKey,
      region,
      bucketName,
      pdfKey,
      pdfBuffer
    );

    res.status(200).send({ url: url });
  } catch (e) {
    (e) => res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`Airlabel listening on port ${port}`);
});
