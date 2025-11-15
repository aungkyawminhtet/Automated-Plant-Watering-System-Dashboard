import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { AlertTriangle, Droplets, TrendingDown, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface WaterTankMonitorProps {
  waterLevel: number; // percentage (0-100)
  tankCapacity: number; // liters
  dailyUsage: number; // liters
  flowRate: number; // liters per minute
  isPumpActive: boolean;
}

export function WaterTankMonitor({
  waterLevel,
  tankCapacity,
  dailyUsage,
  flowRate,
  isPumpActive,
}: WaterTankMonitorProps) {
  const currentVolume = (waterLevel / 100) * tankCapacity;
  const daysRemaining = dailyUsage > 0 ? currentVolume / dailyUsage : 0;

  const getStatusColor = (level: number) => {
    if (level >= 70) return "text-green-600";
    if (level >= 40) return "text-yellow-600";
    if (level >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (level: number) => {
    if (level >= 70) return "bg-green-600";
    if (level >= 40) return "bg-yellow-600";
    if (level >= 20) return "bg-orange-600";
    return "bg-red-600";
  };

  const getStatusText = (level: number) => {
    if (level >= 70) return "Optimal";
    if (level >= 40) return "Good";
    if (level >= 20) return "Low";
    return "Critical";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Storage Tank
          </CardTitle>
          <Badge
            variant={waterLevel >= 40 ? "default" : "destructive"}
            className="gap-1"
          >
            {getStatusText(waterLevel)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Low Water Alert */}
        {waterLevel < 20 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Water level critically low! Please refill tank immediately.
            </AlertDescription>
          </Alert>
        )}

        {waterLevel >= 20 && waterLevel < 40 && (
          <Alert className="border-yellow-600 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Water level is low. Consider refilling soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Visual Tank Representation */}
        <div className="flex items-end justify-center gap-4">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-64 bg-slate-100 rounded-lg border-2 border-slate-300 overflow-hidden">
              {/* Water fill */}
              <div
                className={`absolute bottom-0 w-full transition-all duration-1000 ${
                  waterLevel >= 70
                    ? "bg-gradient-to-t from-green-500 to-green-400"
                    : waterLevel >= 40
                    ? "bg-gradient-to-t from-yellow-500 to-yellow-400"
                    : waterLevel >= 20
                    ? "bg-gradient-to-t from-orange-500 to-orange-400"
                    : "bg-gradient-to-t from-red-500 to-red-400"
                }`}
                style={{ height: `${waterLevel}%` }}
              >
                {/* Water wave effect */}
                <div className="absolute top-0 left-0 w-full h-2 bg-white opacity-20 animate-pulse" />
              </div>

              {/* Level markers */}
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between py-2 px-1 pointer-events-none">
                {[100, 75, 50, 25, 0].map((mark) => (
                  <div key={mark} className="flex items-center justify-between">
                    <div className="w-2 h-px bg-slate-400" />
                    <span className="text-xs text-slate-600">{mark}%</span>
                    <div className="w-2 h-px bg-slate-400" />
                  </div>
                ))}
              </div>

              {/* Pump indicator */}
              {isPumpActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-2">Tank View</p>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Current Level</p>
              <p className={`text-2xl ${getStatusColor(waterLevel)}`}>
                {waterLevel.toFixed(1)}%
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Volume</p>
              <p className="text-lg">
                {currentVolume.toFixed(0)} / {tankCapacity} L
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Est. Days Remaining</p>
              <p className="text-lg">
                {daysRemaining > 0 ? `~${daysRemaining.toFixed(1)} days` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Water Level</span>
            <span className={getStatusColor(waterLevel)}>
              {waterLevel.toFixed(1)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={waterLevel} className="h-3" />
            <div
              className={`absolute inset-0 h-3 rounded-full ${getProgressColor(
                waterLevel
              )} transition-all`}
              style={{ width: `${waterLevel}%` }}
            />
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            <TrendingDown className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-slate-500">Daily Usage</p>
              <p className="text-sm">{dailyUsage.toFixed(1)} L</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <div>
              <p className="text-xs text-slate-500">Flow Rate</p>
              <p className="text-sm">
                {isPumpActive ? `${flowRate.toFixed(1)} L/min` : "0 L/min"}
              </p>
            </div>
          </div>
        </div>

        {/* Tank Information */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tank Capacity:</span>
            <span>{tankCapacity} Liters</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Pump Status:</span>
            <span className={isPumpActive ? "text-green-600" : "text-slate-400"}>
              {isPumpActive ? "Active" : "Idle"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Refill Recommended:</span>
            <span className={waterLevel < 40 ? "text-orange-600" : "text-slate-600"}>
              {waterLevel < 40 ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
