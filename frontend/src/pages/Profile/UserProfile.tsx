import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import MenuHeader from "@/pages/Menu/components/MenuHeader";
import NewActivity from "@/pages/Menu/NewActivity/NewActivity";
import ProfileUserInfo from "./components/ProfileUserInfo";
import { Calendar, Users, Lock, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import ActivityDetails from "../Menu/components/ActivityDetails/ActivityDetails";
import SubscribeActivity from "../Menu/components/SubscribeActivity/SubscribeActivity";

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    level: 1,
    xp: 0,
    achievements: [],
  });
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [userHistoryActivities, setUserHistoryActivities] = useState<any[]>([]);
  const [visibleActivities, setVisibleActivities] = useState(4);
  const [visibleHistory, setVisibleHistory] = useState(12);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);

  useEffect(() => {
    const currentToken = sessionStorage.getItem("token");
    if (!currentToken) {
      navigate("/");
      return;
    }
    validateToken(currentToken);
    fetchUserActivities(currentToken);
    fetchUserHistoryActivities(currentToken);
  }, [navigate]);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Token inválido");
      const data = await response.json();
      setUser({
        name: data.name,
        avatar: data.avatar,
        level: data.level,
        xp: data.xp,
        achievements: data.achievements ?? [],
      });
    } catch {
      toast.error("Token inválido.");
      sessionStorage.removeItem("token");
      navigate("/");
    }
  };

  const fetchUserActivities = async (token: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/user/creator?page=0&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUserActivities(data.activities || []);
    } catch {
      toast.error("Erro ao carregar atividades criadas.");
    }
  };

  const fetchUserHistoryActivities = async (token: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/activities/user/participant?page=0&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUserHistoryActivities(data.activities || []);
    } catch {
      toast.error("Erro ao carregar histórico de atividades.");
    }
  };

  const handleActivityClick = (activity: any, isOwner: boolean) => {
    console.log("Atividade selecionada:", activity);
    setSelectedActivity(activity);
    if (isOwner) {
      setIsDetailsDialogOpen(true);
    } else {
      setIsSubscribeDialogOpen(true);
    }
  };

  const showMoreActivities = () => {
    setVisibleActivities((prev) => prev + 4);
  };

  const showMoreHistory = () => {
    setVisibleHistory((prev) => prev + 8);
  };

  return (
    <div className="pt-6 pb-3 w-full sm:px-10 px-5 flex flex-col items-center">
      <div className="flex flex-col gap-14 w-full max-w-[76.25rem]">
        <MenuHeader
          avatar={user.avatar ?? ""}
          level={user.level ?? 1}
          name={user.name ?? ""}
          onLogout={() => {
            sessionStorage.removeItem("token");
            navigate("/");
          }}
          onCreateActivity={() => setIsNewActivityOpen(true)}
        />

        <ProfileUserInfo user={user} />

        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-[2rem] text-[#171717] font-bebas h-8 leading-snug">
            MINHAS ATIVIDADES
          </h2>
          {userActivities.length === 0 ? (
            <p className="text-base text-[var(--text)]">
              Você ainda não criou atividades.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
              {userActivities.slice(0, visibleActivities).map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 cursor-pointer"
                  onClick={() => handleActivityClick(activity, true)}
                >
                  <div className="relative w-22 h-22 flex-shrink-0">
                    <img
                      src={activity.image?.replace("localstack", "localhost")}
                      alt="Imagem da atividade"
                      className="w-full h-full object-cover rounded-md"
                    />
                    {activity.private && (
                      <div className="absolute top-[3px] left-[3px] bg-emerald-500 p-[6px] rounded-full">
                        <Lock className="w-[13px] h-[13px] text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center min-h-[88px] overflow-hidden text-ellipsis whitespace-nowrap">
                    <p className="text-[1rem] font-semibold leading-[20px] max-h-[40px] overflow-hidden text-ellipsis">
                      {activity.title}
                    </p>
                    <div className="flex items-center h-5 gap-[12px] text-xs text-gray-500 mt-3">
                      <div className="flex items-center gap-[6px]">
                        <Calendar className="w-4 h-4 text-[var(--primary-600)]" />
                        <span className="whitespace-nowrap">
                          {format(
                            new Date(activity.scheduledDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </div>
                      <span className="mx-1">|</span>
                      <div className="flex items-center gap-[6px]">
                        <Users className="w-4 h-4 text-[var(--primary-600)]" />
                        {activity.participantCount ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userActivities.length > visibleActivities && (
            <button
              onClick={showMoreActivities}
              className="self-center text-sm text-white p-3 rounded-sm flex items-center gap-1 bg-emerald-500 h-10 w-26 cursor-pointer"
            >
              Ver mais
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-[2rem] text-[#171717] font-bebas h-8 leading-snug">
            HISTÓRICO DE ATIVIDADES
          </h2>
          {userHistoryActivities.length === 0 ? (
            <p className="text-base text-[var(--text)]">
              Você ainda não possui histórico em alguma atividade.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
              {userHistoryActivities
                .slice(0, visibleHistory)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 cursor-pointer"
                    onClick={() => handleActivityClick(activity, false)}
                  >
                    <div className="relative w-22 h-22 flex-shrink-0">
                      <img
                        src={activity.image?.replace("localstack", "localhost")}
                        alt="Imagem da atividade"
                        className="w-full h-full object-cover rounded-md"
                      />
                      {activity.private && (
                        <div className="absolute top-[3px] left-[3px] bg-emerald-500 p-[6px] rounded-full">
                          <Lock className="w-[13px] h-[13px] text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center min-h-[88px] overflow-hidden text-ellipsis whitespace-nowrap">
                      <p className="text-[1rem] font-semibold leading-[20px] max-h-[40px] overflow-hidden text-ellipsis">
                        {activity.title}
                      </p>
                      <div className="flex items-center h-5 gap-[12px] text-xs text-gray-500 mt-3">
                        <div className="flex items-center gap-[6px]">
                          <Calendar className="w-4 h-4 text-[var(--primary-600)]" />
                          <span className="whitespace-nowrap">
                            {format(
                              new Date(activity.scheduledDate),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <span className="mx-1">|</span>
                        <div className="flex items-center gap-[6px]">
                          <Users className="w-4 h-4 text-[var(--primary-600)]" />
                          {activity.participantCount ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {userHistoryActivities.length > visibleHistory && (
            <button
              onClick={showMoreHistory}
              className="self-center text-sm text-white p-3 rounded-sm flex items-center gap-1 bg-emerald-500 h-10 w-26 cursor-pointer"
            >
              Ver mais
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {selectedActivity && (
        <>
          <ActivityDetails
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            activity={selectedActivity}
          />
          <SubscribeActivity
            isOpen={isSubscribeDialogOpen}
            onClose={() => setIsSubscribeDialogOpen(false)}
            activity={selectedActivity}
          />
        </>
      )}
      <NewActivity
        isOpen={isNewActivityOpen}
        onClose={() => setIsNewActivityOpen(false)}
      />
    </div>
  );
}

export default Menu;
