import { useEffect, useState } from "react";
import { Calendar, Lock, Users, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  title: string;
  image: string;
  scheduledDate: string;
  participantCount: number;
  typeId: string;
  private: boolean;
  completedAt?: string | null;
  deletedAt?: string | null;
}

interface Props {
  token: string;
  typeId: string;
  userId: string;
  onClickActivity: (activity: any) => void;
}

export default function ActivitiesIdList({
  token,
  typeId,
  onClickActivity,
}: Props) {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [visibleCount, setVisibleCount] = useState(16);

  const fetchAllActivities = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/activities/all?typeId=${typeId}&orderBy=createdAt&order=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const filtered = data.filter(
        (a: Activity) => !a.completedAt && !a.deletedAt
      );
      setAllActivities(filtered);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) {
      setAllActivities([]);
      setVisibleCount(16);
      fetchAllActivities();
    }
  }, [typeId, token]);

  const visibleActivities = allActivities.slice(0, visibleCount);
  const hasMore = visibleActivities.length < allActivities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
        {visibleActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3 cursor-pointer"
            onClick={() => onClickActivity(activity)}
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

      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="self-center text-sm text-white p-3 rounded-sm flex items-center gap-1 bg-emerald-500 h-10 cursor-pointer"
        >
          Ver mais
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
