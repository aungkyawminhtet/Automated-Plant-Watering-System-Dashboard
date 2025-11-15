import { useState, useEffect } from "react";
import { SensorDataCards } from "./SensorDataCards";
import { ControlPanel } from "./ControlPanel";
import { DataCharts } from "./DataCharts";
import { AlertsPanel } from "./AlertsPanel";
import { SystemStatus } from "./SystemStatus";
import { DataTable } from "./DataTable";
import { WeatherWidget } from "./WeatherWidget";
import { WaterTankMonitor } from "./WaterTankMonitor";
import { WaterUsageChart } from "./WaterUsageChart";
import { Header } from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Droplet, LineChart, Bell, Database, CloudSun, Waves } from "lucide-react";

export interface SensorReading {
  timestamp: Date;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  batteryLevel: number;
  solarCharging: boolean;
  waterLevel: number;
  waterUsage: number;
}

export interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: Date;
  read: boolean;
}

export function Dashboard() {
  const [currentData, setCurrentData] = useState<SensorReading>({
    timestamp: new Date(),
    soilMoisture: 45,
    temperature: 26,
    humidity: 68,
    rainfall: 0,
    batteryLevel: 85,
    solarCharging: true,
    waterLevel: 65,
    waterUsage: 0,
  });

  // Water tank configuration
  const tankCapacity = 1000; // liters
  const flowRate = 5; // liters per minute

  const [pumpStatus, setPumpStatus] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [moistureThreshold, setMoistureThreshold] = useState(30);
  const [historicalData, setHistoricalData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "info",
      message: "System started successfully",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "2",
      type: "warning",
      message: "Soil moisture approaching threshold (32%)",
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    // Generate initial historical data
    const initialData: SensorReading[] = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--) {
      initialData.push({
        timestamp: new Date(now - i * 3600000),
        soilMoisture: Math.random() * 40 + 30,
        temperature: Math.random() * 8 + 22,
        humidity: Math.random() * 20 + 60,
        rainfall: Math.random() > 0.8 ? Math.random() * 10 : 0,
        batteryLevel: Math.random() * 20 + 75,
        solarCharging: Math.random() > 0.3,
        waterLevel: Math.random() * 30 + 50,
        waterUsage: Math.random() * 20 + 10,
      });
    }
    setHistoricalData(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentData((prev) => {
        const newMoisture = Math.max(
          10,
          Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 5)
        );
        const newTemp = Math.max(
          15,
          Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)
        );
        const newHumidity = Math.max(
          30,
          Math.min(100, prev.humidity + (Math.random() - 0.5) * 3)
        );
        const newRainfall = Math.random() > 0.95 ? Math.random() * 5 : 0;
        const newBattery = Math.max(
          20,
          Math.min(100, prev.batteryLevel + (Math.random() - 0.4) * 2)
        );

        // Calculate water level change based on pump status
        const waterConsumption = pumpStatus ? flowRate * 0.05 : 0; // 0.05 represents time interval
        const waterLevelChange = -(waterConsumption / tankCapacity) * 100;
        const newWaterLevel = Math.max(
          0,
          Math.min(100, prev.waterLevel + waterLevelChange + (Math.random() - 0.5) * 0.5)
        );

        const newReading = {
          timestamp: new Date(),
          soilMoisture: newMoisture,
          temperature: newTemp,
          humidity: newHumidity,
          rainfall: newRainfall,
          batteryLevel: newBattery,
          solarCharging: newBattery < 95 && Math.random() > 0.2,
          waterLevel: newWaterLevel,
          waterUsage: waterConsumption * 60, // Convert to liters per hour
        };

        // Add to historical data
        setHistoricalData((prevHistory) => [...prevHistory.slice(-47), newReading]);

        // Check thresholds and generate alerts
        if (autoMode && newMoisture < moistureThreshold && !pumpStatus) {
          setPumpStatus(true);
          setAlerts((prevAlerts) => [
            {
              id: Date.now().toString(),
              type: "info",
              message: `Pump activated automatically - Soil moisture at ${newMoisture.toFixed(1)}%`,
              timestamp: new Date(),
              read: false,
            },
            ...prevAlerts,
          ]);
        } else if (autoMode && newMoisture > moistureThreshold + 10 && pumpStatus) {
          setPumpStatus(false);
          setAlerts((prevAlerts) => [
            {
              id: Date.now().toString(),
              type: "info",
              message: `Pump deactivated - Soil moisture at ${newMoisture.toFixed(1)}%`,
              timestamp: new Date(),
              read: false,
            },
            ...prevAlerts,
          ]);
        }

        if (newMoisture < moistureThreshold + 5 && newMoisture > moistureThreshold) {
          if (!alerts.some((a) => a.message.includes("approaching threshold") && !a.read)) {
            setAlerts((prevAlerts) => [
              {
                id: Date.now().toString(),
                type: "warning",
                message: `Soil moisture approaching threshold (${newMoisture.toFixed(1)}%)`,
                timestamp: new Date(),
                read: false,
              },
              ...prevAlerts,
            ]);
          }
        }

        if (newBattery < 25) {
          if (!alerts.some((a) => a.message.includes("Low battery") && !a.read)) {
            setAlerts((prevAlerts) => [
              {
                id: Date.now().toString(),
                type: "error",
                message: `Low battery level: ${newBattery.toFixed(1)}%`,
                timestamp: new Date(),
                read: false,
              },
              ...prevAlerts,
            ]);
          }
        }

        // Water level alerts
        if (newWaterLevel < 20) {
          if (!alerts.some((a) => a.message.includes("Water level critically low") && !a.read)) {
            setAlerts((prevAlerts) => [
              {
                id: Date.now().toString(),
                type: "error",
                message: `Water level critically low: ${newWaterLevel.toFixed(1)}%`,
                timestamp: new Date(),
                read: false,
              },
              ...prevAlerts,
            ]);
          }
        } else if (newWaterLevel < 40) {
          if (!alerts.some((a) => a.message.includes("Water level is low") && !a.read)) {
            setAlerts((prevAlerts) => [
              {
                id: Date.now().toString(),
                type: "warning",
                message: `Water level is low: ${newWaterLevel.toFixed(1)}%`,
                timestamp: new Date(),
                read: false,
              },
              ...prevAlerts,
            ]);
          }
        }

        return newReading;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [autoMode, moistureThreshold, pumpStatus, alerts]);

  const handlePumpToggle = (status: boolean) => {
    setPumpStatus(status);
    setAlerts((prev) => [
      {
        id: Date.now().toString(),
        type: "info",
        message: `Pump ${status ? "activated" : "deactivated"} manually`,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleAutoModeToggle = (enabled: boolean) => {
    setAutoMode(enabled);
    setAlerts((prev) => [
      {
        id: Date.now().toString(),
        type: "info",
        message: `Auto mode ${enabled ? "enabled" : "disabled"}`,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleThresholdChange = (value: number) => {
    setMoistureThreshold(value);
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const handleClearAlerts = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header unreadAlerts={unreadCount} />

      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* System Status Banner */}
        <SystemStatus
          pumpStatus={pumpStatus}
          autoMode={autoMode}
          batteryLevel={currentData.batteryLevel}
          solarCharging={currentData.solarCharging}
        />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <Droplet className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-2">
              <Waves className="w-4 h-4" />
              Water Tank
            </TabsTrigger>
            <TabsTrigger value="weather" className="gap-2">
              <CloudSun className="w-4 h-4" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <LineChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              Alerts
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="w-4 h-4" />
              Data Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <SensorDataCards currentData={currentData} />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DataCharts data={historicalData} />
              </div>
              <div>
                <ControlPanel
                  pumpStatus={pumpStatus}
                  autoMode={autoMode}
                  moistureThreshold={moistureThreshold}
                  onPumpToggle={handlePumpToggle}
                  onAutoModeToggle={handleAutoModeToggle}
                  onThresholdChange={handleThresholdChange}
                />
              </div>
            </div>
          </TabsContent>

          {/* Water Tank Tab */}
          <TabsContent value="water" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <WaterTankMonitor
                waterLevel={currentData.waterLevel}
                tankCapacity={tankCapacity}
                dailyUsage={
                  historicalData
                    .slice(-24)
                    .reduce((sum, reading) => sum + reading.waterUsage, 0)
                }
                flowRate={flowRate}
                isPumpActive={pumpStatus}
              />
              <div>
                <WaterUsageChart
                  data={historicalData.map((reading) => ({
                    timestamp: reading.timestamp,
                    waterLevel: reading.waterLevel,
                    usage: reading.waterUsage,
                  }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-6">
            <WeatherWidget currentMoisture={currentData.soilMoisture} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="p-6">
              <DataCharts data={historicalData} detailed />
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel
              alerts={alerts}
              onMarkRead={handleMarkAlertRead}
              onClearAll={handleClearAlerts}
            />
          </TabsContent>

          {/* Data Logs Tab */}
          <TabsContent value="data" className="mt-6">
            <DataTable data={historicalData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
