import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Wind, Droplets, Eye, Gauge, Zap, Cloud } from "lucide-react";
import type { WeatherResponse } from "../api/services/WeatherService";

interface WeatherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherResponse | null;
}

export function WeatherDetailsModal({
  isOpen,
  onClose,
  weatherData,
}: WeatherDetailsModalProps) {
  if (!weatherData) return null;

  const { current, location } = weatherData;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Detalles del Clima - {location.name}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6 mt-6 pr-4">
          {/* Main Weather Info */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {current.condition.text}
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {current.temp_c}°C
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Sensación térmica: {current.feelslike_c}°C
                </p>
              </div>
              <img
                src={`https:${current.condition.icon}`}
                alt={current.condition.text}
                className="w-24 h-24"
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {location.name}, {location.region}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Coordenadas: {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}
              °
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Última actualización: {current.last_updated}
            </p>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Wind */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-semibold text-gray-600">Viento</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.wind_kph} km/h
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dirección: {current.wind_dir}
              </p>
            </div>

            {/* Humidity */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-semibold text-gray-600">Humedad</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.humidity}%
              </p>
            </div>

            {/* Cloud Coverage */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Cloud className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-600">Nubosidad</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.cloud}%
              </p>
            </div>

            {/* Precipitation */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <p className="text-xs font-semibold text-gray-600">
                  Precipitación
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.precip_mm} mm
              </p>
            </div>

            {/* Pressure */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-4 h-4 text-orange-500" />
                <p className="text-xs font-semibold text-gray-600">Presión</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.pressure_mb} mb
              </p>
            </div>

            {/* UV Index */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <p className="text-xs font-semibold text-gray-600">Índice UV</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{current.uv}</p>
            </div>

            {/* Visibility */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-semibold text-gray-600">
                  Visibilidad
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {current.vis_km} km
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
