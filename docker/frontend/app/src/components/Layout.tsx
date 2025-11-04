import React, { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Edit3,
} from "lucide-react";
import { cn } from "../shared/cn";
import { useAuth } from "../hooks/useAuth";
import ProfileEditModal from "./ProfileEditModal";

interface LayoutProps {
  children: ReactNode;
}

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2 my-1 mx-2 rounded-md",
        isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-56 border-r border-gray-200 bg-white flex flex-col"
        aria-label="Primary navigation"
      >
        {/* Logo and Title */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <GraduationCap size={24} />
            <div>
              <h1 className="font-bold text-lg">TECPlanning</h1>
              <p className="text-xs text-gray-500">Planificación Académica</p>
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <NavItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem
            to="/malla-curricular"
            icon={<GraduationCap size={20} />}
            label="Malla Curricular"
          />
          <NavItem
            to="/horarios"
            icon={<Calendar size={20} />}
            label="Horarios"
          />
          <NavItem
            to="/catalogo"
            icon={<BookOpen size={20} />}
            label="Catálogo"
          />
        </nav>
        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-200 rounded-full p-2">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name || "Usuario"}</p>
              <p className="text-xs text-gray-500">{user?.carne || "Carné"}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.program?.name ?? "Programa"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit3 size={14} />
            <span>Editar perfil</span>
          </button>
        </div>
        {/* Bottom Links */}
        <div className="border-t border-gray-200 py-2">
          <NavLink
            to="/configuracion"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Settings size={18} />
            <span>Configuración</span>
          </NavLink>
          <NavLink
            to="/ayuda"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <HelpCircle size={18} />
            <span>Ayuda</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 text-left"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
export default Layout;
