import {
  LayoutDashboard,
  ClipboardList,
  Tractor,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Wheat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      id: "work-orders",
      label: "Órdenes de Trabajo",
      icon: ClipboardList,
      path: "/work-orders",
    },

    {
      id: "machinery",
      label: "Maquinarias",
      icon: Tractor,
      path: "/machinery",
    },

    { id: "clients", label: "Clientes", icon: Users, path: "/clients" },
  ];

  const generalItems = [
    { id: "logout", label: "Cerrar Sesión", icon: LogOut, path: "#" },
  ];

  const handleLogout = () => {
    // Abrir diálogo de confirmación
    setOpenLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setIsLoggingOut(false);
      setOpenLogoutDialog(false);
    }
  };

  const isActivePath = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-linear-to-b from-gray-50 to-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div className={`${isCollapsed ? "p-4" : "p-6"} relative`}>
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-gradient rounded-lg flex items-center justify-center shadow-sm">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              EPYGEA
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4">
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3 font-poppins">
              MENÚ
            </p>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                  } py-2 text-left transition-all duration-200 relative rounded-lg ${
                    isActive
                      ? "text-gray-900 bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-gradient rounded-r-lg"></div>
                  )}
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3 font-poppins">
              GENERAL
            </p>
          )}
          <nav className="space-y-1">
            {generalItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id !== "logout" && isActivePath(item.path);

              if (item.id === "logout") {
                return (
                  <div key={item.id}>
                    <AlertDialog
                      open={openLogoutDialog}
                      onOpenChange={setOpenLogoutDialog}
                    >
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center ${
                            isCollapsed
                              ? "justify-center px-2"
                              : "space-x-3 px-3"
                          } py-2 text-left transition-all duration-200 relative rounded-lg 
     text-red-600 hover:text-red-900 hover:bg-red-100`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className="w-5 h-5" />
                          {!isCollapsed && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Seguro que desea cerrar sesión?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Se cerrará tu sesión actual y tendrás que iniciar
                            sesión de nuevo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={confirmLogout}>
                            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                  } py-2 text-left transition-all duration-200 relative rounded-lg ${
                    isActive
                      ? "text-gray-900 bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-gradient rounded-r-lg"></div>
                  )}
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
