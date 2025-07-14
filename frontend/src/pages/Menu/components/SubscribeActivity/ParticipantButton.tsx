import { useState, useEffect, useRef } from "react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { getButtonState } from "./buttonState";
import { toast } from "sonner";
import { Check, Ban } from "lucide-react";

interface Props {
  activity: any;
  userId: string;
  userSubscriptionStatus?: "APPROVED" | "WAITING" | "REJECTED";
  confirmedAt?: string | null;
  confirmationCode?: string;
  activityCompletedAt?: string | null;
  onStatusChange?: (
    status: "APPROVED" | "WAITING" | "REJECTED" | undefined,
    confirmedAt?: string,
    confirmationCode?: string
  ) => void;
  onClose?: () => void;
}

export default function ParticipantButton({
  activity,
  userId,
  userSubscriptionStatus,
  confirmedAt,
  confirmationCode: confirmationCodeProp,
  onStatusChange,
  onClose,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState(
    confirmationCodeProp ?? ""
  );
  const [now, setNow] = useState(new Date());
  const [activityCompletedAt, setActivityCompletedAt] = useState(
    activity.completedAt
  );
  const alreadyWarned = useRef(false);

  useEffect(() => {
    if (confirmationCodeProp) {
      setConfirmationCode(confirmationCodeProp);
    }
  }, [confirmationCodeProp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityCompletedAt(activity.completedAt);
    }, 3000);

    return () => clearInterval(interval);
  }, [activity]);

  useEffect(() => {
    const interval = setInterval(() => {
      const scheduledDate = new Date(activity.scheduledDate);
      const checkinStart = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
      const isLessThan30Min =
        new Date() >= checkinStart && new Date() < scheduledDate;
  
      if (
        isLessThan30Min &&
        userSubscriptionStatus === "WAITING" &&
        !alreadyWarned.current
      ) {
        toast.error("Inscrição não aprovada a tempo. Tente novamente em outra atividade.");
        alreadyWarned.current = true;
        onStatusChange?.(undefined);
        onClose?.();
      }
    }, 500);
  
    return () => clearInterval(interval);
  }, [activity.scheduledDate, userSubscriptionStatus]);

  const button = getButtonState({
    isCreator: userId === activity.creator.id,
    isPrivate: activity.private,
    scheduledDate: activity.scheduledDate,
    subscriptionStatus: userSubscriptionStatus,
    confirmedAt,
    now,
  });

  const handleClick = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (button.action === "subscribe") {
        const res = await fetch(
          `http://localhost:3000/activities/${activity.id}/subscribe`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result?.message);

        toast.success(
          activity.private ? "Solicitação enviada!" : "Inscrição confirmada!"
        );
        onStatusChange?.(activity.private ? "WAITING" : "APPROVED");
      }

      if (button.action === "unsubscribe") {
        const res = await fetch(
          `http://localhost:3000/activities/${activity.id}/unsubscribe`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error();
        toast.success("Você foi desinscrito.");
        onStatusChange?.(undefined);
      }

      if (button.action === "check-in") {
        if (!confirmationCode) {
          toast.error("Informe o código de confirmação.");
          return;
        }

        const res = await fetch(
          `http://localhost:3000/activities/${activity.id}/check-in`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ confirmationCode }),
          }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result?.error);
        toast.success("Check-in confirmado!");
        onStatusChange?.(
          "APPROVED",
          new Date().toISOString(),
          confirmationCode
        );
        setConfirmationCode(confirmationCode);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao processar ação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-1.5">
      {activityCompletedAt ? (
        <AlertDialogAction
          disabled
          className="w-56 h-12 text-[1rem] rounded-[4px] border border-gray-300 text-gray-500 bg-white cursor-not-allowed"
        >
          Atividade encerrada
        </AlertDialogAction>
      ) : button.action === "check-in" && !confirmedAt ? (
        <>
          <h3 className="font-bebas text-[28px] h-8">Faça seu check-in</h3>
          <div className="flex gap-1.5 w-full rounded-[8px]">
            <input
              type="text"
              placeholder="Código de confirmação"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="h-12 px-3 rounded-[8px] border text-sm w-full"
            />
            <AlertDialogAction
              onClick={handleClick}
              disabled={isSubmitting || button.disabled}
              className="h-12 px-4 w-35 rounded-[8px] bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] text-sm"
            >
              Confirmar
            </AlertDialogAction>
          </div>
        </>
      ) : confirmedAt ? (
        <>
          <h3 className="font-bebas text-[28px] h-8">Faça seu check-in</h3>
          <div className="flex gap-1.5 w-full rounded-[8px]">
            <input
              type="text"
              value={confirmationCodeProp ?? ""}
              disabled
              className="h-12 px-3 rounded-[8px] border text-sm w-full bg-gray-100 text-gray-500"
            />
            <div className="w-22 h-12 bg-emerald-600 rounded-[8px] flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        </>
      ) : (
        <>
          {button.label === "Atividade em andamento" ? (
            <AlertDialogAction
              disabled
              className="w-56 h-12 text-[1rem] rounded-[4px] border border-zinc-400 text-zinc-400 bg-white cursor-not-allowed"
            >
              Atividade em andamento
            </AlertDialogAction>
          ) : ["Participar", "Aguardando aprovação"].includes(button.label) ? (
            <button
              onClick={() => {
                const eventDate = new Date(activity.scheduledDate);
                const limitDate = new Date(
                  eventDate.getTime() - 30 * 60 * 1000
                );

                if (now >= limitDate && !userSubscriptionStatus) {
                  toast.error(
                    "Inscrições encerradas. Faltam menos de 30 minutos."
                  );
                  return;
                }

                handleClick();
              }}
              className={`w-56 h-12 text-[1rem] rounded-[4px] cursor-pointer bg-[var(--primary)] text-white hover:bg-[var(--primary-600)]`}
            >
              {button.label}
            </button>
          ) : (
            <AlertDialogAction
              onClick={handleClick}
              disabled={isSubmitting || button.disabled}
              className={`w-56 h-12 text-[1rem] rounded-[4px] ${
                button.label === "Inscrição negada"
                  ? "bg-red-600 text-white flex items-center justify-center gap-2"
                  : button.label === "Desinscrever"
                    ? "border border-[var(--warning)] text-[var(--warning)] bg-white hover:bg-muted"
                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary-600)]"
              }`}
            >
              {button.label === "Inscrição negada" ? (
                <span className="flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-white" />
                  Inscrição negada
                </span>
              ) : (
                button.label
              )}
            </AlertDialogAction>
          )}
        </>
      )}
    </div>
  );
}
