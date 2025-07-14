import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface TypesAndLocationProps {
  activityTypes: any[];
  activityType: string;
  setActivityType: (id: string) => void;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (pos: { lat: number; lng: number }) => void;
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
                    className="flex flex-col items-center gap-3 cursor-pointer h-30.5"
                    onClick={() => setActivityType(type.id)}
                  >
                    <img
                      src={type.image?.replace("localstack", "localhost")}
                      alt={type.name}
                      className={`w-20 h-20 rounded-full object-cover border-2 box-content ${
                        isSelected ? "border-primary" : "border-transparent"
                      }`}
                    />
                    <p className="text-[1rem] text-center font-semibold h-5 leading-none">
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
        <div className="h-52 rounded-[0.625rem] overflow-hidden">
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
          </MapContainer>
        </div>
      </div>
    </>
  );
}