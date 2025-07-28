import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import MenuHeader from "@/pages/Menu/components/MenuHeader";
import Recommended from "@/pages/Menu/components/Recommended";
import ActivityTypes from "@/pages/Menu/components/ActivityTypes";
import NewActivity from "@/pages/Menu/NewActivity/NewActivity";
import PreferencesDialog from "@/pages/Menu/components/PreferencesDialog";
import ActivitiesByTypes from "@/pages/Menu/components/ActivitiesByTypes";

function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    name?: string;
    avatar?: string;
    level?: number;
  }>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [randomActivities, setRandomActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activitiesGrouped, setActivitiesGrouped] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);

  useEffect(() => {
    const currentToken = sessionStorage.getItem("token");
    if (!currentToken) {
      navigate("/");
      return;
    }
    setToken(currentToken);
    validateToken(currentToken);
  }, [navigate]);

  useEffect(() => {
    if (!token || activities.length === 0) return;

    const random = [...activities].sort(() => 0.5 - Math.random()).slice(0, 8);
    setRandomActivities(random);
  }, [token, activities]);

  const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Token inválido");

    const data = await response.json();
    setUser({ name: data.name, avatar: data.avatar, level: data.level });

    await fetchActivities(token);
    await fetchPreferences(token);
  } catch {
    toast.error("Token inválido.");
    sessionStorage.removeItem("token");
    navigate("/");
  }
};

  const fetchPreferences = async (token: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const preferenceIds = data.map((item: any) => item.typeId);
    setPreferences(preferenceIds);

    setShowPreferencesDialog(preferenceIds.length === 0);
  } catch {
    toast.error("Erro ao carregar preferências do usuário.");
  }
};

  const fetchActivities = async (token: string) => {
  try {
    const page = 0;
    const pageSize = 50;

    const [activitiesRes, typesRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/activities?page=${page}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${import.meta.env.VITE_API_URL}/activities/types`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const [activitiesData, typesData] = await Promise.all([
      activitiesRes.json(),
      typesRes.json(),
    ]);

    const filtered = activitiesData.activities.filter(
      (activity: any) => !activity.completedAt && !activity.deletedAt
    );

    const enriched = filtered.map((activity: any) => {
      const match = typesData.find(
        (t: { id: string; name: string }) => t.name === activity.type
      );
      return {
        ...activity,
        type: match?.id ?? activity.type,
      };
    });

    setActivities(enriched);

    const groupedByType = await Promise.all(
      typesData.map(async (type: any) => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/activities?page=0&pageSize=6&typeId=${type.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        return {
          id: type.id,
          name: type.name,
          activities: data.activities.filter(
            (a: any) => !a.completedAt && !a.deletedAt
          ),
        };
      })
    );

    setActivitiesGrouped(groupedByType);
    setError(null);
  } catch {
    setError("Erro ao carregar atividades.");
  }
};

  const handleTypeClick = (typeId: string) => {
    navigate(`/activities/${typeId}`);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePreferencesSaved = () => {
    if (token) {
      fetchPreferences(token);
    }
  };

  return (
    <div className="pt-6 w-full sm:px-10 px-5 flex flex-col items-center">
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
          activities={activities}
          randomActivities={randomActivities}
          error={error}
          handleTypeClick={handleTypeClick}
          preferences={preferences}
        />
        <ActivityTypes token={token} handleTypeClick={handleTypeClick} />
        <ActivitiesByTypes
          data={activitiesGrouped}
          onViewMore={handleTypeClick}
        />
      </div>

      {token && showPreferencesDialog && (
        <PreferencesDialog
          token={token}
          onPreferencesSaved={handlePreferencesSaved}
        />
      )}

      <NewActivity isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}

export default Menu;
