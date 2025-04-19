import { useState, useRef, DragEvent, ChangeEvent, KeyboardEvent } from 'react';

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
}

export default function FileSelector({ onFileSelect }: FileSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleButtonClick();
    }
  };

  return (
    <div
      className={`relative inline-block ${isDragging ? 'opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Attach file"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInput}
        aria-hidden="true"
        id="file-input"
      />
      <button
        className="bg-gray-300 hover:bg-gray-400 rounded-md px-3 py-2 transition-colors"
        onClick={handleButtonClick}
        aria-label="Attach file"
        type="button"
      >
        <span role="img" aria-label="Paperclip">
          📎
        </span>
      </button>
    </div>
  );
}
