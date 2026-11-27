import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Loads a PDF ArrayBuffer / File and returns page count + thumbnail renderer helper.
 */
export async function loadPdfDocument(file) {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdfDoc = await loadingTask.promise;
  return pdfDoc;
}

/**
 * Renders a single PDF page onto an offscreen canvas and returns a PNG Blob + dimensions.
 */
export async function renderPdfPageToBlob(
  pdfDoc,
  pageNumber,
  { scale = 1.8 } = {},
) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport }).promise;

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png", 0.92),
  );

  // Release canvas memory promptly
  canvas.width = 0;
  canvas.height = 0;

  return {
    blob,
    width: viewport.width,
    height: viewport.height,
  };
}
