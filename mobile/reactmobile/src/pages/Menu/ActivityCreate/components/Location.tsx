import {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  MapPressEvent,
} from 'react-native-maps';
import {useFormContext, Controller} from 'react-hook-form';
import { Minus, Plus } from 'lucide-react-native';

type LocationProps = {
  value?: {latitude: number; longitude: number};
  editable?: boolean;
  height?: number;
  titleFontFamily?: string;
  titleFontSize?: number;
};

export default function Location({
  value,
  editable = true,
  height,
  titleFontFamily,
  titleFontSize,
}: LocationProps) {
  const mapRef = useRef<MapView>(null);

  let formContext: ReturnType<typeof useFormContext> | null = null;
  try {
    formContext = useFormContext();
  } catch {
    formContext = null;
  }

  const initialRegion: Region = {
    latitude: value?.latitude ?? -22.9068,
    longitude: value?.longitude ?? -43.1729,
    latitudeDelta: 60,
    longitudeDelta: 120,
  };

  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
  };

  const MIN_DELTA = 0.0002;
  const MAX_DELTA = 180;

  const zoom = (direction: 'in' | 'out') => {
    const deltaFactor = direction === 'in' ? 0.5 : 2;
    const newLatitudeDelta = Math.max(
      MIN_DELTA,
      Math.min(currentRegion.latitudeDelta * deltaFactor, MAX_DELTA),
    );
    const newLongitudeDelta = Math.max(
      MIN_DELTA,
      Math.min(currentRegion.longitudeDelta * deltaFactor, MAX_DELTA),
    );

    const newRegion = {
      ...currentRegion,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    };

    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200);
  };

  if (!formContext) {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            titleFontFamily ? {fontFamily: titleFontFamily} : {},
            titleFontSize !== undefined ? {fontSize: titleFontSize} : {},
          ]}>
          Ponto de Encontro
        </Text>
        <View style={[styles.mapWrapper, {height: height || 188}]}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            onPress={
              editable
                ? (event: MapPressEvent) => {
                    const region = {
                      latitude: event.nativeEvent.coordinate.latitude,
                      longitude: event.nativeEvent.coordinate.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    };
                    mapRef.current?.animateToRegion(region, 500);
                  }
                : undefined
            }>
            {value && <Marker coordinate={value} />}
          </MapView>

          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => zoom('in')}>
              <Plus size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => zoom('out')}>
              <Minus size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const {control} = formContext;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          titleFontFamily && {fontFamily: titleFontFamily},
        ]}>
        Ponto de Encontro
      </Text>
      <Controller
        control={control}
        name="location"
        defaultValue={null}
        render={({field: {value, onChange}, fieldState: {error}}) => {
          useEffect(() => {
            if (value) {
              const region: Region = {
                latitude: value.latitude,
                longitude: value.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              mapRef.current?.animateToRegion(region, 500);
            }
          }, [value]);

          return (
            <>
              <View style={[styles.mapWrapper, {height: height || 188}]}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={initialRegion}
                  onRegionChangeComplete={handleRegionChangeComplete}
                  onPress={(event: MapPressEvent) =>
                    onChange(event.nativeEvent.coordinate)
                  }
                  showsUserLocation>
                  {value && <Marker coordinate={value} />}
                </MapView>

                <View style={styles.zoomControls}>
                  <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={() => zoom('in')}>
                    {/* <Plus size={20} color="#000" /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.zoomButton}
                    onPress={() => zoom('out')}>
                    {/* <Minus size={20} color="#000" /> */}
                  </TouchableOpacity>
                </View>
              </View>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
    marginBottom: 12,
    color: '#000',
  },
  mapWrapper: {
    width: '100%',
    height: 188,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  zoomControls: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
    gap: 10,
  },
  zoomButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
