import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

interface PreviewMapProps {
  coordinates: { lat: number; lng: number };
}

export default function PreviewMap({ coordinates }: PreviewMapProps) {
  return (
    <div className="h-full w-full rounded-[0.625rem] overflow-hidden">
      <MapContainer
        center={coordinates}
        zoom={13}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        <Marker
          position={coordinates}
          icon={L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        />
      </MapContainer>
    </div>
  );
}