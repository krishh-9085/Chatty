import React from 'react';
import { DownloadIcon, XIcon } from 'lucide-react';

export default function ImagePreviewModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'image.jpg';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-800/50 rounded-lg shadow-2xl p-4 m-5 max-w-4xl w-full max-h-[90vh] flex flex-col items-center border border-slate-700/50"
        onClick={handleModalContentClick}
      >
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-2 rounded-full transition-colors"
            onClick={handleDownload}
            aria-label="Download image"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
          <button
            className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-2 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-md" />
      </div>
    </div>
  );
}
