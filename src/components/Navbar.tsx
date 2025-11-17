import { Bell, Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
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
        <div className="flex items-center space-x-4"></div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>

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
