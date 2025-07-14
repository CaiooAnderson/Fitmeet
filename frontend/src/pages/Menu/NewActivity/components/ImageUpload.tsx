import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  image: File | null;
  previewUrl: string | null;
  handleFileChange: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;
  imageLabelClassName?: string;
}

export default function ImageUpload({
  previewUrl,
  handleFileChange,
  setPreviewUrl,
  imageLabelClassName,
}: ImageUploadProps) {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      handleFileChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor="image"
        className="text-[1rem] font-semibold h-5 text-[var(--text)]"
      >
        Imagem <span className="text-[var(--warning)] h-5">*</span>
      </Label>
      <label
        htmlFor="image"
        className={`w-80 outline-1 outline-[var(--border)] rounded-lg flex items-center justify-center cursor-pointer ${imageLabelClassName ?? "h-32"}`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-border-foreground font-normal" />
        )}
      </label>
      <Input
        id="image"
        type="file"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
