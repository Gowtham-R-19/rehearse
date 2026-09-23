// Reads text out of an uploaded PDF, fully in the browser (pdf.js). Nothing is uploaded anywhere.
// pdf.js is loaded on demand so the first page load stays small.

export async function readPdf(file) {
  const pdfjsLib = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.js?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent();
    const lines = []; let line = '', lastY = null;
    for (const it of content.items) {
      const y = Math.round(it.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 3) { lines.push(line.trim()); line = ''; }
      line += it.str + (it.hasEOL ? '' : ' '); lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.join('\n'));
  }
  return pages.join('\n');
}
