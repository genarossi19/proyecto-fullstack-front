import {
  Bell,
  LogOut,
  User,
  Clock,
  X,
  FileText,
  TrendingUp,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { getNotifications } from "../api/services/NotificationService";
import type { Notification } from "../types/Notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    };

    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    if (isNotificationsOpen) {
      // Si está abierto, cerramos
      setIsNotificationsOpen(false);
      // Limpiar notificaciones visibles
      setVisibleNotifications([]);
    } else {
      // Si está cerrado, abrimos y cargamos
      setIsNotificationsOpen(true);
      setLoadingNotifications(true);
      try {
        const data = await getNotifications();
        setVisibleNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Las notificaciones solo se ven, no navegan
    console.log("Notification clicked:", notification.title);
  };

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Hace unos segundos";
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)}d`;
    return new Date(date).toLocaleDateString("es-AR");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FileText className="w-4 h-4" />;
      case "market":
        return <TrendingUp className="w-4 h-4" />;
      case "news":
        return <Newspaper className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const initials = user
    ? `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">
              {currentTime}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Bell Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBellClick}
              className="relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notificaciones
                  </h3>
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      setVisibleNotifications([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loadingNotifications ? (
                  // Skeleton loading state
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-72" />
                        <Skeleton className="h-2 w-20" />
                      </div>
                    ))}
                  </div>
                ) : visibleNotifications.length > 0 ? (
                  // Notifications list
                  <div className="p-2">
                    {visibleNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-gray-600 shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                  {notification.action.label}
                                </span>
                              )}
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Empty state
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No tienes notificaciones
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user ? `${user.name} ${user.lastname}` : "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {user?.email || "sin email"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-700">
                    {initials}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold text-gray-900">
                  {user ? `${user.name} ${user.lastname}` : "Usuario"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer py-2 transition-all duration-200 
             text-red-600 hover:bg-red-100 focus:bg-red-100"
              >
                <LogOut className="w-4 h-4 mr-2 text-red-600 group-hover:text-red-900" />

                <span className="transition text-red-600 group-hover:text-red-900">
                  Cerrar Sesión
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
