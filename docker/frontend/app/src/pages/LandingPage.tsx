import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Calendar, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <GraduationCap size={32} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TECPlanning</h1>
                <p className="text-sm text-gray-500">Planificación Académica</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link to="/signup">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Planifica tu
            <span className="text-blue-600"> carrera universitaria</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Organiza tu malla curricular, consulta horarios, explora el catálogo de cursos 
            y mantén un seguimiento completo de tu progreso académico.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3">
                Comenzar gratis
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="px-8 py-3">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <GraduationCap size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Malla Curricular
              </h3>
              <p className="text-gray-600">
                Visualiza y planifica todos los cursos de tu carrera con una interfaz clara y organizada.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Calendar size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Horarios
              </h3>
              <p className="text-gray-600">
                Organiza tus horarios de clases y evita conflictos con herramientas inteligentes.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Catálogo de Cursos
              </h3>
              <p className="text-gray-600">
                Explora información detallada sobre todos los cursos disponibles en tu institución.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-lg p-8 shadow-md">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 size={32} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Seguimiento de Progreso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">120+</div>
              <div className="text-gray-600">Cursos en catálogo</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15</div>
              <div className="text-gray-600">Programas académicos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Gratis para estudiantes</div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-600" />
              <span className="text-gray-600">TECPlanning - Planificación Académica</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;