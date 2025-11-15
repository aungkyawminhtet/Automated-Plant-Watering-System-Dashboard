import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Droplet, Thermometer, Wind, CloudRain, Waves } from "lucide-react";
import { SensorReading } from "./Dashboard";

interface SensorDataCardsProps {
  currentData: SensorReading;
}

export function SensorDataCards({ currentData }: SensorDataCardsProps) {
  const cards = [
    {
      title: "Soil Moisture",
      value: currentData.soilMoisture.toFixed(1),
      unit: "%",
      icon: Droplet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status:
        currentData.soilMoisture > 50
          ? "Optimal"
          : currentData.soilMoisture > 30
          ? "Good"
          : "Low",
      statusColor:
        currentData.soilMoisture > 50
          ? "text-green-600"
          : currentData.soilMoisture > 30
          ? "text-yellow-600"
          : "text-red-600",
    },
    {
      title: "Temperature",
      value: currentData.temperature.toFixed(1),
      unit: "°C",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status:
        currentData.temperature > 30
          ? "Hot"
          : currentData.temperature > 20
          ? "Normal"
          : "Cool",
      statusColor:
        currentData.temperature > 30
          ? "text-orange-600"
          : currentData.temperature > 20
          ? "text-green-600"
          : "text-blue-600",
    },
    {
      title: "Humidity",
      value: currentData.humidity.toFixed(1),
      unit: "%",
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      status:
        currentData.humidity > 70
          ? "High"
          : currentData.humidity > 40
          ? "Normal"
          : "Low",
      statusColor:
        currentData.humidity > 70
          ? "text-cyan-600"
          : currentData.humidity > 40
          ? "text-green-600"
          : "text-yellow-600",
    },
    {
      title: "Rainfall",
      value: currentData.rainfall.toFixed(1),
      unit: "mm",
      icon: CloudRain,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      status: currentData.rainfall > 0 ? "Raining" : "No Rain",
      statusColor: currentData.rainfall > 0 ? "text-indigo-600" : "text-slate-400",
    },
    {
      title: "Water Tank",
      value: currentData.waterLevel.toFixed(1),
      unit: "%",
      icon: Waves,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status:
        currentData.waterLevel >= 70
          ? "Full"
          : currentData.waterLevel >= 40
          ? "Good"
          : currentData.waterLevel >= 20
          ? "Low"
          : "Critical",
      statusColor:
        currentData.waterLevel >= 70
          ? "text-green-600"
          : currentData.waterLevel >= 40
          ? "text-yellow-600"
          : currentData.waterLevel >= 20
          ? "text-orange-600"
          : "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-600">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-900">
                {card.value}
              </span>
              <span className="text-sm text-slate-500">{card.unit}</span>
            </div>
            <p className={`text-xs mt-1 ${card.statusColor}`}>{card.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
