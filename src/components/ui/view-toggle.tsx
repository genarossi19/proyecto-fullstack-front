import { LayoutGrid, Table } from "lucide-react";
import { Button } from "./button";

interface ViewToggleProps {
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("table")}
        className={`px-3 py-1.5 rounded-md transition-all ${
          viewMode === "table"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-600 hover:text-gray-900 hover:bg-transparent"
        }`}
      >
        <Table className="w-4 h-4 mr-1.5" />
        Tabla
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("cards")}
        className={`px-3 py-1.5 rounded-md transition-all ${
          viewMode === "cards"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-600 hover:text-gray-900 hover:bg-transparent"
        }`}
      >
        <LayoutGrid className="w-4 h-4 mr-1.5" />
        Tarjetas
      </Button>
    </div>
  );
}
