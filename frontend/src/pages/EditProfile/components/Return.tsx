import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Return() {
  const navigate = useNavigate();

  return (
    <div
      className="w-fit flex items-center justify-start h-6 border-0 shadow-none gap-2 cursor-pointer"
      onClick={() => navigate("/profile")}
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="text-[1rem] font-bold">Voltar para o perfil</span>
    </div>
  );
}