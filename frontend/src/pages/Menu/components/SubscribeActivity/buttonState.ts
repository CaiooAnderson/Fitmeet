export type SubscriptionStatus =
  | "APPROVED"
  | "WAITING"
  | "REJECTED"
  | undefined;

interface ButtonConfig {
  label: string;
  disabled?: boolean;
  action: "subscribe" | "unsubscribe" | "check-in" | null;
  showInput?: boolean;
  icon?: "check";
}

export function getButtonState({
  isCreator,
  isPrivate,
  scheduledDate,
  subscriptionStatus,
  confirmedAt,
  now = new Date(),
}: {
  isCreator: boolean;
  isPrivate: boolean;
  scheduledDate: string;
  subscriptionStatus?: SubscriptionStatus;
  confirmedAt?: string | null;
  now?: Date;
}): ButtonConfig {
  const eventDate = new Date(scheduledDate);
  const checkinStart = new Date(eventDate.getTime() - 30 * 60 * 1000);

  const isCheckinTime = now >= checkinStart && now < eventDate;
  const isEventStarted = now >= eventDate;
  const isBeforeCheckinWindow = now < checkinStart;

  if (isCreator)
    return { label: "Você é o organizador", action: null, disabled: true };

  if (isEventStarted) {
    return { label: "Atividade em andamento", action: null, disabled: true };
  }

  if (!subscriptionStatus) {
    if (isBeforeCheckinWindow) {
      return { label: "Participar", action: "subscribe" };
    } else {
      return {
        label: "Participar",
        action: null,
        disabled: true,
      };
    }
  }

  if (subscriptionStatus === "WAITING") {
    return { label: "Aguardando aprovação", action: null, disabled: true };
  }

  if (subscriptionStatus === "REJECTED") {
    return {
      label: "Inscrição negada",
      action: null,
      disabled: true,
      showInput: false,
    };
  }

  if (subscriptionStatus === "APPROVED") {
    if (isPrivate && isCheckinTime && !confirmedAt) {
      return { label: "Confirmar", action: "check-in", showInput: true };
    }
    if (confirmedAt) {
      return {
        label: "Faça seu check-in",
        action: null,
        disabled: true,
        showInput: true,
      };
    }
    return { label: "Desinscrever", action: "unsubscribe" };
  }

  return { label: "Indefinido", action: null, disabled: true };
}
