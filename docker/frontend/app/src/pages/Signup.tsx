import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { usePrograms } from "../hooks/usePrograms";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    programCode: "",
    carne: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { programs, isLoading: isLoadingPrograms, error: programsError } = usePrograms();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (!formData.programCode) {
      setError("Por favor selecciona tu programa académico.");
      return;
    }

    if (!formData.carne.trim()) {
      setError("Por favor ingresa tu número de carné.");
      return;
    }

    if (formData.carne.length < 6) {
      setError("El número de carné debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.programCode,
        formData.carne,
      );
      if (success) {
        navigate("/");
      } else {
        setError(
          "Este correo electrónico o número de carné ya está registrado. Por favor usa otros datos.",
        );
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <GraduationCap size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TECPlanning</h1>
          </div>
          <p className="text-gray-600">Crea tu cuenta</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || programsError) && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error || programsError}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="programCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Programa académico
                </label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3 top-3 text-gray-400" />
                  <select
                    id="programCode"
                    name="programCode"
                    value={formData.programCode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    disabled={isLoadingPrograms}
                    required
                  >
                    <option value="" disabled>
                      {isLoadingPrograms ? "Cargando programas..." : "Selecciona tu programa"}
                    </option>
                    {programs.map((program) => (
                      <option key={program.code} value={program.code}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="carne" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de carné
                </label>
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    id="carne"
                    name="carne"
                    type="text"
                    value={formData.carne}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2023123456"
                    required
                  />
                </div>
              </div>

              <Button type="submit" block disabled={isLoading || isLoadingPrograms} className="mt-6">
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta? {""}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
