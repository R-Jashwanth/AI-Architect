import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (file) {
            setFileName(file.name);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onFileSelect(file);
        }
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileChange(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFileName(null);
        setPreviewUrl(null);
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={onInputChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                aria-label="Upload file"
            />

            {!fileName ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative group cursor-pointer
                        border-2 border-dashed rounded-xl p-8
                        transition-all duration-300 ease-in-out
                        flex flex-col items-center justify-center text-center
                        ${isDragging
                            ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-white/10'
                            : 'border-gray-300 dark:border-white/20 hover:border-gray-500 dark:hover:border-white/50 hover:bg-gray-50 dark:hover:bg-white/5 bg-white/50 dark:bg-black/20'
                        }
                    `}
                >
                    <div className={`
                        p-4 rounded-full mb-4 transition-transform duration-300
                        ${isDragging ? 'scale-110 bg-black/10 dark:bg-white/20' : 'bg-black/5 dark:bg-white/5 group-hover:scale-110 group-hover:bg-black/10 dark:group-hover:bg-white/10'}
                    `}>
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`} />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Click or drag image here</p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP</p>
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/20 bg-white dark:bg-black/40 shadow-sm dark:shadow-none">
                    <div className="flex items-center p-3 gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-black/50 flex-shrink-0 overflow-hidden relative border border-gray-200 dark:border-white/10">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="text-gray-400 dark:text-gray-600" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{fileName}</p>
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Ready for analysis
                            </p>
                        </div>
                        <button
                            onClick={handleClear}
                            aria-label="Remove file"
                            title="Remove file"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress bar simulation */}
                    <div className="h-0.5 w-full bg-gray-100 dark:bg-white/10">
                        <div className="h-full bg-black dark:bg-white w-full animate-[progress_1s_ease-out]" />
                    </div>
                </div>
            )}
        </div>
    );
};