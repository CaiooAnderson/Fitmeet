import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import ImageUpload from "./components/ImageUpload";
import Inputs from "./components/Inputs";
import Schedule from "./components/Schedule";
import TypesAndLocation from "./components/TypesAndLocation";
import Approval from "./components/Approval";

interface NewActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewActivity({ isOpen, onClose }: NewActivityProps) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activityTypeId, setActivityTypeId] = useState<string>("");
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [approvalRequired, setApprovalRequired] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/activities/types", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setActivityTypes(data))
        .catch(() => toast.error("Erro ao carregar os tipos de atividade."));
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setImage(null);
      setPreviewUrl(null);
      setActivityTypeId("");
      setTitle("");
      setDescription("");
      setCoordinates(null);
      setApprovalRequired(false);
      setScheduledDate(undefined);
    }
  }, [isOpen]);

  const handleCreateActivity = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    if (!image) {
      toast.error("Selecione uma imagem.");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(image.type)) {
      toast.error("A imagem deve ser um arquivo PNG, JPG ou JPEG.");
      return;
    }

    if (
      !title ||
      !description ||
      !activityTypeId ||
      !coordinates ||
      !scheduledDate
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const now = new Date();

    if (scheduledDate.getTime() <= now.getTime()) {
      toast.error("Você precisa inserir uma data futura para agendar");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("typeId", activityTypeId);
    formData.append(
      "address",
      JSON.stringify({ latitude: coordinates.lat, longitude: coordinates.lng })
    );
    formData.append("scheduledDate", scheduledDate.toISOString());
    formData.append("private", String(approvalRequired));

    try {
      const response = await fetch("http://localhost:3000/activities/new", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(
          result?.error || result?.message || "Erro ao criar atividade."
        );
        return;
      }

      toast.success("Atividade criada com sucesso!", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      toast.error("Erro ao criar atividade.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[784px] h-[770px] border-0 p-6">
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <AlertDialogTitle className="text-[2rem] font-bebas font-normal">
              NOVA ATIVIDADE
            </AlertDialogTitle>
            <AlertDialogDescription />

            <div className="mt-12">
              <div className="flex justify-evenly gap-12">
                <div className="flex flex-col gap-4">
                  <ImageUpload
                    image={image}
                    previewUrl={previewUrl}
                    handleFileChange={setImage}
                    setPreviewUrl={setPreviewUrl}
                  />
                  <Inputs
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                  />
                  <Schedule
                    scheduledDate={scheduledDate}
                    setScheduledDate={setScheduledDate}
                  />
                </div>

                <div className="flex flex-col gap-6 w-80">
                  <TypesAndLocation
                    activityTypes={activityTypes}
                    activityType={activityTypeId}
                    setActivityType={setActivityTypeId}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                  />
                  <Approval
                    approvalRequired={approvalRequired}
                    setApprovalRequired={setApprovalRequired}
                  />
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="w-full flex justify-end">
            <div className="w-full h-[48px] flex justify-end gap-4">
              <AlertDialogCancel className="w-50 h-full rounded-lg text-white text-sm">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-50 h-full rounded-lg bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary-600)]"
                onClick={handleCreateActivity}
              >
                Criar
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
