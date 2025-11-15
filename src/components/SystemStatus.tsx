import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Power, Zap, Sun, Battery } from "lucide-react";

interface SystemStatusProps {
  pumpStatus: boolean;
  autoMode: boolean;
  batteryLevel: number;
  solarCharging: boolean;
}

export function SystemStatus({
  pumpStatus,
  autoMode,
  batteryLevel,
  solarCharging,
}: SystemStatusProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                pumpStatus ? "bg-green-500 animate-pulse" : "bg-slate-300"
              }`}
            />
            <span className="text-sm">
              Pump: <span>{pumpStatus ? "Active" : "Idle"}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Power className="w-4 h-4 text-slate-600" />
            <span className="text-sm">
              Mode:{" "}
              <Badge variant={autoMode ? "default" : "secondary"} className="ml-1">
                {autoMode ? "Auto" : "Manual"}
              </Badge>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-slate-600" />
            <span className="text-sm">
              Battery:{" "}
              <span
                className={
                  batteryLevel > 50
                    ? "text-green-600"
                    : batteryLevel > 25
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {batteryLevel.toFixed(0)}%
              </span>
            </span>
          </div>

          {solarCharging && (
            <div className="flex items-center gap-2 text-yellow-600">
              <Sun className="w-4 h-4" />
              <span className="text-sm">Charging</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Zap className="w-3 h-3" />
          <span>System Online</span>
        </div>
      </div>
    </Card>
  );
}
