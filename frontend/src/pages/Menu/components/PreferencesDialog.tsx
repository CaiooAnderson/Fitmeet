import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogSkip,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface Props {
  token: string;
  onPreferencesSaved: () => void;
}

export default function PreferencesDialog({
  token,
  onPreferencesSaved,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activityTypes, setActivityTypes] = useState<
    { id: string; name: string; image?: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);
  const hasFetched = useRef(false);
  const prevToken = useRef<string | null>(null);

  useEffect(() => {
    const shownKey = `preferences-shown-${token}`;
    const alreadyShown = sessionStorage.getItem(shownKey);

    if (
      token &&
      token !== prevToken.current &&
      !hasFetched.current &&
      !alreadyShown
    ) {
      fetchActivityTypes();
      setIsOpen(true);
      hasFetched.current = true;
      prevToken.current = token;
      sessionStorage.setItem(shownKey, "true");
    }
  }, [token]);

  const fetchActivityTypes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivityTypes(data);
    } catch {
      toast.error("Erro ao carregar atividades.");
    }
  };

  const handleConfirm = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/user/preferences/define`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selected),
      });
      sessionStorage.setItem(
        `preferences-values-${token}`,
        JSON.stringify(selected)
      );
      toast.success("Preferências salvas!", { position: "top-center" });
      onPreferencesSaved();
      setIsOpen(false);
    } catch {
      toast.error("Erro ao salvar preferências.", { position: "top-center" });
    }
  };

  const handleSkip = () => {
    onPreferencesSaved();
    setIsOpen(false);
  };

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="md:max-w-xl md:p-12 border-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex text-center text-[2rem] font-bebas font-normal px-1 h-8 items-center justify-center text-[var(--title)]">
            SELECIONE AS SUAS ATIVIDADES PREFERIDAS
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-3 gap-6 py-8">
          {activityTypes.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="relative w-16 h-16">
                  <img
                    src={item.image?.replace("localstack", "localhost")}
                    className={`w-full h-full rounded-full object-cover transition-all ${
                      isSelected ? "brightness-30" : ""
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="text-green-300 bg-black/80 ring-1 ring-green-300 rounded-full p-1 w-6 h-6" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-full text-[var(--title)]">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        <AlertDialogFooter className="flex w-full gap-2">
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-[var(--primary)] text-white flex-1 hover:bg-[var(--primary-600)]"
          >
            Confirmar
          </AlertDialogAction>
          <AlertDialogSkip
            onClick={handleSkip}
            className="flex-1 border border-[#009966] text-[#009966] bg-white hover:bg-[#f4f4f4]"
          >
            Pular
          </AlertDialogSkip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
