import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Users,
  Lock,
  Pencil,
  Check,
  X,
  Flag,
  UserRoundCheck,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PreviewMap from "@/components/PreviewMap/PreviewMap";
import EditActivity from "../../EditActivity/EditActivity";
import { toast } from "sonner";

interface ActivityDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
}

export default function ActivityDetails({
  isOpen,
  onClose,
  activity,
}: ActivityDetailsProps) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [participantCount, setParticipantCount] = useState(0);
  const [localActivity, setLocalActivity] = useState(activity);

  const fetchParticipants = async () => {
    const token = sessionStorage.getItem("token");
    if (!activity?.id || !token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/participants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      const now = new Date();
      const scheduledDate = new Date(activity.scheduledDate);
      const checkinStart = new Date(scheduledDate.getTime() - 30 * 60 * 1000);

      const filtered = data.filter((p: any) => {
        if (p.subscriptionStatus === "REJECTED") return false;

        if (p.subscriptionStatus === "WAITING" && now >= checkinStart)
          return false;

        return true;
      });

      const creator = {
        id: "creator-static-id",
        userId: activity.creator?.id,
        name: activity.creator?.name,
        avatar: activity.creator?.avatar,
        subscriptionStatus: "APPROVED",
      };

      const alreadyInList = filtered.some(
        (p: any) => p.userId === creator.userId
      );
      const fullList = alreadyInList ? filtered : [creator, ...filtered];

      setParticipants(fullList);

      const onlyParticipants = fullList.filter(
        (p: any) => p.userId !== activity.creator?.id
      );
      setParticipantCount(onlyParticipants.length);
    } catch {
      setParticipants([]);
    }
  };

  const handleApproval = async (participantId: string, approved: boolean) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      setParticipants((prev) =>
        prev.map((p: any) =>
          p.id === participantId ? { ...p, _updating: true } : p
        )
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ participantId, approved }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.error || "Erro ao atualizar participante.");
        return;
      }

      toast.success(
        approved
          ? "Participante aprovado!"
          : "Participação recusada e removida."
      );

      if (approved) {
        setParticipants((prev) =>
          prev.map((p: any) =>
            p.id === participantId
              ? { ...p, subscriptionStatus: "APPROVED", _updating: false }
              : p
          )
        );
      } else {
        setParticipants((prev) =>
          prev.filter((p: any) => p.id !== participantId)
        );
      }
    } catch {
      toast.error("Erro ao processar a aprovação.");
    }
  };

  const handleConcludeActivity = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/conclude`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Erro ao encerrar a atividade.");
      toast.success("Atividade encerrada com sucesso!");
      setLocalActivity((prev: any) => ({
        ...prev,
        completedAt: new Date().toISOString(),
      }));
    } catch (err) {
      toast.error("Erro ao encerrar a atividade.");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [activity]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchParticipants();
    }, 2500);

    return () => clearInterval(interval);
  }, [activity?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchParticipants();
    }, 2500);

    return () => clearInterval(interval);
  }, [activity?.id]);

  useEffect(() => {
    setLocalActivity(activity);
  }, [activity]);

  const scheduledDate = new Date(activity.scheduledDate);
  const checkinStart = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
  const isCheckinTime = now >= checkinStart && now < scheduledDate;
  const isEventStarted = new Date() >= new Date(activity.scheduledDate);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription></AlertDialogDescription>
        <AlertDialogContent className="w-[848px] h-[752px] border-0 p-12">
          <div className="flex gap-12">
            <div className="flex flex-col w-96 justify-between h-full overflow-hidden text-ellipsis whitespace-nowrap break-words">
              <img
                src={activity.image?.replace("localstack", "localhost")}
                className="h-56 w-full object-cover rounded-lg mb-6"
              />
              <h2 className="text-[2rem] h-9 mb-2 font-bebas">
                {activity.title}
              </h2>
              <p className="text-[1rem] h-36 text-gray-700 mb-6 whitespace-normal overflow-y-auto">
                {activity.description}
              </p>
              <div className="flex flex-col gap-3 h-27">
                <div className="flex items-center gap-1.5 h-7">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  {format(new Date(activity.scheduledDate), "dd/MM/yyyy HH:mm")}
                </div>
                <div className="flex items-center gap-1.5 h-7">
                  <Users className="w-5 h-5 text-emerald-500" />
                  {participantCount} participantes
                </div>
                <div className="flex items-center gap-1.5 h-7">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  {activity.private
                    ? "Mediante aprovação"
                    : "Livre participação"}
                </div>
              </div>
              {localActivity.completedAt ? (
                <AlertDialogAction
                  disabled
                  className="w-56 h-12 text-[1rem] rounded-sm mt-10 border border-gray-300 text-gray-500 bg-white cursor-not-allowed"
                >
                  Atividade encerrada
                </AlertDialogAction>
              ) : isEventStarted ? (
                <AlertDialogAction
                  onClick={handleConcludeActivity}
                  className="w-56 h-12 text-[1rem] rounded-sm mt-10"
                >
                  <Flag className="mr-1.5 w-5 h-5 text-white" /> Encerrar
                  atividade
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  onClick={() => {
                    setIsEditOpen(true);
                    onClose();
                  }}
                  className="w-56 h-12 text-[1rem] bg-background border-1 border-[#171717] text-[#171717] hover:bg-primary/75 font-bold rounded-sm mt-10"
                >
                  <Pencil className="mr-1.5 w-6 h-6 text-black" /> Editar
                </AlertDialogAction>
              )}
            </div>

            <div className="flex flex-col gap-6 w-80">
              <div className="flex flex-col gap-2 h-62">
                <h3 className="text-[1.75rem] h-8 font-bebas">
                  PONTO DE ENCONTRO
                </h3>
                <div className="h-52 w-full bg-gray-200 rounded-[0.625rem] flex items-center justify-center">
                  <PreviewMap
                    coordinates={{
                      lat: activity.address.latitude,
                      lng: activity.address.longitude,
                    }}
                  />
                </div>
              </div>

              <div
                className={`flex flex-col gap-2 ${isCheckinTime ? "h-60" : "h-96"} overflow-hidden`}
              >
                <h3 className="text-[1.75rem] h-8 font-bebas">PARTICIPANTES</h3>
                <div className="flex flex-col gap-2 h-full overflow-auto pr-1">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between h-13"
                      data-userid={participant.userId}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-11 h-11 rounded-full bg-emerald-500 p-1">
                          <Avatar className="w-full h-full">
                            <AvatarImage
                              src={participant.avatar?.replace(
                                "localstack",
                                "localhost"
                              )}
                            />
                          </Avatar>
                        </div>
                        <div className="flex flex-col justify-center h-10.5 gap-0.5 max-w-[180px] overflow-hidden">
                          <span className="text-[1rem] font-semibold h-5 leading-none truncate">
                            {participant.name}
                          </span>
                          {participant.userId === activity.creator.id && (
                            <span className="text-[12px] h-4 leading-none">
                              Organizador
                            </span>
                          )}
                        </div>
                      </div>

                      {participant.userId !== activity.creator.id &&
                        activity.private &&
                        participant.subscriptionStatus === "WAITING" &&
                        now < checkinStart && (
                          <div className="flex gap-2.5">
                            <button
                              onClick={() =>
                                handleApproval(participant.id, true)
                              }
                              className="w-7 h-7 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() =>
                                handleApproval(participant.id, false)
                              }
                              className="w-7 h-7 bg-[var(--warning)] rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
              {isCheckinTime && (
                <div className="w-80 h-30 bg-[#f9f9f9] flex flex-col justify-center px-6 py-3 rounded-md gap-2">
                  <div className="flex flex-row items-center gap-1 text-base font-semibold text-[#404040] mb-1">
                    <UserRoundCheck className="text-[var(--primary-600)]" />
                    Código de check-in
                  </div>
                  <div className="text-[2rem] font-bebas text-[var(--title)] h-9 tracking-wider">
                    {activity.confirmationCode}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <EditActivity
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        activity={activity}
      />
    </>
  );
}
