import { useEffect, useState } from "react";

interface ActivityTypesProps {
  token: string | null;
  handleTypeClick: (typeId: string) => void;
  excludeTypeId?: string;
  title?: string;
}

const ActivityTypes = ({
  token,
  handleTypeClick,
  excludeTypeId,
  title,
}: ActivityTypesProps) => {
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/activities/types`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setActivityTypes(data);
        } catch {
          setError("Erro ao carregar tipos de atividade.");
        }
      }
    };

    fetchActivityTypes();
  }, [token]);

  const tiposParaExibir = excludeTypeId
    ? activityTypes.filter((t) => t.id !== excludeTypeId)
    : activityTypes;

  return (
    <div className="w-full">
      <h2 className="text-[1.75rem] font-bebas h-8 mb-4 text-[#171717]">
        {title ?? "TIPOS DE ATIVIDADE"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-3 mt-4">
        {tiposParaExibir.map((type) => (
          <div
            key={type.id}
            className="flex flex-col items-center justify-start h-[122px] cursor-pointer text-[#171717]"
            onClick={() => handleTypeClick(type.id)}
          >
            <div className="flex items-center justify-center w-[90px] h-[90px] p-[5px]">
              <img
                src={type.image?.replace("localstack", "localhost")}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className="text-[1rem] font-semibold text-center h-5 leading-5 mt-3">
              {type.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTypes;
