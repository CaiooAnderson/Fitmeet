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
        className="text-[1rem] font-semibold h-5 text-[var(--text)] [@media(max-width:320px)]:w-4/5 [@media(max-width:320px)]:mx-auto"
      >
        Imagem <span className="text-[var(--warning)] h-5">*</span>
      </Label>

      <label
        htmlFor="image"
        className={`
      group
      w-80 
      rounded-lg 
      flex items-center justify-center 
      cursor-pointer 
      overflow-hidden 
      transition-all duration-300
      outline-1 outline-[var(--border)]
      hover:outline-[var(--primary)] 
      hover:shadow-lg
      relative
      ${imageLabelClassName ?? "h-32"} [@media(max-width:320px)]:w-4/5 [@media(max-width:320px)]:mx-auto
    `}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-full object-cover rounded-lg transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
          </div>
        ) : (
          <ImageIcon className="w-8 h-8 text-border-foreground font-normal transition-colors duration-300 group-hover:text-[var(--primary-600)]" />
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
