import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Droplets } from "lucide-react";

interface WaterUsageData {
  timestamp: Date;
  waterLevel: number;
  usage: number;
}

interface WaterUsageChartProps {
  data: WaterUsageData[];
}

export function WaterUsageChart({ data }: WaterUsageChartProps) {
  const chartData = data.slice(-24).map((reading) => ({
    time: reading.timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    level: reading.waterLevel,
    usage: reading.usage,
  }));

  // Calculate daily totals for the last 7 days
  const dailyData: { [key: string]: number } = {};
  data.forEach((reading) => {
    const day = reading.timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dailyData[day]) {
      dailyData[day] = 0;
    }
    dailyData[day] += reading.usage;
  });

  const dailyChartData = Object.entries(dailyData)
    .slice(-7)
    .map(([day, usage]) => ({
      day,
      usage: Number(usage.toFixed(1)),
    }));

  return (
    <div className="space-y-6">
      {/* Water Level Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Level Trend (24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                domain={[0, 100]}
                label={{ value: "Water Level (%)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Water Level (%)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Water Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-600" />
            Daily Water Usage (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                label={{ value: "Usage (Liters)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="usage" fill="#06b6d4" name="Water Used (L)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 mb-1">Total (7 days)</p>
              <p className="text-lg text-blue-900">
                {dailyChartData.reduce((sum, d) => sum + d.usage, 0).toFixed(1)} L
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-3 text-center">
              <p className="text-xs text-cyan-600 mb-1">Daily Average</p>
              <p className="text-lg text-cyan-900">
                {(dailyChartData.reduce((sum, d) => sum + d.usage, 0) / dailyChartData.length).toFixed(1)} L
              </p>
            </div>
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <p className="text-xs text-teal-600 mb-1">Peak Day</p>
              <p className="text-lg text-teal-900">
                {Math.max(...dailyChartData.map((d) => d.usage)).toFixed(1)} L
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
