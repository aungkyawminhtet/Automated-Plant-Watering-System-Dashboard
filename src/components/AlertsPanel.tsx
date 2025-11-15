import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert } from "./Dashboard";
import { AlertTriangle, Info, XCircle, Check, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface AlertsPanelProps {
  alerts: Alert[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export function AlertsPanel({ alerts, onMarkRead, onClearAll }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Alerts & Notifications</CardTitle>
          <Button variant="outline" size="sm" onClick={onClearAll} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Info className="w-12 h-12 mb-4" />
              <p>No alerts to display</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertBgColor(
                    alert.type
                  )} ${alert.read ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-900">{alert.message}</p>
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkRead(alert.id)}
                            className="flex-shrink-0 h-6 px-2 gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-slate-500">
                          {alert.timestamp.toLocaleString()}
                        </p>
                        <Badge
                          variant={alert.type === "error" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {alert.type}
                        </Badge>
                        {alert.read && (
                          <Badge variant="outline" className="text-xs">
                            Read
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
