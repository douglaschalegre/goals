import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportKanbanToPNG(): Promise<Blob | null> {
  const kanban = document.getElementById("goals-kanban");
  if (!kanban) {
    console.error("Kanban element not found");
    return null;
  }

  try {
    const canvasElement = await html2canvas(kanban, {
      backgroundColor: "#f9fafb", // bg-gray-50
      scale: 2, // Higher quality
      logging: false,
      useCORS: true, // Allow cross-origin images
      scrollX: 0,
      scrollY: 0,
    });

    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  } catch (error) {
    console.error("Failed to export kanban to PNG:", error);
    return null;
  }
}

export async function exportKanbanToPDF(): Promise<Blob | null> {
  const kanban = document.getElementById("goals-kanban");
  if (!kanban) {
    console.error("Kanban element not found");
    return null;
  }

  try {
    const canvasElement = await html2canvas(kanban, {
      backgroundColor: "#f9fafb",
      scale: 2,
      logging: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvasElement.toDataURL("image/png");

    // Use landscape orientation for wide Kanban board
    const pdf = new jsPDF({
      orientation: "landscape",
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

    // Center the image on the page
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, "PNG", x, y, width, height);

    return pdf.output("blob");
  } catch (error) {
    console.error("Failed to export kanban to PDF:", error);
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
