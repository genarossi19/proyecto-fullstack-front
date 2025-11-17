import axios from "axios";

export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  is_day: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  precip_mm: number;
  pressure_mb: number;
  uv: number;
  vis_km: number;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: WeatherCurrent;
}

const WEATHER_API_URL =
  "https://api.weatherapi.com/v1/current.json?key=8bd2adfe51f2476b9ed161057252908&q=Trenque%20Lauquen&aqi=no";

export const getWeatherData = async (): Promise<WeatherResponse> => {
  const response = await axios.get<WeatherResponse>(WEATHER_API_URL);
  return response.data;
};
