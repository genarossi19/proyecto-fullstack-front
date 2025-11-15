import React from "react";
import { Card, CardContent } from "./ui/card";

interface Props {
  objeto: any[];
  titulo: string;
  color: string;
  icono: React.ReactNode;
}

const CardStats = ({ objeto, titulo, color = "blue", icono }: Props) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{titulo}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>
              {objeto.filter((o) => o.estado === "en-progreso").length}
            </p>
          </div>
          <div className={`text-${color}-600`}>{icono}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardStats;
