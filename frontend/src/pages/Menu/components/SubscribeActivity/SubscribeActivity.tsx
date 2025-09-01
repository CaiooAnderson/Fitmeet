import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
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
  const [marqueeTitle, setMarqueeTitle] = useState(false);
  const [canMarqueeParticipants, setCanMarqueeParticipants] = useState<
    string[]
  >([]);
  const [marqueeParticipants, setMarqueeParticipants] = useState<string[]>([]);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [canMarqueeTitle, setCanMarqueeTitle] = useState(false);
  const [availableTitleWidth, setAvailableTitleWidth] = useState<number>(
    window.innerWidth < 640 ? window.innerWidth * 0.8 : 0
  );
  const [isSmOrLarger, setIsSmOrLarger] = useState(window.innerWidth >= 640);
  const [selectedUserData, setSelectedUserData] = useState<any | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

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
      id: "creator-id",
      userId: activity.creator?.id,
      name: activity.creator?.name,
      avatar: activity.creator?.avatar,
      subscriptionStatus: "APPROVED",
    };

    const fullList = approvedOnly.some((p: any) => p.userId === creator.userId)
      ? approvedOnly.map((p: any) => ({ ...p }))
      : [creator, ...approvedOnly.map((p: any) => ({ ...p }))];

    setParticipants(fullList);

    const onlyParticipants = fullList.filter(
      (p: any) => p.userId !== activity.creator?.id
    );
    setParticipantCount(onlyParticipants.length);
  };

  const handleOpenUserDialog = async (userId: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoadingUser(true);
    setIsUserDialogOpen(true);

    try {
      if (userId === activity.creator?.id) {
        setSelectedUserData({
          userId: activity.creator.id,
          name: activity.creator.name,
          avatar: activity.creator.avatar,
          subscriptionStatus: "APPROVED",
          confirmedAt: activity.createdAt,
        });
        return;
      }

      const participantsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/${activity.id}/participants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const participantsData = await participantsRes.json();

      const participantExtra = participantsData.find(
        (p: any) => p.userId === userId
      );

      setSelectedUserData({
        userId: participantExtra?.userId,
        name: participantExtra?.name,
        avatar: participantExtra?.avatar,
        subscriptionStatus: participantExtra?.subscriptionStatus,
        confirmedAt: participantExtra?.confirmedAt || null,
      });
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    } finally {
      setLoadingUser(false);
    }
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

  useEffect(() => {
    const checkTitleOverflow = () => {
      if (titleRef.current) {
        const limit = window.innerWidth >= 640 ? 384 : 320;
        const isOverflowing = titleRef.current.scrollWidth > limit;
        setCanMarqueeTitle(isOverflowing);
      }
    };

    const timeout = setTimeout(checkTitleOverflow, 100);

    window.addEventListener("resize", checkTitleOverflow);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkTitleOverflow);
    };
  }, [activity.title]);

  useEffect(() => {
    const checkOverflow = () => {
      const updated = participants
        .filter((p) => {
          const el = document.querySelector(
            `[data-userid="${p.userId}"] .participant-name`
          ) as HTMLSpanElement;

          if (!el) return false;
          return el.scrollWidth > el.clientWidth;
        })
        .map((p) => p.userId);

      setCanMarqueeParticipants(updated);
    };

    setTimeout(checkOverflow, 100);
  }, [participants]);

  useEffect(() => {
    const updateWidthAndCheck = () => {
      const parentWidth = titleRef.current?.parentElement?.offsetWidth || 0;
      const width =
        window.innerWidth < 640 ? window.innerWidth * 0.8 : parentWidth;
      setAvailableTitleWidth(width);

      if (titleRef.current) {
        setCanMarqueeTitle(titleRef.current.scrollWidth > width);
      }

      setIsSmOrLarger(window.innerWidth >= 640);
    };

    updateWidthAndCheck();
    window.addEventListener("resize", updateWidthAndCheck);
    return () => window.removeEventListener("resize", updateWidthAndCheck);
  }, [activity.title]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const updated = participants
        .filter((p) => {
          const el = document.querySelector(
            `[data-userid="${p.userId}"] .participant-name`
          ) as HTMLSpanElement;
          return el ? el.scrollWidth > el.clientWidth : false;
        })
        .map((p) => p.userId);
      setCanMarqueeParticipants(updated);
    }, 100);

    return () => clearTimeout(timeout);
  }, [participants]);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(open) => open || onClose()}>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription></AlertDialogDescription>

        <AlertDialogContent
          className="
          w-[848px] border-0 p-12
          max-w-full
          sm:max-w-[848px]
          sm:h-auto
          sm:overflow-visible
          rounded-none sm:rounded-xl
          [@media(max-width:640px)]:px-6
          [@media(max-width:640px)]:h-auto
          [@media(max-width:640px)]:max-h-[100vh]
          [@media(max-width:640px)]:overflow-y-auto
        "
        >
          <div className="sm:hidden fixed top-2 right-2 w-full z-50 flex justify-end px-6 py-2 mt-[calc(env(safe-area-inset-top)+1rem)]">
            <AlertDialogClose />
          </div>
          <div className="hidden sm:flex absolute top-2 right-2">
            <AlertDialogClose />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[24rem_1fr] gap-12 w-full py-4 sm:py-0 [@media(max-width:640px)]:my-4">
            <div className="flex flex-col justify-between h-full w-full overflow-hidden text-ellipsis whitespace-nowrap break-words">
              <div>
                <img
                  src={activity.image?.replace("localstack", "localhost")}
                  className="h-56 w-full object-cover rounded-lg mb-6"
                />

                <h2
                  className={`text-[2rem] h-9 mb-2 font-bebas overflow-hidden ${
                    canMarqueeTitle ? "cursor-pointer" : ""
                  }`}
                  style={{ width: isSmOrLarger ? "100%" : availableTitleWidth }}
                  onClick={() => {
                    if (canMarqueeTitle) setMarqueeTitle((prev) => !prev);
                  }}
                >
                  <span
                    ref={titleRef}
                    className={`block max-w-full ${
                      marqueeTitle ? "title-marquee" : "truncate"
                    }`}
                  >
                    {activity.title}
                  </span>
                </h2>

                <p
                  className="text-[1rem] text-gray-700 mb-6 whitespace-normal overflow-y-auto max-h-36"
                  style={{
                    height: isSmOrLarger ? "9rem" : "auto",
                  }}
                >
                  {activity.description}
                </p>

                <div className="flex flex-col gap-3 h-27">
                  <div className="flex items-center gap-1.5 h-7">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    {format(
                      new Date(activity.scheduledDate),
                      "dd/MM/yyyy HH:mm"
                    )}
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
              </div>

              {userId && (
                <div className="mt-6 flex justify-center sm:justify-start">
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
                        if (code) setConfirmationCode(code);
                      } else {
                        fetchParticipants();
                      }
                    }}
                    onClose={onClose}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 w-full sm:w-80 max-w-full">
              <div className="flex flex-col gap-2 h-62 [@media(max-width:640px)]:h-auto">
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

              <div
                className="
            flex flex-col gap-2 overflow-hidden h-92
            [@media(max-width:640px)]:h-auto
            [@media(max-width:640px)]:max-h-none
            [@media(max-width:640px)]:overflow-visible
          "
              >
                <h3 className="text-[1.75rem] h-8 font-bebas">PARTICIPANTES</h3>
                <div className="flex flex-col gap-2.5 h-full overflow-auto pr-1 [@media(max-width:640px)]:h-auto">
                  {participants.map((participant) => (
                    <div
                      key={participant.id || participant.userId}
                      className="flex items-center gap-2 h-14"
                      data-userid={participant.userId}
                    >
                      <div className="w-11 h-11 rounded-full bg-emerald-500 p-1">
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            key={participant.userId}
                            src={
                              participant.avatar
                                ? participant.avatar
                                : import.meta.env.VITE_DEFAULT_AVATAR_URL
                            }
                            alt={`${participant.name || "Usuário"} avatar`}
                            onClick={() =>
                              handleOpenUserDialog(participant.userId)
                            }
                            className="cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <AvatarFallback>
                            {participant.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col justify-center h-10.5 gap-0.5 max-w-[220px] overflow-hidden">
                        <span
                          className={`text-[1rem] font-semibold h-5 leading-none overflow-hidden ${
                            canMarqueeParticipants.includes(participant.userId)
                              ? "cursor-pointer"
                              : "cursor-default"
                          }`}
                          onClick={() => {
                            if (
                              canMarqueeParticipants.includes(
                                participant.userId
                              )
                            ) {
                              setMarqueeParticipants((prev) =>
                                prev.includes(participant.userId)
                                  ? prev.filter(
                                      (id) => id !== participant.userId
                                    )
                                  : [...prev, participant.userId]
                              );
                            }
                          }}
                        >
                          <span
                            className={`participant-name block max-w-full ${
                              marqueeParticipants.includes(participant.userId)
                                ? "marquee"
                                : "truncate"
                            }`}
                          >
                            {participant.name}
                          </span>
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

      <AlertDialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <AlertDialogTitle />
        <AlertDialogDescription />
        <AlertDialogContent className="max-w-md w-full border-0 rounded-2xl p-6">
          <div className="sm:hidden fixed top-2 right-2 w-full z-50 flex justify-end px-6 py-2 mt-[calc(env(safe-area-inset-top)+1rem)]">
            <AlertDialogClose />
          </div>
          <div className="hidden sm:flex absolute top-2 right-2">
            <AlertDialogClose />
          </div>
          {loadingUser ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-gray-500">Carregando...</span>
            </div>
          ) : selectedUserData ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedUserData.avatar} />
                  <AvatarFallback>
                    {selectedUserData.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h2 className="text-xl font-semibold text-center">
                {selectedUserData.name}
              </h2>

              <div className="text-sm text-gray-700 w-full text-center">
                <p>
                  <span className="font-semibold text-gray-900">
                    Status de Inscrição:
                  </span>{" "}
                  {selectedUserData.subscriptionStatus ?? "—"}
                </p>
              </div>

              <div className="text-sm text-gray-700 w-full text-center">
                <p>
                  <span className="font-semibold text-gray-900">
                    Confirmado em:
                  </span>{" "}
                  {selectedUserData.confirmedAt
                    ? new Date(selectedUserData.confirmedAt).toLocaleString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Ainda não fez o Check-in"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Não foi possível carregar o usuário.
            </p>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
