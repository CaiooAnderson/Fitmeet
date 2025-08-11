import { useEffect, useState } from "react";
import { Calendar, Users, Lock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import SubscribeActivity from "./SubscribeActivity/SubscribeActivity";
import ActivityDetails from "./ActivityDetails/ActivityDetails";

interface RecommendedProps {
  activities: any[];
  randomActivities: any[];
  error: string | null;
  handleTypeClick: (typeId: string) => void;
  preferences: string[];
  title?: string;
  includeCreator?: boolean;
}

const Recommended = ({
  activities,
  randomActivities,
  error,
  preferences,
  title,
  includeCreator,
}: RecommendedProps) => {
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        setCurrentUserId(user.id);
      } catch {
        toast.error("Erro ao buscar usuário.");
      }
    };

    fetchUserId();
  }, []);

  const validActivities = activities.length > 0 ? activities : randomActivities;

  const filteredActivities = (
    preferences.length > 0
      ? validActivities.filter((activity) =>
          preferences.includes(
            activity.type?.id || activity.activityTypeId || activity.type
          )
        )
      : validActivities
  ).filter((activity) =>
    includeCreator ? true : activity.creator?.id !== currentUserId
  );

  const listToShow = filteredActivities.slice(0, 8);
  const firstLine = listToShow.slice(0, 4);
  const secondLine = listToShow.slice(4, 8);

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    if (activity.creator?.id === currentUserId) {
      setIsDetailsDialogOpen(true);
    } else {
      setIsSubscribeDialogOpen(true);
    }
  };

  const cardClass =
    "cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap flex flex-col items-start " +
    "sm:w-full md:w-1/2 lg:w-1/4 p-2";

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center h-8 mb-4">
        <h2 className="text-[1.75rem] font-bebas">
          {title ?? "RECOMENDADO PARA VOCÊ"}
        </h2>
      </div>

      {error && (
        <div className="h-57 flex items-center justify-center text-red-500">
          {error}
        </div>
      )}

      {!error && (
        <>
          {listToShow.length === 0 ? (
            <div className="h-57 flex items-center justify-center text-gray-500 text-sm">
              Nenhuma atividade de sua preferência disponível no momento.
            </div>
          ) : (
            <>
              {/* Primeira linha */}
              <div className="flex flex-wrap gap-3">
                {firstLine.map((activity) => (
                  <div
                    key={activity.id}
                    className={cardClass}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={activity.image?.replace("localstack", "localhost")}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {activity.private && (
                        <div className="absolute top-1 left-1 p-[6px] bg-gradient-to-b from-[#00BC7D] to-[#009966] rounded-full">
                          <Lock className="text-white w-[16px] h-[16px]" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-left overflow-hidden text-ellipsis max-w-full">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#404040] mt-3 h-5">
                      <Calendar className="w-4 h-4 text-[#009966]" />
                      {format(
                        new Date(activity.scheduledDate),
                        "dd/MM/yyyy HH:mm"
                      )}
                      <span className="mx-1">|</span>
                      <Users className="w-4 h-4 text-[#009966]" />
                      {activity.participantCount ?? 0}
                    </div>
                  </div>
                ))}
              </div>

              {/* Segunda linha */}
              {secondLine.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {secondLine.map((activity) => (
                    <div
                      key={activity.id}
                      className={cardClass}
                      onClick={() => handleActivityClick(activity)}
                    >
                      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                        <img
                          src={activity.image?.replace(
                            "localstack",
                            "localhost"
                          )}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {activity.private && (
                          <div className="absolute top-1 left-1 p-[6px] bg-emerald-500 rounded-full">
                            <Lock className="text-white w-[16px] h-[16px]" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-left overflow-hidden text-ellipsis max-w-full">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 h-5">
                        <Calendar className="w-4 h-4 text-[#009966]" />
                        {format(
                          new Date(activity.scheduledDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                        <span className="mx-1">|</span>
                        <Users className="w-4 h-4 text-[#009966]" />
                        {activity.participantCount ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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
        </>
      )}
    </div>
  );
};

export default Recommended;
