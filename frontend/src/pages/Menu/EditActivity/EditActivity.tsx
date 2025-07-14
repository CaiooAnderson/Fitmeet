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

import ImageUpload from "../NewActivity/components/ImageUpload";
import Inputs from "../NewActivity/components/Inputs";
import Schedule from "../NewActivity/components/Schedule";
import TypesAndLocation from "../NewActivity/components/TypesAndLocation";
import Approval from "../NewActivity/components/Approval";

interface EditActivityProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
}

export default function EditActivity({
  isOpen,
  onClose,
  activity,
}: EditActivityProps) {
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
    if (!token || !activity || !isOpen) return;

    const fetchTypesAndFill = async () => {
      try {
        const res = await fetch("http://localhost:3000/activities/types", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const typesData = await res.json();
        setActivityTypes(typesData);

        const matchedType = typesData.find(
          (type: any) =>
            type.id === activity.type ||
            type.name.toLowerCase() === activity.type.toLowerCase()
        );

        setActivityTypeId(matchedType?.id ?? "");
        setPreviewUrl(activity.image);
        setTitle(activity.title);
        setDescription(activity.description);
        setScheduledDate(new Date(activity.scheduledDate));
        setApprovalRequired(activity.private);

        if (activity.address) {
          setCoordinates({
            lat: activity.address.latitude,
            lng: activity.address.longitude,
          });
        } else {
          setCoordinates(null);
        }
      } catch (error) {
        toast.error("Erro ao carregar tipos de atividade.");
      }
    };

    fetchTypesAndFill();
  }, [activity, isOpen]);

  const handleUpdateActivity = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
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
    const scheduledWithTime = new Date(scheduledDate);
    scheduledWithTime.setHours(now.getHours(), now.getMinutes(), 0, 0);

    if (scheduledWithTime.getTime() <= now.getTime()) {
      toast.error("Você precisa inserir uma data futura para agendar.");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("typeId", activityTypeId);
    formData.append("scheduledDate", scheduledWithTime.toISOString());
    formData.append(
      "address",
      JSON.stringify({ latitude: coordinates.lat, longitude: coordinates.lng })
    );
    formData.append("private", String(approvalRequired));

    try {
      const response = await fetch(
        `http://localhost:3000/activities/${activity.id}/update`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        toast.error(
          result?.error || result?.message || "Erro ao atualizar atividade."
        );
        return;
      }

      toast.success("Atividade atualizada com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao atualizar atividade.");
    }
  };

  const handleDeleteActivity = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/activities/${activity.id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error || "Erro ao deletar atividade.");
        return;
      }

      toast.success("Atividade deletada!");
      onClose();
    } catch {
      toast.error("Erro ao deletar atividade.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[784px] h-[790px] border-0 p-6">
        <div className="p-6 h-full flex flex-col justify-between gap-10">
          <div>
            <AlertDialogTitle className="text-[2rem] font-bebas font-normal h-9">
              EDITAR ATIVIDADE
            </AlertDialogTitle>
            <AlertDialogDescription />

            <div className="mt-12 h-[522px]">
              <div className="flex justify-evenly gap-12">
                <div className="flex flex-col gap-4">
                  <ImageUpload
                    image={image}
                    previewUrl={previewUrl}
                    handleFileChange={setImage}
                    setPreviewUrl={setPreviewUrl}
                    imageLabelClassName="h-39"
                  />
                  <Inputs
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    descriptionClassName="h-[102px]"
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
              <AlertDialogCancel
                className="w-50 h-full rounded-lg text-[var(--warning)] bg-[#fff] border-1 border-[var(--warning)] hover:text-white text-sm"
                onClick={handleDeleteActivity}
              >
                Deletar
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-50 h-full rounded-lg bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary-600)]"
                onClick={handleUpdateActivity}
              >
                Confirmar
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
