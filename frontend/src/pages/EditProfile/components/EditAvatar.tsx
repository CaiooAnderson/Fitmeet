import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { AlertDialog, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCropImage(url);
      setOpen(true);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas({ width: 400, height: 400 }).toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

      setNewAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOpen(false);
    }, "image/jpeg");
  };

  return (
    <>
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

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTitle />
        <AlertDialogDescription />
        <AlertDialogContent className="sm:max-w-[500px]">
          <div className="sm:hidden fixed top-2 right-2 w-full z-50 flex justify-end px-6 py-2 mt-[calc(env(safe-area-inset-top)+1rem)]">
            <AlertDialogClose />
          </div>
          <div className="hidden sm:flex absolute top-2 right-2">
            <AlertDialogClose />
          </div>
          {cropImage && (
            <Cropper
              src={cropImage}
              style={{ height: 400, width: "100%" }}
              aspectRatio={1}
              guides={false}
              viewMode={1}
              ref={cropperRef}
              autoCropArea={1}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
          )}

          <AlertDialogFooter className="justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrop}>Confirmar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
