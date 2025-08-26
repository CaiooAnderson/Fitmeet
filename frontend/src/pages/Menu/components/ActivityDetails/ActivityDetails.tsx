import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  const [marqueeParticipants, setMarqueeParticipants] = useState<string[]>([]);
  const [canMarqueeParticipants, setCanMarqueeParticipants] = useState<
    string[]
  >([]);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [marqueeTitle, setMarqueeTitle] = useState(false);
  const [canMarqueeTitle, setCanMarqueeTitle] = useState(false);
  const [availableTitleWidth, setAvailableTitleWidth] = useState<number>(
    window.innerWidth < 640 ? window.innerWidth * 0.8 : 0
  );
  const [isSmOrLarger, setIsSmOrLarger] = useState(window.innerWidth >= 640);

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
    setLocalActivity(activity);
  }, [activity]);

  useEffect(() => {
    const updateWidth = () => {
      const width =
        window.innerWidth < 640
          ? window.innerWidth * 0.8
          : titleRef.current?.parentElement?.offsetWidth || 0;
      setAvailableTitleWidth(width);

      if (titleRef.current) {
        setCanMarqueeTitle(titleRef.current.scrollWidth > width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
    setMarqueeParticipants((prev) => {
      const stillHere = participants.map((p) => p.userId);
      return prev
        .filter((id) => stillHere.includes(id))
        .filter((id) => {
          const el = document.querySelector(
            `[data-userid="${id}"] .participant-name`
          ) as HTMLSpanElement;
          return el ? el.scrollWidth > el.clientWidth : false;
        });
    });
  }, [participants]);

  useEffect(() => {
    function handleResize() {
      setIsSmOrLarger(window.innerWidth >= 640);

      if (titleRef.current) {
        const screenWidth = window.innerWidth;
        let maxWidth;

        if (screenWidth <= 320) {
          maxWidth = screenWidth * 0.8;
        } else if (screenWidth < 640) {
          maxWidth = 320;
        } else {
          maxWidth = titleRef.current.parentElement?.offsetWidth || 0;
        }

        setCanMarqueeTitle(titleRef.current.scrollWidth > maxWidth);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMarqueeTitle(false);

    if (titleRef.current) {
      const needsMarquee =
        titleRef.current.scrollWidth > titleRef.current.clientWidth;
      setCanMarqueeTitle(needsMarquee);
    }
  }, [activity]);

  useEffect(() => {
    if (!isOpen) {
      setMarqueeTitle(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const updateWidthAndCheck = () => {
      const parentWidth = titleRef.current?.parentElement?.offsetWidth || 0;
      const width =
        window.innerWidth < 640 ? window.innerWidth * 0.8 : parentWidth;
      setAvailableTitleWidth(width);

      if (titleRef.current) {
        setCanMarqueeTitle(titleRef.current.scrollWidth > width);
      }
    };

    updateWidthAndCheck();
    window.addEventListener("resize", updateWidthAndCheck);
    return () => window.removeEventListener("resize", updateWidthAndCheck);
  }, [activity.title]);

  const scheduledDate = new Date(activity.scheduledDate);
  const checkinStart = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
  const isCheckinTime = now >= checkinStart && now < scheduledDate;
  const isEventStarted = new Date() >= new Date(activity.scheduledDate);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
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
          <div className="flex gap-12 flex-col sm:flex-row py-4 sm:py-0 [@media(max-width:640px)]:my-4">
            <div className="flex flex-col w-full sm:w-96 justify-between h-full overflow-hidden text-ellipsis whitespace-nowrap break-words">
              <img
                src={activity.image?.replace("localstack", "localhost")}
                className="h-56 w-full object-cover rounded-lg mb-6"
              />
              <h2
                className={`text-[2rem] h-9 mb-2 font-bebas overflow-hidden ${canMarqueeTitle ? "cursor-pointer" : ""}`}
                style={{ width: isSmOrLarger ? "100%" : availableTitleWidth }}
                onClick={() => {
                  if (canMarqueeTitle) setMarqueeTitle((prev) => !prev);
                }}
              >
                <span
                  ref={titleRef}
                  className={`block max-w-full ${marqueeTitle ? "title-marquee" : "truncate"}`}
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

              <div className="hidden sm:block mt-10">
                {localActivity.completedAt ? (
                  <AlertDialogAction
                    disabled
                    className="w-56 h-12 text-[1rem] rounded-sm border border-gray-300 text-gray-500 bg-white cursor-not-allowed"
                  >
                    Atividade encerrada
                  </AlertDialogAction>
                ) : isEventStarted ? (
                  <AlertDialogAction
                    onClick={handleConcludeActivity}
                    className="w-56 h-12 text-[1rem] rounded-sm"
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
                    className="w-56 h-12 text-[1rem] bg-background border-1 border-[#171717] text-[#171717] hover:bg-primary/75 font-bold rounded-sm"
                  >
                    <Pencil className="mr-1.5 w-6 h-6 text-black" /> Editar
                  </AlertDialogAction>
                )}
              </div>
            </div>

            <div
              className="flex flex-col gap-6 w-full sm:w-80
                   max-w-full"
            >
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
                className={`flex flex-col gap-2 overflow-hidden ${
                  isCheckinTime ? "h-60" : "h-96"
                }
          [@media(max-width:640px)]:h-auto
          [@media(max-width:640px)]:max-h-none
          [@media(max-width:640px)]:overflow-visible
          `}
              >
                <h3 className="text-[1.75rem] h-8 font-bebas">PARTICIPANTES</h3>
                <div className="flex flex-col gap-2 h-full overflow-auto pr-1 [@media(max-width:640px)]:h-auto">
                  {participants.map((participant) => {
                    const avatarUrl = participant.avatar;

                    return (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between h-13"
                        data-userid={participant.userId}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-11 h-11 rounded-full bg-emerald-500 p-1">
                            <Avatar className="w-full h-full">
                              <AvatarImage
                                src={
                                  avatarUrl ||
                                  import.meta.env.VITE_DEFAULT_AVATAR_URL
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
                          <div className="flex flex-col justify-center h-10.5 gap-0.5 max-w-[180px] overflow-hidden">
                            <span
                              className={`text-[1rem] font-semibold h-5 leading-none overflow-hidden ${
                                canMarqueeParticipants.includes(
                                  participant.userId
                                )
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
                                  marqueeParticipants.includes(
                                    participant.userId
                                  )
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

                        {participant.userId !== activity.creator.id &&
                          activity.private &&
                          participant.subscriptionStatus === "WAITING" &&
                          new Date() <
                            new Date(
                              new Date(activity.scheduledDate).getTime() -
                                30 * 60 * 1000
                            ) && (
                            <div className="flex gap-2.5">
                              <button
                                onClick={() =>
                                  handleApproval(participant.userId, true)
                                }
                                className="hover:text-green-500"
                              >
                                <Check />
                              </button>
                              <button
                                onClick={() =>
                                  handleApproval(participant.userId, false)
                                }
                                className="hover:text-red-500"
                              >
                                <X />
                              </button>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="sm:hidden mt-6 flex justify-center">
                {localActivity.completedAt ? (
                  <AlertDialogAction
                    disabled
                    className="w-56 h-12 text-[1rem] rounded-sm border border-gray-300 text-gray-500 bg-white cursor-not-allowed"
                  >
                    Atividade encerrada
                  </AlertDialogAction>
                ) : isEventStarted ? (
                  <AlertDialogAction
                    onClick={handleConcludeActivity}
                    className="w-56 h-12 text-[1rem] rounded-sm"
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
                    className="w-56 h-12 text-[1rem] bg-background border-1 border-[#171717] text-[#171717] hover:bg-primary/75 font-bold rounded-sm"
                  >
                    <Pencil className="mr-1.5 w-6 h-6 text-black" /> Editar
                  </AlertDialogAction>
                )}
              </div>

              {isCheckinTime && (
                <div className="sm:w-80 h-30 bg-[#f9f9f9] flex flex-col justify-center px-6 py-3 rounded-md gap-2">
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

      {isEditOpen && activity && (
        <EditActivity
          key={activity.id}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          activity={activity}
        />
      )}
    </>
  );
}
