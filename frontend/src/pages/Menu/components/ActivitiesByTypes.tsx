import { Calendar, Lock, Users } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import ActivityDetails from "./ActivityDetails/ActivityDetails";
import SubscribeActivity from "./SubscribeActivity/SubscribeActivity";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  image: string;
  scheduledDate: string;
  participantCount: number;
  typeId: string;
  private: boolean;
  creator?: { id: string };
}

interface ActivityTypeGroup {
  id: string;
  name: string;
  activities: Activity[];
}

interface ActivitiesByTypesProps {
  data: ActivityTypeGroup[];
  onViewMore: (typeId: string) => void;
  showLimit?: number;
}

const ActivitiesByTypes = ({
  data,
  onViewMore,
  showLimit,
}: ActivitiesByTypesProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
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

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    if (activity.creator?.id === currentUserId) {
      setIsDetailsDialogOpen(true);
    } else {
      setIsSubscribeDialogOpen(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((group) => (
          <div key={group.id} className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <button
                onClick={() => onViewMore(group.id)}
                className="text-sm cursor-pointer"
              >
                Ver mais
              </button>
            </div>

            {group.activities?.length === 0 ? (
              <div className="text-sm text-gray-500">
                Nenhuma atividade do tipo <strong>{group.name}</strong>{" "}
                encontrada.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {group.activities?.slice(0, showLimit ?? 6).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 cursor-pointer"
                    onClick={() => handleActivityClick(activity)}
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
                          <Calendar className="w-4 h-4 text-[#009966]" />
                          <span className="whitespace-nowrap">
                            {format(
                              new Date(activity.scheduledDate),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <span className="mx-1">|</span>
                        <div className="flex items-center gap-[6px]">
                          <Users className="w-4 h-4 text-[#009966]" />
                          {activity.participantCount ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
    </div>
  );
};

export default ActivitiesByTypes;
