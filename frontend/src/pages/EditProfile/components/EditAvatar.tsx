import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

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
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setIsCropping(true);
  };

  const handleCropConfirm = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
      setNewAvatar(croppedFile);
      setPreviewUrl(URL.createObjectURL(croppedFile));
      setIsCropping(false);
    });
  };

  const handleCropCancel = () => {
    setIsCropping(false);
  };

  return (
    <div className="w-48">
      {isCropping ? (
        <div className="flex flex-col items-center">
          <div className="w-48 h-48">
            <Cropper
              src={previewUrl}
              style={{ height: "100%", width: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={true}
              viewMode={1}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              ref={cropperRef}
            />
          </div>

          {/* Botões centralizados abaixo do cropper */}
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={handleCropConfirm}
            >
              Confirmar
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              onClick={handleCropCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
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
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}