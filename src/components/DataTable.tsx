import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { SensorReading } from "./Dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Download, FileSpreadsheet } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface DataTableProps {
  data: SensorReading[];
}

export function DataTable({ data }: DataTableProps) {
  const handleExportCSV = () => {
    const headers = [
      "Timestamp",
      "Soil Moisture (%)",
      "Temperature (°C)",
      "Humidity (%)",
      "Rainfall (mm)",
      "Water Level (%)",
      "Battery (%)",
      "Solar Charging",
    ];

    const csvData = data.map((reading) => [
      reading.timestamp.toLocaleString(),
      reading.soilMoisture.toFixed(1),
      reading.temperature.toFixed(1),
      reading.humidity.toFixed(1),
      reading.rainfall.toFixed(1),
      reading.waterLevel.toFixed(1),
      reading.batteryLevel.toFixed(1),
      reading.solarCharging ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `irrigation_data_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <CardTitle>Sensor Data Logs</CardTitle>
          </div>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export to CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Soil Moisture</TableHead>
                <TableHead className="text-right">Temperature</TableHead>
                <TableHead className="text-right">Humidity</TableHead>
                <TableHead className="text-right">Rainfall</TableHead>
                <TableHead className="text-right">Water Level</TableHead>
                <TableHead className="text-right">Battery</TableHead>
                <TableHead className="text-center">Solar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .slice()
                .reverse()
                .map((reading, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {reading.timestamp.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          reading.soilMoisture > 50
                            ? "text-green-600"
                            : reading.soilMoisture > 30
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {reading.soilMoisture.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {reading.temperature.toFixed(1)}°C
                    </TableCell>
                    <TableCell className="text-right">
                      {reading.humidity.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {reading.rainfall.toFixed(1)} mm
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          reading.waterLevel > 50
                            ? "text-green-600"
                            : reading.waterLevel > 30
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {reading.waterLevel.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          reading.batteryLevel > 50
                            ? "text-green-600"
                            : reading.batteryLevel > 25
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {reading.batteryLevel.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {reading.solarCharging ? (
                        <span className="text-yellow-600">⚡</span>
                      ) : (
                        <span className="text-slate-300">○</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
