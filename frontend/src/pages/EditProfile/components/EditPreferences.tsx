import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Check } from "lucide-react";

interface EditPreferencesProps {
  activityTypes: any[];
  selectedPreferences: string[];
  setSelectedPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  isReady: boolean;
}

export default function EditPreferences({
  activityTypes,
  selectedPreferences,
  setSelectedPreferences,
  isReady,
}: EditPreferencesProps) {
  console.log("EditPreferences render: selectedPreferences =", selectedPreferences);
  console.log("EditPreferences render: activityTypes =", activityTypes.map(t => t.id));
  
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[var(--text)] font-semibold text-[1rem] h-5">
        Preferências
      </label>

      {isReady && (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {activityTypes.map((type) => {
              const isSelected = selectedPreferences.includes(type.id);
              return (
                <CarouselItem
                  key={type.id}
                  className="pl-2 basis-auto shrink-0 w-fit"
                >
                  <div
                    className="flex flex-col items-center gap-3 cursor-pointer h-30.5"
                    onClick={() =>
                      setSelectedPreferences((prev) =>
                        prev.includes(type.id)
                          ? prev.filter((id) => id !== type.id)
                          : [...prev, type.id]
                      )
                    }
                  >
                    <div
                      className={`relative w-20 h-20 rounded-full border-2 box-content p-0.75 transition-all overflow-hidden ${
                        isSelected ? "border-emerald-500" : "border-transparent"
                      }`}
                    >
                      <div
                        className={`w-full h-full ${
                          isSelected ? "brightness-30" : ""
                        }`}
                      >
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="text-green-300 bg-black/80 ring-1 ring-green-300 rounded-full p-1 w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <p className="text-[1rem] text-center font-semibold h-5 leading-none">
                      {type.name}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
