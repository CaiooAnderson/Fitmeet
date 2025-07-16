import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import MenuHeader from "@/pages/Menu/components/MenuHeader";
import { Button } from "@/components/ui/button";
import Return from "./components/Return";
import EditAvatar from "./components/EditAvatar";
import EditUserForm from "./components/EditUserForm";
import NewActivity from "../Menu/NewActivity/NewActivity";
import EditPreferences from "./components/EditPreferences";
import DeactivateUser from "./components/DeactivateUser";

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    avatar: "",
    level: 1,
    email: "",
    cpf: "",
    preferences: [],
  });
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return navigate("/");

      const [userRes, prefsRes, typesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/user/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/activities/types`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userData = await userRes.json();
      const prefsData = await prefsRes.json();
      const typesData = await typesRes.json();

      setUser(userData);
      setPreviewUrl(userData.avatar?.replace("localstack", "localhost") || "");
      setSelectedPreferences(prefsData.map((item: any) => item.typeId));
      setActivityTypes(typesData);
      setIsReady(true);
    };

    fetchAll();
  }, [navigate]);

  const handleUpdateUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return navigate("/");

    setIsLoading(true);

    try {
      if (newAvatar) {
        const formData = new FormData();
        formData.append("avatar", newAvatar);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/avatar`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) throw new Error("Erro ao atualizar avatar");

        const data = await res.json();
        const updatedAvatar = data.avatar?.replace("localstack", "localhost");
        setUser((prev) => ({ ...prev, avatar: updatedAvatar }));
        setPreviewUrl(updatedAvatar);
      }

      const body: any = {
        name: user.name,
        email: user.email,
      };
      if (password) body.password = password;

      const resUpdate = await fetch(`${import.meta.env.VITE_API_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!resUpdate.ok) throw new Error("Erro ao atualizar dados do usuário");

      if (selectedPreferences.length === 0) {
        toast.error("Você precisa selecionar ao menos uma preferência.");
        return;
      }

      const resPrefs = await fetch(
        `${import.meta.env.VITE_API_URL}/user/preferences/define`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedPreferences),
        }
      );

      if (!resPrefs.ok) throw new Error("Erro ao salvar preferências");

      toast.success("Perfil atualizado com sucesso!");
      navigate("/profile");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 w-full flex flex-col items-center">
      <div className="w-full max-w-[76.25rem]">
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

        <div className="mt-14 w-80 mx-auto flex flex-col items-start gap-10">
          <Return />

          <div className="flex flex-col items-center w-full gap-10">
            <EditAvatar
              previewUrl={previewUrl}
              setNewAvatar={setNewAvatar}
              setPreviewUrl={setPreviewUrl}
            />
          </div>

          <div className="w-full flex flex-col gap-4">
            <EditUserForm
              user={user}
              setUser={setUser}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <EditPreferences
              activityTypes={activityTypes}
              selectedPreferences={selectedPreferences}
              setSelectedPreferences={setSelectedPreferences}
              isReady={isReady}
            />
          </div>
        </div>
        <div className="mx-auto w-80 flex flex-col gap-6 mt-6">
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <Button className="h-12 w-full" onClick={handleUpdateUser}>
              {isLoading ? "Salvando..." : "Editar"}
            </Button>
            <Button
              className="h-12 w-full"
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Cancelar
            </Button>
          </div>
          <DeactivateUser />
        </div>
      </div>
      <NewActivity
        isOpen={isNewActivityOpen}
        onClose={() => setIsNewActivityOpen(false)}
      />
    </div>
  );
}
