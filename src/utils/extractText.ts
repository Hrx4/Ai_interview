import * as pdfjsLib from "pdfjs-dist";

// @ts-ignore: Import worker for pdfjs
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();


export async function extractTextFromPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  console.log(arrayBuffer)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  // console.log("hi")
 console.log("Pages:", pdf.numPages);
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  console.log("Extracted Text:", text);

  return text;
}