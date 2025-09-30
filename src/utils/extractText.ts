import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// @ts-ignore: Import worker for pdfjs
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();


  export async function extractTextFromFile(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  } else if (fileName.endsWith(".docx")) {
    return await extractTextFromDocx(file);
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
  }
}

 async function extractTextFromPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  console.log(arrayBuffer)
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  // console.log("hi")
 console.log("Pages:", pdf.numPages);
 if(pdf.numPages === 0 || pdf.numPages>1){
   throw new Error("Error in pdf");
 }
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  console.log("Extracted Text:", text);

  return text;
}

async function extractTextFromDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  console.log("Extracted Text from DOCX:", text);
  return text;
}
