import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPDF(title: string, columns: string[], rows: (string | number)[][]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(new Date().toLocaleString(), 14, 24);
  autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows.map((r) => r.map((c) => String(c ?? ""))),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [79, 70, 229] },
  });
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportToExcel(filename: string, sheetName: string, rows: Record<string, unknown>[]) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
