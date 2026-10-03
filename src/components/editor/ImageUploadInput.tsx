"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon, Trash2, CheckCircle2 } from "lucide-react";

interface ImageUploadInputProps {
  label: string;
  imageUrl: string;
  onImageChange: (url: string) => void;
  aspectRatio?: "square" | "portrait";
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  imageUrl,
  onImageChange,
  aspectRatio = "square",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset value so re-selecting same file triggers onChange
    if (e.target) e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange("");
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#5a483e]">
          {label}
        </label>
        {imageUrl && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Photo loaded
          </span>
        )}
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={`relative group rounded-xl p-3 border-2 border-dashed transition-all duration-200 cursor-pointer flex items-center gap-3.5 select-none ${
          isDragging
            ? "border-[#9e2a2b] bg-[#faebea] scale-[1.01] shadow-md"
            : imageUrl
            ? "border-[#d8c8b6] bg-white hover:border-[#9e2a2b]/70 hover:bg-[#fefcf9]"
            : "border-[#dfd0be] bg-[#faf6f0] hover:border-[#9e2a2b]/70 hover:bg-[#fffdfa]"
        }`}
      >
        {/* Thumbnail Preview or Empty Icon */}
        <div
          className={`relative rounded-lg overflow-hidden bg-stone-100 border border-[#d8c8b6] shrink-0 shadow-2xs ${
            aspectRatio === "portrait" ? "w-16 h-20" : "w-16 h-16"
          }`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Photo preview"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
              <ImageIcon className="w-6 h-6 text-[#9e2a2b]/50 group-hover:scale-110 transition-transform" />
            </div>
          )}
        </div>

        {/* Text and Actions */}
        <div className="flex-1 min-w-0">
          {imageUrl ? (
            <div>
              <p className="text-xs font-medium text-[#3e2e26] truncate">
                Photo added successfully
              </p>
              <p className="text-[11px] text-[#8c7769] mt-0.5">
                Drag a new image here, or click to replace
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#581620] hover:bg-[#430f16] text-[#fff8ee] text-[11px] font-medium transition-colors shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Choose from device</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#f5e8e8] hover:bg-[#ebd0d0] text-[#9e2a2b] text-[11px] font-medium transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium text-[#3e2e26] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span>
                  {isDragging ? "Drop your photo right here!" : "Drag & drop your photo here"}
                </span>
              </p>
              <p className="text-[11px] text-[#8c7769] mt-0.5">
                or click to browse photos from your device
              </p>
              <span className="inline-block text-[10px] text-[#a69283] font-mono mt-1">
                PNG, JPG, WEBP, GIF supported
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
