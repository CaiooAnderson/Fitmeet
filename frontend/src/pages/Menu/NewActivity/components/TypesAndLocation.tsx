import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MapContainer, TileLayer, Marker, useMapEvents, Pane } from "react-leaflet";
import L from "leaflet";

interface TypesAndLocationProps {
  activityTypes: any[];
  activityType: string;
  setActivityType: (id: string) => void;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (pos: { lat: number; lng: number }) => void;
  isScheduleOpen: boolean;
}

function LocationMarker({
  setLatLng,
}: {
  setLatLng: (latlng: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
}

export default function TypesAndLocation({
  activityTypes,
  activityType,
  setActivityType,
  coordinates,
  setCoordinates,
  isScheduleOpen,
}: TypesAndLocationProps) {
  const mapCenter: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [-23.55052, -46.633308];

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label className="text-[1rem] font-semibold h-5 text-[var(--text)]">
          Tipo da atividade <span className="text-[var(--warning)] h-5">*</span>
        </Label>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {activityTypes.map((type) => {
              const isSelected = String(activityType) === String(type.id);
              return (
                <CarouselItem
                  key={type.id}
                  className="pl-2 basis-auto shrink-0 w-fit"
                >
                  <div
                    className="flex flex-col items-center gap-3 cursor-pointer h-30.5 group"
                    onClick={() => setActivityType(type.id)}
                  >
                    <img
                      src={type.image?.replace("localstack", "localhost")}
                      alt={type.name}
                      className={`w-20 h-20  rounded-full object-cover border-2 box-content transition duration-300
                  ${isSelected ? "border-primary" : "border-transparent"}
                  group-hover:brightness-75
                `}
                    />
                    <p className="text-[1rem] text-center font-semibold h-5 leading-none text-ellipsis overflow-hidden max-w-full">
                      {type.name}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[1rem] font-semibold h-5 text-[var(--text)]">
          Ponto de encontro <span className="text-[var(--warning)] h-5">*</span>
        </Label>

        <div className="h-52 rounded-[0.625rem] overflow-visible relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            <LocationMarker setLatLng={setCoordinates} />
            {coordinates && (
              <Marker
                position={coordinates}
                icon={L.icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              />
            )}

            {coordinates && !isScheduleOpen && (
              <Pane name="coordinatesOverlay" style={{ zIndex: 650 }}>
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    padding: "2px 8px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                  }}
                >
                  Lat: {coordinates.lat.toFixed(5)}, Lng:{" "}
                  {coordinates.lng.toFixed(5)}
                </div>
              </Pane>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
