import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/api/questions";

interface ImageUploadProps {
  imageUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ imageUrl, onUpload, onRemove }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUpload(url);
    } catch {
      alert("Ошибка загрузки изображения");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (imageUrl) {
    return (
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt="Изображение вопроса"
          className="w-full max-h-60 object-contain rounded-lg border border-border"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-background/80"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="p-4 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {uploading ? "Загрузка..." : "Нажмите или перетащите изображение сюда"}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </>
  );
}