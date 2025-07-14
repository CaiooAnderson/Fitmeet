import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Pen } from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileUserInfoProps {
  user: {
    name?: string;
    avatar?: string;
    level?: number;
    xp?: number;
    achievements: { id?: string; name: string }[];
  };
}

export default function ProfileUserInfo({ user }: ProfileUserInfoProps) {
  const navigate = useNavigate();

  const xpAtual = user.xp ?? 0;
  const xpNoNivelAtual = xpAtual % 1000;
  const xpParaProximoNivel = 1000;
  const progressPercent = (xpNoNivelAtual / xpParaProximoNivel) * 100;

  const achievementCriteria: Record<string, string> = {
    Convidado: "Fez check-in em uma atividade",
    "Fine, I'll do it myself": "Criou uma atividade",
    Anfitrião: "Concluiu uma atividade",
  };

  return (
    <div className="relative flex flex-col items-center w-full bg-[#fafafa] rounded-lg p-10">
      <div className="flex mb-10 w-full justify-end items-center gap-1.5">
        <Button
          className="h-10 w-28 p-3 border border-[#a1a1a1] text-gray-900 bg-white hover:bg-muted"
          onClick={() => navigate("/profile/edit")}
        >
          <Pen className="w-3 h-3" />
          Editar perfil
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 overflow-ellipsis">
        <Avatar className="w-48 h-48">
          <AvatarImage
            src={user.avatar?.replace("localstack", "localhost")}
            alt="Avatar do usuário"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </Avatar>
        <h1 className="text-[2rem] font-bebas truncate overflow-hidden text-ellipsis whitespace-nowrap w-48 text-center">
          {user.name}
        </h1>
      </div>

      <div className="flex gap-3 items-center mt-10">
        <div className="flex flex-col gap-8 bg-[#f5f5f5] rounded-lg w-103.5 h-52 px-8 py-8.5">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className="text-[0.75rem] h-[15px] font-semibold text-[var(--text)]">
                Seu nível é
              </span>
              <span className="text-[1.5rem] h-7.5 font-bold text-[var(--title)]">
                {user.level}
              </span>
            </div>
            <img
              src="/Level.png"
              alt="Ícone de nível"
              className="w-[140px] h-[70px] object-contain"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs text-[var(--text)] font-medium">
                Pontos para próximo nível
              </span>
              <span className="text-[1rem] font-bold">
                {xpNoNivelAtual}/{xpParaProximoNivel}
                <span className="text-[0.75rem] font-bold"> pts</span>
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="bg-[#f5f5f5] rounded-lg w-93.25 h-52 px-8 pt-8 pb-14 flex flex-col items-center justify-between">
          {user.achievements.length === 0 ? (
            <span className="text-sm text-[var(--text)] font-bold text-center">
              Você ainda não possui conquistas
            </span>
          ) : (
            <Carousel
              className="w-full max-w-full"
              opts={{ align: "start", slidesToScroll: 1, loop: false }}
            >
              <CarouselContent className="gap-0.25">
                {user.achievements.map((ach, index) => (
                  <CarouselItem key={index} className="basis-1/3">
                    <div className="w-24 h-30 flex flex-col items-center justify-start gap-2 text-center">
                      <div className="bg-[#ececec] rounded-full flex items-center justify-center w-20 h-20 p-5">
                        <img
                          src="/Achievement.png"
                          alt={`Achievement ${ach.name}`}
                          className="object-contain w-10 h-12"
                        />
                      </div>
                      <span className="text-[0.75rem] font-light text-[var(--text)] w-full text-center line-clamp-2">
                        {achievementCriteria[ach.name] ??
                          "Conquista desbloqueada"}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
