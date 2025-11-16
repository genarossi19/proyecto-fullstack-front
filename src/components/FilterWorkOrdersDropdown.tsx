import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface FilterWorkOrdersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export interface FilterState {
  status: string[];
  createdAtFrom: string;
  createdAtTo: string;
  initDateFrom: string;
  initDateTo: string;
}

const STATUS_OPTIONS = ["Pendiente", "En Progreso", "Completado"];

export function FilterWorkOrdersDropdown({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  anchorRef,
}: FilterWorkOrdersDropdownProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      status: checked
        ? [...prev.status, status]
        : prev.status.filter((s) => s !== status),
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      createdAtFrom: "",
      createdAtTo: "",
      initDateFrom: "",
      initDateTo: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-40 w-80 max-h-[600px] overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-5">
        {/* Estado */}
        <div>
          <Label className="text-xs font-semibold text-gray-900 mb-2 block">
            Estado
          </Label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={(checked) =>
                    handleStatusChange(status, checked as boolean)
                  }
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Fecha Emision */}
        <div>
          <Label className="text-xs font-semibold text-gray-900 mb-2 block">
            Fecha Emisión
          </Label>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Desde</label>
              <Input
                type="date"
                value={filters.createdAtFrom}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    createdAtFrom: e.target.value,
                  }))
                }
                className="text-xs h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Hasta</label>
              <Input
                type="date"
                value={filters.createdAtTo}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    createdAtTo: e.target.value,
                  }))
                }
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>

        {/* Fecha Inicio */}
        <div>
          <Label className="text-xs font-semibold text-gray-900 mb-2 block">
            Fecha Inicio
          </Label>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Desde</label>
              <Input
                type="date"
                value={filters.initDateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    initDateFrom: e.target.value,
                  }))
                }
                className="text-xs h-8"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Hasta</label>
              <Input
                type="date"
                value={filters.initDateTo}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    initDateTo: e.target.value,
                  }))
                }
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="flex-1 text-xs h-8"
        >
          Limpiar
        </Button>
        <Button
          onClick={handleApplyFilters}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-8"
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}
