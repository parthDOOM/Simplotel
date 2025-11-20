import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Message } from '../types';

export const generatePDF = (messages: Message[], sessionId: string): void => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(51, 51, 51);
  doc.text('Conversation Transcript', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Session ID: ${sessionId}`, 14, 28);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 34);
  doc.text(`Total Messages: ${messages.length}`, 14, 40);

  const tableData = messages.map(msg => [
    msg.role === 'user' ? 'You' : 'Bot',
    msg.content,
    new Date(msg.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  ]);

  autoTable(doc, {
    startY: 48,
    head: [['Speaker', 'Message', 'Time']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [51, 51, 51],
      lineColor: [100, 116, 139],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [245, 245, 240],
      textColor: [51, 51, 51],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 248]
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 120 },
      2: { cellWidth: 30 }
    }
  });

  const fileName = `conversation-${sessionId}-${Date.now()}.pdf`;
  doc.save(fileName);
};
