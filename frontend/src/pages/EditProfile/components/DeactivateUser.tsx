import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function DeactivateUser() {
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/deactivate`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.success("Conta desativada");
      sessionStorage.removeItem("token");
      navigate("/");
    } else {
      toast.error("Erro ao desativar conta.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full flex justify-center">
          <div className="w-55 h-10 flex flex-row items-center justify-center gap-1.5 cursor-pointer px-2 whitespace-nowrap overflow-hidden text-ellipsis text-[var(--warning)] font-bold">
            <Trash2 className="w-6 h-6" />
            <span className="text-[1rem]">Desativar minha conta</span>
          </div>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[35.75rem] p-12 border-0">
        <div className="flex flex-col gap-3">
          <AlertDialogTitle className="text-[2rem] h-9 font-bebas font-normal text-[var(--title)]">
            Deseja desativar sua conta?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-[var(--text)]">
            Ao desativar sua conta, todos os seus dados e histórico de atividades serão permanentemente removidos.{' '}
            <span className="font-bold text-[var(--text)]">
              Esta ação é irreversível e não poderá ser desfeita.
            </span>
          </AlertDialogDescription>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-30 h-12 border-[#171717]">
              Cancelar
            </Button>
          </AlertDialogTrigger>
          <Button
            variant="destructive"
            className="w-30 h-12"
            onClick={handleDeactivate}
          >
            Desativar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}