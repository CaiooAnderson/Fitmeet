import { useEffect, useRef, useState } from "react";
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

interface Achievement {
  id?: string;
  name: string;
  criterion?: string;
}

interface ProfileUserInfoProps {
  user: {
    name?: string;
    avatar?: string;
    level?: number;
    xp?: number;
    achievements: Achievement[];
  };
}

export default function ProfileUserInfo({ user }: ProfileUserInfoProps) {
  const navigate = useNavigate();

  const xpAtual = user.xp ?? 0;
  const xpNoNivelAtual = xpAtual % 100;
  const xpParaProximoNivel = 100;
  const progressPercent = (xpNoNivelAtual / xpParaProximoNivel) * 100;

  const containerRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (container && text) {
      setIsOverflowing(text.scrollWidth > container.clientWidth);
    }
  }, [user.name]);

  useEffect(() => {
    const updateIsMobile = () =>
      setIsMobile(
        (typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches) ||
          window.innerWidth <= 640
      );
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && activeIndex !== null) setActiveIndex(null);
  }, [isMobile, activeIndex]);

  return (
    <div className="relative flex flex-col items-center w-full bg-[#fafafa] rounded-lg p-10">
      <div className="sm:flex mb-10 w-full justify-end items-center gap-1.5 hidden">
        <Button
          className="h-10 w-28 p-3 border border-[#a1a1a1] text-gray-900 bg-white hover:bg-muted"
          onClick={() => navigate("/profile/edit")}
        >
          <Pen className="w-3 h-3" />
          Editar perfil
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-48 h-48">
          <AvatarImage
            src={user.avatar?.replace("localstack", "localhost")}
            alt="Avatar do usuário"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </Avatar>
        <h1
          ref={containerRef}
          className="relative text-[2rem] font-bebas overflow-hidden w-48 text-center whitespace-nowrap"
        >
          <span
            ref={textRef}
            className={
              isOverflowing
                ? "title-marquee inline-block"
                : "inline-block truncate"
            }
          >
            {user.name}
          </span>
        </h1>

        <div className="sm:hidden flex justify-center w-full mt-4">
          <Button
            className="h-10 w-28 p-3 border border-[#a1a1a1] text-gray-900 bg-white hover:bg-muted"
            onClick={() => navigate("/profile/edit")}
          >
            <Pen className="w-3 h-3" />
            Editar perfil
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start mt-10 w-full max-w-[850px] justify-center">
        <div className="flex flex-col gap-8 bg-[#f5f5f5] rounded-lg px-8 py-8.5 w-full sm:w-[420px] h-52 [@media(max-width:320px)]:gap-4 [@media(max-width:320px)]:h-56">
          <div
            className="flex justify-between items-start sm:items-center [@media(max-width:320px)]:flex-col
    [@media(max-width:320px)]:items-center
    [@media(max-width:320px)]:gap-2"
          >
            <div
              className="flex flex-col gap-2 [@media(max-width:320px)]:flex-row
      [@media(max-width:320px)]:gap-1
      [@media(max-width:320px)]:items-center"
            >
              <span className="text-[0.75rem] h-[15px] font-semibold text-[var(--text)] [@media(max-width:320px)]:h-fit">
                Seu nível é
              </span>
              <span className="text-[1.5rem] h-7.5 font-bold text-[var(--title)] [@media(max-width:320px)]:text-[1.25rem]">
                {user.level}
              </span>
            </div>
            <img
              src="/Level.png"
              alt="Ícone de nível"
              className="w-[100px] h-[50px] sm:w-[140px] sm:h-[70px] object-contain mt-1 sm:mt-0 [@media(max-width:320px)]:mt-0
      [@media(max-width:320px)]:mb-2
      [@media(max-width:320px)]:order-first"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <span className="text-xs text-[var(--text)] font-medium">
                Pontos para próximo nível
              </span>
              <span className="text-[1rem] font-bold [@media(max-width:320px)]:text-lg">
                {xpNoNivelAtual}/{xpParaProximoNivel}
                <span className="text-[0.75rem] font-bold"> pts</span>
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="bg-[#f5f5f5] rounded-lg w-full sm:w-[390px] h-52 px-8 pt-8 pb-14 flex flex-col items-center justify-between [@media(max-width:320px)]:h-56">
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
                {user.achievements.map((ach, index) => {
                  const isActive = isMobile && activeIndex === index;
                  return (
                    <CarouselItem
                      key={index}
                      className="basis-1/2 sm:basis-1/3 [@media(max-width:320px)]:basis-full flex justify-center"
                    >
                      <div
                        className="w-24 h-30 flex flex-col items-center justify-start gap-2 text-center group"
                        onClick={() => {
                          if (isMobile) {
                            setActiveIndex((prev) =>
                              prev === index ? null : index
                            );
                          }
                        }}
                        role={isMobile ? "button" : undefined}
                        tabIndex={isMobile ? 0 : -1}
                        onKeyDown={(e) => {
                          if (!isMobile) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveIndex((prev) =>
                              prev === index ? null : index
                            );
                          }
                        }}
                      >
                        <div
                          className={`bg-[#ececec] rounded-full flex items-center justify-center w-20 h-20 p-5 transition duration-300 ${
                            !ach.name
                              ? ""
                              : "animate-pulse brightness-75 group-hover:brightness-100 group-hover:animate-none"
                          }`}
                        >
                          <img
                            src="/Achievement.png"
                            alt={`Achievement ${ach.name}`}
                            className="object-contain w-10 h-12"
                          />
                        </div>

                        <div className="relative w-full h-5 overflow-hidden leading-none">
                          <span
                            className={
                              isMobile
                                ? `text-[0.75rem] font-light text-primary underline underline-offset-2 decoration-primary block transition-opacity duration-300 ${
                                    isActive ? "opacity-0" : "opacity-100"
                                  }`
                                : `text-[0.75rem] font-light text-primary underline underline-offset-2 decoration-primary block transition-opacity duration-300 group-hover:opacity-0`
                            }
                          >
                            Conquista
                          </span>

                          <span
                            className={
                              isMobile
                                ? `text-[0.75rem] font-light text-[var(--text)] absolute left-0 top-0 whitespace-nowrap inline-block transition-opacity duration-300 ${
                                    isActive
                                      ? "opacity-100 animate-[marquee_6s_linear_infinite]"
                                      : "opacity-0"
                                  }`
                                : `text-[0.75rem] font-light text-[var(--text)] absolute left-0 top-0 whitespace-nowrap inline-block opacity-0 group-hover:opacity-100 group-hover:animate-[marquee_6s_linear_infinite] transition-opacity duration-300`
                            }
                          >
                            &nbsp;&nbsp;{ach.name}&nbsp;&nbsp;
                          </span>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
