import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  Eye,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Sun,
} from "lucide-react";
import {
  fetchWeatherData,
  getWeatherIconUrl,
  getIrrigationRecommendation,
  WeatherData,
} from "../services/weatherService";
import { Alert, AlertDescription } from "./ui/alert";

interface WeatherWidgetProps {
  currentMoisture: number;
}

export function WeatherWidget({ currentMoisture }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();

    // Refresh weather data every 30 minutes
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Weather data unavailable"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const recommendation = getIrrigationRecommendation(weatherData, currentMoisture);

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            Current Weather - {weatherData.location.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={getWeatherIconUrl(weatherData.current.icon)}
                alt={weatherData.current.description}
                className="w-20 h-20"
              />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-900">
                    {weatherData.current.temp.toFixed(1)}
                  </span>
                  <span className="text-lg text-slate-500">°C</span>
                </div>
                <p className="text-sm text-slate-600 capitalize">
                  {weatherData.current.description}
                </p>
                <p className="text-xs text-slate-500">
                  Feels like {weatherData.current.feelsLike.toFixed(1)}°C
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500">Humidity</p>
                <p>{weatherData.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wind className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Wind Speed</p>
                <p>{weatherData.current.windSpeed.toFixed(1)} m/s</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Pressure</p>
                <p>{weatherData.current.pressure.toFixed(0)} hPa</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Visibility</p>
                <p>{(weatherData.current.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-16 text-sm text-slate-600">
                    {day.date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-10 h-10"
                  />
                  <div className="flex-1">
                    <p className="text-sm capitalize">{day.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {day.precipitationProbability.toFixed(0)}%
                      </span>
                      {day.precipitation > 0 && (
                        <span>{day.precipitation.toFixed(1)} mm</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>{day.tempMin.toFixed(0)}°</span>
                  </div>
                  <span className="text-slate-400">/</span>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{day.tempMax.toFixed(0)}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Irrigation Recommendation */}
      <Card className={recommendation.shouldIrrigate ? "border-blue-200" : "border-green-200"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-600" />
            Smart Irrigation Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            {recommendation.shouldIrrigate ? (
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm">
                  {recommendation.shouldIrrigate ? "Irrigation Recommended" : "No Irrigation Needed"}
                </p>
                <Badge
                  variant={
                    recommendation.confidence === "high"
                      ? "default"
                      : recommendation.confidence === "medium"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {recommendation.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{recommendation.reason}</p>
              
              <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-1">
                <p className="text-xs text-slate-500">Current Conditions:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Soil Moisture: </span>
                    <span
                      className={
                        currentMoisture > 50
                          ? "text-green-600"
                          : currentMoisture > 30
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {currentMoisture.toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Next Rain: </span>
                    <span>
                      {weatherData.forecast[0].precipitationProbability.toFixed(0)}% chance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
