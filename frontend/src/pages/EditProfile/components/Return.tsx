import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Return() {
  const navigate = useNavigate();

  return (
    <div
      className="w-fit flex items-center justify-start h-6 gap-2 cursor-pointer transition-all duration-300 hover:text-primary-600 group"
      onClick={() => navigate("/profile")}
    >
      <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="text-[1rem] font-bold">Voltar para o perfil</span>
    </div>
  );
}