import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { DollarSign, Building2, CreditCard, TrendingUp } from "lucide-react";
import type { DolarQuote } from "../api/services/DolarService";

interface DolarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dolarQuotes: DolarQuote[];
}

export function DolarDetailsModal({
  isOpen,
  onClose,
  dolarQuotes,
}: DolarDetailsModalProps) {
  const getQuoteColor = (casa: string) => {
    switch (casa.toLowerCase()) {
      case "blue":
        return "bg-blue-gradient-subtle border-blue-200";
      case "oficial":
        return "bg-green-gradient-subtle border-green-200";
      case "tarjeta":
        return "bg-purple-50 border-purple-200";
      case "bolsa":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getQuoteIcon = (casa: string) => {
    switch (casa.toLowerCase()) {
      case "blue":
        return <DollarSign className="w-4 h-4" />;
      case "oficial":
        return <Building2 className="w-4 h-4" />;
      case "tarjeta":
        return <CreditCard className="w-4 h-4" />;
      case "bolsa":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Cotización del Dólar - Detalle Completo
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 mt-6 pr-4">
          {dolarQuotes.map((quote) => (
            <div
              key={`${quote.casa}`}
              className={`flex items-center justify-between p-4 rounded-lg border ${getQuoteColor(
                quote.casa
              )}`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">{getQuoteIcon(quote.casa)}</div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {quote.nombre}
                  </p>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Actualizado:{" "}
                    {new Date(quote.fechaActualizacion).toLocaleString(
                      "es-AR",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Compra</p>
                    <p className="font-bold text-lg text-green-600 tracking-tight">
                      ${quote.compra}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Venta</p>
                    <p className="font-bold text-lg text-orange-600 tracking-tight">
                      ${quote.venta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AlertDialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
