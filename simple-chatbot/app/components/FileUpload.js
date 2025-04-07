"use client";
import { Paperclip, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as mammoth from "mammoth";

export default function FileUpload({ onFileSelect, fileData, onRemoveFile }) {
  const [pdfjsLib, setPdfjsLib] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const pdfjs = await import("pdfjs-dist/build/pdf");
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        setPdfjsLib(pdfjs);
      })();
    }
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max allowed size is 5MB.");
      return;
    }

    const fileType = file.type;
    let extractedText = "";

    if (fileType === "application/pdf" && pdfjsLib) {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          extractedText += pageText + "\n";
        }

        onFileSelect({ name: file.name, text: extractedText, type: fileType });
      };
      reader.readAsArrayBuffer(file);
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await mammoth.extractRawText({ arrayBuffer: reader.result });
        extractedText = result.value;
        onFileSelect({ name: file.name, text: extractedText, type: fileType });
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType.startsWith("image/")) {
      onFileSelect({ name: file.name, text: "[Image uploaded]", type: fileType });
    } else {
      alert("Unsupported file type.");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="cursor-pointer w-6 h-6 flex items-center justify-center">
        <Paperclip className="w-5 h-5 text-gray-600" />
        <input type="file" className="hidden" onChange={handleFileUpload} />
      </label>

      {fileData && (
        <div className="flex items-center space-x-2 bg-gray-200 px-2 py-1 rounded">
          <span className="text-sm">{fileData.name}</span>
          <button onClick={onRemoveFile}>
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
