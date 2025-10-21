import {
  Plus,
  TrendingUp,
  ArrowUpRight,
  Cloud,
  Sun,
  Droplets,
  Wind,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export function Dashboard() {
  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Gestiona tu operación agrícola de manera eficiente.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-green-gradient hover:opacity-90 transition-opacity font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Orden
            </Button>
            <Button variant="outline" className="font-medium bg-transparent">
              Importar Datos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-green-gradient text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Órdenes Activas
                  </p>
                  <p className="text-4xl font-bold mt-2 tracking-tight">18</p>
                  <div className="flex items-center mt-3 text-green-100">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+3 esta semana</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-white to-gray-50 shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Campos en Trabajo
                  </p>
                  <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                    7
                  </p>
                  <div className="flex items-center mt-3 text-gray-500">
                    <span className="text-sm font-medium">450 hectáreas</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-gradient-subtle rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-white to-gray-50 shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Maquinarias Activas
                  </p>
                  <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                    12
                  </p>
                  <div className="flex items-center mt-3 text-gray-500">
                    <span className="text-sm font-medium">
                      de 15 disponibles
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-gradient-subtle rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-white to-orange-50 shadow-sm border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Alertas Pendientes
                  </p>
                  <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                    3
                  </p>
                  <p className="text-sm text-orange-600 mt-3 font-medium">
                    Requieren atención
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Widget */}
          <Card className="bg-linear-to-br from-white to-blue-50 shadow-sm border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-500" />
                Clima Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold tracking-tight">24°C</p>
                      <p className="text-sm text-gray-500 font-medium">
                        Soleado
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold">Humedad</p>
                      <p className="text-sm text-gray-500 font-medium">65%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-semibold">Viento</p>
                      <p className="text-sm text-gray-500 font-medium">
                        12 km/h
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 font-medium">
                    Pronóstico: Sin lluvia por 5 días
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card className="bg-gradient-to-br from-white to-green-50 shadow-sm border-green-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" />
                Tareas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-green-gradient-subtle rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Siembra Lote 15</p>
                    <p className="text-xs text-gray-500 font-medium">
                      08:00 - Campo Norte
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Mantenimiento Tractor
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      14:00 - Taller
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Inspección Cultivos</p>
                    <p className="text-xs text-gray-500 font-medium">
                      16:00 - Lote 8
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-transparent font-medium"
                >
                  Ver todas las tareas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Market Prices & Financial Info */}
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Precios del Mercado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-gradient-subtle rounded-lg border border-green-200">
                  <div>
                    <p className="text-sm font-semibold">Dólar Blue</p>
                    <p className="text-xs text-gray-500 font-medium">
                      Actualizado hace 1h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 tracking-tight">
                      $1,245
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      +2.1%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Soja (tn)
                    </span>
                    <span className="text-sm font-semibold">$485,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Maíz (tn)
                    </span>
                    <span className="text-sm font-semibold">$245,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Trigo (tn)
                    </span>
                    <span className="text-sm font-semibold">$320,000</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent font-medium"
                >
                  Ver más precios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
