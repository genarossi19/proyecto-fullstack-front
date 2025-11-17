import {
  Plus,
  TrendingUp,
  ArrowUpRight,
  Cloud,
  Droplets,
  Wind,
  DollarSign,
  Calendar,
  CloudRain,
  Building2,
  CreditCard,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAllWorkOrders } from "../api/services/WorkOrderService";
import { getDolarQuotes } from "../api/services/DolarService";
import { getWeatherData } from "../api/services/WeatherService";
import { DolarDetailsModal } from "../components/DolarDetailsModal";
import { WeatherDetailsModal } from "../components/WeatherDetailsModal";
import { getAllMachineries } from "../api/services/MachineryService";
import { getAllFields } from "../api/services/FieldService";
import { getAllClients } from "../api/services/ClientService";
import type { WorkOrderSummaryResponse } from "../types/WorkOrder";
import type { DolarQuote } from "../api/services/DolarService";
import type { WeatherResponse } from "../api/services/WeatherService";
import { toast } from "sonner";

export function Dashboard() {
  const navigate = useNavigate();
  const [pendingTasks, setPendingTasks] = useState<WorkOrderSummaryResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [dolarQuotes, setDolarQuotes] = useState<DolarQuote[]>([]);
  const [loadingDolar, setLoadingDolar] = useState(true);
  const [isDolarModalOpen, setIsDolarModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  // Stats states
  const [activeWorkOrders, setActiveWorkOrders] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [fieldsInWork, setFieldsInWork] = useState(0);
  const [totalHectares, setTotalHectares] = useState(0);
  const [activeMachineries, setActiveMachineries] = useState(0);
  const [totalMachineries, setTotalMachineries] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    const fetchPendingWorkOrders = async () => {
      try {
        setLoading(true);
        const allWorkOrders = await getAllWorkOrders();

        // Filtrar órdenes pendientes (no completadas) y que tengan fecha de inicio para hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pending = allWorkOrders.filter((wo) => {
          // Excluir completadas y canceladas
          if (
            wo.status?.toLowerCase() === "completado" ||
            wo.status?.toLowerCase() === "cancelado"
          ) {
            return false;
          }

          // Si tiene fecha de inicio, verificar que sea hoy o posterior
          if (wo.init_date) {
            const initDate = new Date(wo.init_date);
            initDate.setHours(0, 0, 0, 0);
            return initDate >= today;
          }

          return true; // Incluir si no tiene fecha
        });

        // Tomar máximo 3 tareas (las más antiguas primero)
        const topThree = pending
          .sort((a, b) => {
            if (!a.init_date && !b.init_date) return 0;
            if (!a.init_date) return 1;
            if (!b.init_date) return -1;
            return (
              new Date(a.init_date).getTime() - new Date(b.init_date).getTime()
            );
          })
          .slice(0, 3);

        setPendingTasks(topThree);
      } catch (error) {
        console.error("Error fetching work orders:", error);
        toast.error("Error al cargar las ordenes pendientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingWorkOrders();
  }, []);

  useEffect(() => {
    const fetchDolarQuotes = async () => {
      try {
        setLoadingDolar(true);
        const quotes = await getDolarQuotes();
        setDolarQuotes(quotes);
      } catch (error) {
        console.error("Error fetching dolar quotes:", error);
        toast.error("Error al cargar los valores del dólar");
      } finally {
        setLoadingDolar(false);
      }
    };

    fetchDolarQuotes();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoadingWeather(true);
        const weather = await getWeatherData();
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // No toast error - mostrar mensaje en la card
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [workOrders, machineries, fields, clients] = await Promise.all([
          getAllWorkOrders(),
          getAllMachineries(),
          getAllFields(),
          getAllClients(),
        ]);

        // Active work orders (no completadas, no canceladas)
        const active = workOrders.filter(
          (wo) =>
            wo.status?.toLowerCase() !== "completado" &&
            wo.status?.toLowerCase() !== "cancelado"
        ).length;
        setActiveWorkOrders(active);

        // Fields in work and hectares
        const activeFields = fields.filter((f: unknown) => {
          const field = f as { status?: string; hectares?: number };
          return field.status?.toLowerCase() === "activo" || !field.status;
        });
        setFieldsInWork(activeFields.length);
        const hectares = activeFields.reduce((sum: number, f: unknown) => {
          const field = f as { hectares?: number };
          return sum + (field.hectares || 0);
        }, 0);
        setTotalHectares(hectares);

        // Machineries
        const active_machineries = machineries.filter((m: unknown) => {
          const machinery = m as { status?: string };
          return (
            machinery.status?.toLowerCase() === "activo" || !machinery.status
          );
        }).length;
        setActiveMachineries(active_machineries);
        setTotalMachineries(machineries.length);

        // Total clients
        setTotalClients(clients.length);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Error al cargar las estadísticas");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status: string | null | undefined): string => {
    switch (status?.toLowerCase()) {
      case "en progreso":
        return "bg-blue-gradient-subtle border-blue-200";
      case "pendiente":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-green-gradient-subtle border-green-200";
    }
  };

  const getStatusDotColor = (status: string | null | undefined): string => {
    switch (status?.toLowerCase()) {
      case "en progreso":
        return "bg-blue-500";
      case "pendiente":
        return "bg-orange-500";
      default:
        return "bg-green-500";
    }
  };

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
            <Button
              className="bg-green-gradient hover:opacity-90 transition-opacity font-semibold"
              onClick={() => navigate("/work-orders/new")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Orden
            </Button>
            {/* Botón de importar datos comentado - no tiene uso aún */}
            {/* <Button variant="outline" className="font-medium bg-transparent">
              Importar Datos
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Órdenes Activas */}
          <Card className="bg-green-gradient text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Órdenes Activas
                  </p>
                  {loadingStats ? (
                    <>
                      <Skeleton className="h-10 w-20 mt-2 bg-green-500/30" />
                      <Skeleton className="h-4 w-32 mt-3 bg-green-500/30" />
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold mt-2 tracking-tight">
                        {activeWorkOrders}
                      </p>
                      <div className="flex items-center mt-3 text-green-100">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          de {activeWorkOrders > 0 ? activeWorkOrders : "0"}{" "}
                          total
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos en Trabajo */}
          <Card className="bg-linear-to-br from-white to-gray-50 shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Campos en Trabajo
                  </p>
                  {loadingStats ? (
                    <>
                      <Skeleton className="h-10 w-20 mt-2" />
                      <Skeleton className="h-4 w-32 mt-3" />
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                        {fieldsInWork}
                      </p>
                      <div className="flex items-center mt-3 text-gray-500">
                        <span className="text-sm font-medium">
                          {totalHectares.toFixed(1)} hectáreas
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 bg-green-gradient-subtle rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maquinarias Activas */}
          <Card className="bg-linear-to-br from-white to-gray-50 shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Maquinarias Activas
                  </p>
                  {loadingStats ? (
                    <>
                      <Skeleton className="h-10 w-20 mt-2" />
                      <Skeleton className="h-4 w-32 mt-3" />
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                        {activeMachineries}
                      </p>
                      <div className="flex items-center mt-3 text-gray-500">
                        <span className="text-sm font-medium">
                          de {totalMachineries} disponibles
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 bg-green-gradient-subtle rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clientes Registrados */}
          <Card className="bg-linear-to-br from-white to-blue-50 shadow-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Clientes Registrados
                  </p>
                  {loadingStats ? (
                    <>
                      <Skeleton className="h-10 w-20 mt-2" />
                      <Skeleton className="h-4 w-32 mt-3" />
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-bold mt-2 text-gray-900 tracking-tight">
                        {totalClients}
                      </p>
                      <p className="text-sm text-blue-600 mt-3 font-medium">
                        Clientes activos
                      </p>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Widget */}
          <Card
            className="bg-linear-to-br from-white to-blue-50 shadow-sm border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsWeatherModalOpen(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-500" />
                Clima Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingWeather ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-32" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : weatherData ? (
                <div className="space-y-4">
                  {/* Main Temp and Condition */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-900">
                        {weatherData.current.temp_c}°C
                      </p>
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        {weatherData.current.condition.text}
                      </p>
                    </div>
                    <img
                      src={`https:${weatherData.current.condition.icon}`}
                      alt={weatherData.current.condition.text}
                      className="w-16 h-16"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                      <p className="text-xs text-gray-500 font-medium flex items-center">
                        <Wind className="w-3 h-3 mr-1" />
                        Viento
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {weatherData.current.wind_kph} km/h
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                      <p className="text-xs text-gray-500 font-medium flex items-center">
                        <Droplets className="w-3 h-3 mr-1" />
                        Humedad
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {weatherData.current.humidity}%
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                      <p className="text-xs text-gray-500 font-medium flex items-center">
                        <Cloud className="w-3 h-3 mr-1" />
                        Nubosidad
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {weatherData.current.cloud}%
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                      <p className="text-xs text-gray-500 font-medium flex items-center">
                        <CloudRain className="w-3 h-3 mr-1" />
                        Lluvia
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {weatherData.current.precip_mm} mm
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center font-medium">
                    Click para ver detalles completos
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 font-medium">
                    No se pudieron cargar los datos del clima
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card className="bg-linear-to-br from-white to-green-50 shadow-sm border-green-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" />
                Ordenes de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                ) : pendingTasks.length > 0 ? (
                  // Render actual tasks
                  pendingTasks.map((task) => {
                    const statusColor = getStatusColor(task.status);
                    const dotColor = getStatusDotColor(task.status);
                    const initDate = task.init_date
                      ? new Date(task.init_date).toLocaleDateString("es-AR")
                      : "Sin fecha";

                    return (
                      <button
                        key={task.id}
                        onClick={() => navigate(`/work-orders/${task.id}`)}
                        className={`flex items-center space-x-3 p-2 rounded-lg border ${statusColor} hover:shadow-md transition-shadow cursor-pointer w-full text-left`}
                      >
                        <div
                          className={`w-2 h-2 ${dotColor} rounded-full shrink-0`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {task.name || `Orden #${task.id}`}
                          </p>
                          <p className="text-xs text-gray-500 font-medium truncate">
                            {initDate} -{" "}
                            {task.client?.name || "Cliente sin nombre"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  // No tasks message
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 font-medium">
                      No hay ordenes pendientes para hoy
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-transparent font-medium"
                  onClick={() => navigate("/work-orders")}
                >
                  Ver todas las ordenes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Market Prices & Financial Info */}
          <Card
            className="bg-linear-to-br from-white to-gray-50 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsDolarModalOpen(true)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Cotización del Dólar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingDolar ? (
                  // Skeleton loaders
                  <>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : dolarQuotes.length > 0 ? (
                  // Render actual dolar quotes
                  <>
                    {/* Blue en grande */}
                    {dolarQuotes.find(
                      (q) => q.casa.toLowerCase() === "blue"
                    ) && (
                      <div className="flex items-center justify-between p-4 bg-blue-gradient-subtle rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {
                                dolarQuotes.find(
                                  (q) => q.casa.toLowerCase() === "blue"
                                )?.nombre
                              }
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                              {new Date(
                                dolarQuotes.find(
                                  (q) => q.casa.toLowerCase() === "blue"
                                )?.fechaActualizacion || ""
                              ).toLocaleString("es-AR", {
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Compra
                              </p>
                              <p className="font-bold text-lg text-green-600 tracking-tight">
                                $
                                {
                                  dolarQuotes.find(
                                    (q) => q.casa.toLowerCase() === "blue"
                                  )?.compra
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Venta
                              </p>
                              <p className="font-bold text-lg text-orange-600 tracking-tight">
                                $
                                {
                                  dolarQuotes.find(
                                    (q) => q.casa.toLowerCase() === "blue"
                                  )?.venta
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Otros 3 en chico */}
                    <div className="space-y-2">
                      {dolarQuotes
                        .filter((q) => q.casa.toLowerCase() !== "blue")
                        .slice(0, 3)
                        .map((quote) => {
                          const getQuoteIcon = (casa: string) => {
                            switch (casa.toLowerCase()) {
                              case "oficial":
                                return <Building2 className="w-3 h-3" />;
                              case "tarjeta":
                                return <CreditCard className="w-3 h-3" />;
                              case "bolsa":
                                return <TrendingUp className="w-3 h-3" />;
                              default:
                                return <DollarSign className="w-3 h-3" />;
                            }
                          };

                          return (
                            <div
                              key={quote.casa}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition"
                            >
                              <span className="flex items-center space-x-2 text-xs font-medium text-gray-900">
                                <span className="text-gray-600">
                                  {getQuoteIcon(quote.casa)}
                                </span>
                                <span>{quote.nombre}</span>
                              </span>
                              <span className="text-xs font-semibold text-gray-900">
                                ${quote.compra} / ${quote.venta}
                              </span>
                            </div>
                          );
                        })}
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-3 font-medium">
                      Click para ver detalles completos
                    </p>
                  </>
                ) : (
                  // No data message
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 font-medium">
                      No se pudo cargar la cotización del dólar
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dolar Details Modal */}
          <DolarDetailsModal
            isOpen={isDolarModalOpen}
            onClose={() => setIsDolarModalOpen(false)}
            dolarQuotes={dolarQuotes}
          />

          {/* Weather Details Modal */}
          <WeatherDetailsModal
            isOpen={isWeatherModalOpen}
            onClose={() => setIsWeatherModalOpen(false)}
            weatherData={weatherData}
          />
        </div>
      </div>
    </div>
  );
}
