import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportCanvasToPNG(): Promise<Blob | null> {
  const canvas = document.getElementById("goals-canvas");
  if (!canvas) {
    console.error("Canvas element not found");
    return null;
  }

  try {
    const canvasElement = await html2canvas(canvas, {
      backgroundColor: "#ffffff",
      scale: 2, // Higher quality
      logging: false,
      useCORS: true, // Allow cross-origin images
    });

    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  } catch (error) {
    console.error("Failed to export canvas to PNG:", error);
    return null;
  }
}

export async function exportCanvasToPDF(): Promise<Blob | null> {
  const canvas = document.getElementById("goals-canvas");
  if (!canvas) {
    console.error("Canvas element not found");
    return null;
  }

  try {
    const canvasElement = await html2canvas(canvas, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvasElement.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvasElement.width;
    const imgHeight = canvasElement.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    return pdf.output("blob");
  } catch (error) {
    console.error("Failed to export canvas to PDF:", error);
    return null;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
