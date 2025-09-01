import { useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface EditAvatarProps {
  previewUrl: string;
  setNewAvatar: (file: File) => void;
  setPreviewUrl: (url: string) => void;
}

export default function EditAvatar({
  previewUrl,
  setNewAvatar,
  setPreviewUrl,
}: EditAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className="relative w-48 h-48 cursor-pointer group"
      onClick={() => fileInputRef.current?.click()}
    >
      <Avatar className="w-full h-full rounded-full overflow-hidden relative">
        <AvatarImage
          src={previewUrl}
          alt="Avatar"
          className="object-cover w-full h-full transition brightness-100 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
      </Avatar>

      <div
        className="
          absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-md
          flex items-center justify-center
          transition-transform duration-300
          group-hover:scale-110
          group-hover:rotate-12
          z-10
        "
        aria-label="Alterar avatar"
      >
        <Camera className="w-6 h-6 text-[var(--text)]" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setNewAvatar(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
}
