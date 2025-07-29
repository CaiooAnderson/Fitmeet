import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Calendar, Users, Lock } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PreviewMap from "@/components/PreviewMap/PreviewMap";
import ParticipantButton from "./ParticipantButton";

interface SubscribeActivityProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
}

export default function SubscribeActivity({
  isOpen,
  onClose,
  activity,
}: SubscribeActivityProps) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<
    "APPROVED" | "WAITING" | "REJECTED" | undefined
  >();
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [participantCount, setParticipantCount] = useState(0);
  const [activityCompletedAt, setActivityCompletedAt] = useState(
    activity.completedAt
  );

  const fetchUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    setUserId(user.id);
  };

  const fetchParticipants = async () => {
    const token = sessionStorage.getItem("token");
    if (!activity?.id || !token) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/activities/${activity.id}/participants`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    const me = data.find((p: any) => p.userId === userId);

    if (!me) {
      setUserSubscriptionStatus(undefined);
      setConfirmedAt(null);
    } else {
      setUserSubscriptionStatus(me.subscriptionStatus ?? undefined);
      setConfirmedAt(me.confirmedAt || null);
      setConfirmationCode(me.confirmationCode || "");
    }

    const approvedOnly = data.filter(
      (p: any) => p.subscriptionStatus === "APPROVED"
    );

    const creator = {
      userId: activity.creator?.id,
      name: activity.creator?.name,
      avatar: activity.creator?.avatar,
      subscriptionStatus: "APPROVED",
      id: "creator",
    };

    const alreadyInList = approvedOnly.some(
      (p: any) => p.userId === creator.userId
    );

    const fullList = alreadyInList ? approvedOnly : [creator, ...approvedOnly];

    setParticipants(fullList);

    const onlyParticipants = fullList.filter(
      (p: any) => p.userId !== activity.creator?.id
    );
    setParticipantCount(onlyParticipants.length);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchParticipants();
  }, [activity, userId]);

  useEffect(() => {
    setConfirmedAt(null);
    setUserSubscriptionStatus(undefined);
  }, [activity]);

  useEffect(() => {
    if (userSubscriptionStatus === "WAITING") {
      const interval = setInterval(() => {
        fetchParticipants();
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [userSubscriptionStatus, activity.id]);

  useEffect(() => {
    setActivityCompletedAt(activity.completedAt);
  }, [activity.completedAt]);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => open || onClose()}>
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
                {activity.private ? "Mediante aprovação" : "Livre participação"}
              </div>
            </div>

            {userId && (
              <ParticipantButton
                key={confirmedAt + confirmationCode}
                activity={activity}
                userId={userId}
                userSubscriptionStatus={userSubscriptionStatus}
                confirmedAt={confirmedAt}
                confirmationCode={confirmationCode}
                activityCompletedAt={activityCompletedAt}
                onStatusChange={(status, confirmed, code) => {
                  setUserSubscriptionStatus(status);
                  if (confirmed) {
                    setConfirmedAt(confirmed);
                    if (code) {
                      setConfirmationCode(code);
                    }
                  } else {
                    fetchParticipants();
                  }
                }}
                onClose={onClose}
              />
            )}
          </div>

          <div className="flex flex-col gap-10 w-80">
            <div className="flex flex-col gap-2 h-62">
              <h3 className="text-[1.75rem] h-8 font-bebas">
                PONTO DE ENCONTRO
              </h3>
              <div className="h-52 w-full bg-gray-200 rounded-lg flex items-center justify-center">
                <PreviewMap
                  coordinates={{
                    lat: activity.address.latitude,
                    lng: activity.address.longitude,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 h-92 overflow-hidden">
              <h3 className="text-[1.75rem] h-8 font-bebas">PARTICIPANTES</h3>
              <div className="flex flex-col gap-2.5 h-full overflow-auto pr-1">
                {participants.map((participant) => (
                  <div
                    key={participant.id || participant.userId}
                    className="flex items-center gap-2 h-14"
                    data-userid={participant.userId}
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-500 p-1">
                      <Avatar className="w-full h-full">
                        <AvatarImage
                          src={
                            participant.avatar
                              ? participant.avatar
                              : import.meta.env.VITE_DEFAULT_AVATAR_URL
                          }
                          alt={`${participant.name || "Usuário"} avatar`}
                          onError={(e) => {
                            console.warn(
                              "Erro ao carregar imagem do participante:",
                              {
                                name: participant.name,
                                url: e.currentTarget.src,
                              }
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <AvatarFallback>
                          {participant.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col justify-center h-10.5 gap-0.5 max-w-[220px] overflow-hidden">
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
