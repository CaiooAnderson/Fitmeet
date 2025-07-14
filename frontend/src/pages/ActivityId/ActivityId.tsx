import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import MenuHeader from "../Menu/components/MenuHeader";
import Recommended from "../Menu/components/Recommended";
import ActivityTypes from "../Menu/components/ActivityTypes";
import ActivitiesIdList from "./ActivitiesIdList";
import NewActivity from "../Menu/NewActivity/NewActivity";
import ActivityDetails from "../Menu/components/ActivityDetails/ActivityDetails";
import SubscribeActivity from "../Menu/components/SubscribeActivity/SubscribeActivity";

export default function ActivityId() {
  const { id: typeId } = useParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>({});
  const [typeName, setTypeName] = useState<string>("");
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);

  useEffect(() => {
    const currentToken = sessionStorage.getItem("token");
    if (!currentToken) {
      navigate("/");
      return;
    }
    setToken(currentToken);
    validateToken(currentToken);
  }, [navigate]);

  const validateToken = async (token: string) => {
    try {
      const res = await fetch("http://localhost:3000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Token inválido");
      const data = await res.json();
      setUser(data);
      fetchAll(token);
    } catch {
      toast.error("Token inválido.");
      sessionStorage.removeItem("token");
      navigate("/");
    }
  };

  const fetchAll = async (token: string) => {
    try {
      const typesRes = await fetch("http://localhost:3000/activities/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const typesData = await typesRes.json();

      const currentType = typesData.find((t: any) => t.id === typeId);
      setTypeName(currentType?.name ?? "Tipo");

      const activitiesRes = await fetch(
        `http://localhost:3000/activities?page=0&pageSize=100&typeId=${typeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await activitiesRes.json();

      const valid = data.activities.filter(
        (a: any) => !a.completedAt && !a.deletedAt
      );

      setActivities(valid);
    } catch {
      setError("Erro ao carregar atividades.");
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleTypeClick = (typeId: string) => {
    navigate(`/activities/${typeId}`);
  };

  return (
    <div className="pt-6 pb-3.5 w-full sm:px-10 px-5 flex flex-col items-center">
      <div className="flex flex-col gap-14 w-full max-w-[76.25rem]">
        <MenuHeader
          avatar={user.avatar ?? ""}
          level={user.level ?? 1}
          name={user.name ?? ""}
          onLogout={() => {
            sessionStorage.removeItem("token");
            navigate("/");
          }}
          onCreateActivity={handleOpenDialog}
        />

        <Recommended
          activities={activities.slice(0, 8)}
          randomActivities={[]}
          error={error}
          handleTypeClick={handleTypeClick}
          preferences={[]}
          title={`POPULAR EM ${typeName.toUpperCase()}`}
          includeCreator={true}
        />

        <ActivitiesIdList
          token={token!}
          typeId={typeId!}
          userId={user.id}
          onClickActivity={(activity) => {
            setSelectedActivity(activity);
            if (activity.creator?.id === user.id) {
              setIsDetailsDialogOpen(true);
            } else {
              setIsSubscribeDialogOpen(true);
            }
          }}
        />

        <ActivityTypes
          token={token}
          handleTypeClick={handleTypeClick}
          excludeTypeId={typeId}
          title="OUTROS TIPOS DE ATIVIDADE"
        />

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

        <NewActivity isOpen={isDialogOpen} onClose={handleCloseDialog} />
      </div>
    </div>
  );
}
