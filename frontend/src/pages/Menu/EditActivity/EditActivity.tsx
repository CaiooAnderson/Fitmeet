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
    if (!token || !isOpen || !activity?.id) return;

    const fetchTypesAndFill = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/activities/types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar tipos");

        const typesData = await res.json();
        setActivityTypes(typesData);

        const matchedType = typesData.find(
          (type: any) =>
            type.id === activity.typeId ||
            (activity.type &&
              type.name.toLowerCase() === activity.type.toLowerCase())
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
        console.error(error);
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
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/delete`,
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
      <AlertDialogContent
        className="
          w-full sm:w-[784px] border-0 p-12
          max-w-full sm:max-w-[784px]
          h-auto sm:h-[790px]
          sm:overflow-visible
          rounded-none sm:rounded-xl
          [@media(max-width:640px)]:p-6
          [@media(max-width:640px)]:max-h-[100vh]
          [@media(max-width:640px)]:overflow-y-auto
          [@media(max-width:320px)]:p-0
          [@media(max-width:320px)]:w-screen
          [@media(max-width:320px)]:min-w-[300px]
        "
      >
        <div className="flex-shrink-0">
          <AlertDialogTitle className="text-[2rem] font-bebas font-normal text-center sm:text-left">
            EDITAR ATIVIDADE
          </AlertDialogTitle>
          <AlertDialogDescription />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center">
          <div className="flex flex-col gap-4 w-full max-w-[320px] items-center sm:items-start xs:max-w-[280px] [@media(max-width:360px)]:w-[calc(100vw-48px)]">
            <div
              className="
                w-80 xs:w-70 
                flex flex-col items-center sm:items-start
              "
            >
              <ImageUpload
                image={image}
                previewUrl={previewUrl}
                handleFileChange={setImage}
                setPreviewUrl={setPreviewUrl}
                imageLabelClassName="h-39"
              />
            </div>

            <div
              className="
                w-80 xs:w-70 
              "
            >
              <Inputs
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                descriptionClassName="h-[102px]"
              />
            </div>

            <div
              className="
                w-80 xs:w-70 
              "
            >
              <Schedule
                scheduledDate={scheduledDate}
                setScheduledDate={setScheduledDate}
              />
            </div>
          </div>

          <div
            className="
              flex flex-col xs:gap-6 gap-8 
              w-full sm:w-80 xs:w-70 max-w-[320px] xs:max-w-[280px]
              [@media(max-width:360px)]:w-[calc(100vw-48px)]
            "
          >
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

        <AlertDialogFooter className="flex-shrink-0 mt-6 sm:mt-4">
          <div className="w-full h-[48px] flex flex-row justify-center sm:justify-end gap-3">
            <AlertDialogCancel
              className="flex-1 max-w-[140px] h-full rounded-lg text-white text-sm"
              onClick={handleDeleteActivity}
            >
              Deletar
            </AlertDialogCancel>

            <AlertDialogAction
              className="flex-1 max-w-[140px] h-full rounded-lg bg-[var(--primary)] text-white text-sm hover:bg-[var(--primary-600)]"
              onClick={handleUpdateActivity}
            >
              Confirmar
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
