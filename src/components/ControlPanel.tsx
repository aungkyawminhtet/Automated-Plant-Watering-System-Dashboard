import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Power, Zap } from "lucide-react";

interface ControlPanelProps {
  pumpStatus: boolean;
  autoMode: boolean;
  moistureThreshold: number;
  onPumpToggle: (status: boolean) => void;
  onAutoModeToggle: (enabled: boolean) => void;
  onThresholdChange: (value: number) => void;
}

export function ControlPanel({
  pumpStatus,
  autoMode,
  moistureThreshold,
  onPumpToggle,
  onAutoModeToggle,
  onThresholdChange,
}: ControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-600" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Mode Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-mode">Automatic Mode</Label>
            <Switch
              id="auto-mode"
              checked={autoMode}
              onCheckedChange={onAutoModeToggle}
            />
          </div>
          <p className="text-xs text-slate-500">
            System will automatically control the pump based on soil moisture threshold
          </p>
        </div>

        {/* Moisture Threshold */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Moisture Threshold</Label>
            <span className="text-sm text-slate-600">{moistureThreshold}%</span>
          </div>
          <Slider
            value={[moistureThreshold]}
            onValueChange={(value) => onThresholdChange(value[0])}
            min={10}
            max={70}
            step={5}
            disabled={!autoMode}
          />
          <p className="text-xs text-slate-500">
            Pump activates when soil moisture drops below this level
          </p>
        </div>

        {/* Manual Pump Control */}
        <div className="space-y-3 pt-4 border-t">
          <Label>Manual Pump Control</Label>
          <div className="flex gap-2">
            <Button
              onClick={() => onPumpToggle(true)}
              disabled={autoMode || pumpStatus}
              className="flex-1 gap-2"
              variant={pumpStatus ? "default" : "outline"}
            >
              <Power className="w-4 h-4" />
              Turn On
            </Button>
            <Button
              onClick={() => onPumpToggle(false)}
              disabled={autoMode || !pumpStatus}
              className="flex-1 gap-2"
              variant={!pumpStatus ? "default" : "outline"}
            >
              <Power className="w-4 h-4" />
              Turn Off
            </Button>
          </div>
          {autoMode && (
            <p className="text-xs text-yellow-600">
              Disable auto mode to use manual controls
            </p>
          )}
        </div>

        {/* Current Status */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Pump Status:</span>
            <span className={pumpStatus ? "text-green-600" : "text-slate-400"}>
              {pumpStatus ? "Running" : "Stopped"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Control Mode:</span>
            <span className="text-slate-900">
              {autoMode ? "Automatic" : "Manual"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
