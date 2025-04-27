import React, { useState } from 'react';
import styles from './DownloadPdf.module.css';
import ErrorPopup from '../ErrorPopup/ErrorPopup';

interface DownloadPdfProps {
  title: string;
  pdfContent: string;
}

const DownloadPdf: React.FC<DownloadPdfProps> = ({ title, pdfContent }) => {
  const [message, setMessage] = useState<string>('');

  const handleDownload = () => {
    if ((window as any).jspdf) {
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();

      doc.setFont('Helvetica');
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 80, 20);

      doc.setFontSize(12);
      doc.text(pdfContent, 20, 40);

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link); // не всегда обязательно, но иногда нужно в Safari
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } else {
      setMessage('jsPDF has not been loaded, please try again later');
    }
  };

  return (
    <section className={styles.downloadCatalogue}>
      <button onClick={handleDownload} className={styles.downloadButton}>
        Download Catalogue
      </button>
      <ErrorPopup message={message} onClose={() => setMessage('')} />
    </section>
  );
};

export default DownloadPdf;
