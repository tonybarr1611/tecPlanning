import React, { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/api";
import { CourseStatus, CurriculumResponse } from "../shared/types";

interface CatalogCourse {
  code: string;
  name: string;
  credits: number;
  hours: number;
  requirements?: string;
  corequisites?: string;
  status: CourseStatus;
}

const statusLabels: Record<CourseStatus, string> = {
  "not-coursed": "Disponible",
  "in-progress": "En curso",
  approved: "Aprobado",
  failed: "Reprobado",
};

const Catalog: React.FC = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    setIsLoading(true);
    setError(null);
    apiRequest<CurriculumResponse>("/users/me/curriculum", { token })
      .then((response) => {
        const flattened: CatalogCourse[] = response.blocks.flatMap((block) =>
          block.courses.map((course) => ({
            code: course.code,
            name: course.name,
            credits: course.credits,
            hours: course.hours,
            requirements: course.requirements,
            corequisites: course.corequisites,
            status: course.status,
          })),
        );
        setCourses(flattened);
      })
      .catch((err) => {
        console.error("Failed to load catalog", err);
        setError("No fue posible cargar el catálogo de cursos.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return courses;
    }
    return courses.filter((course) =>
      course.name.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Catálogo de Cursos</h1>
        <p className="text-gray-600">
          Explora los cursos disponibles según tu plan académico
        </p>
      </div>
      <FilterBar onSearch={setSearchQuery} searchPlaceholder="Buscar cursos..." />
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
          Cargando cursos...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const descriptionParts = [
              `Estado: ${statusLabels[course.status]}`,
              `Requisitos: ${course.requirements || "No hay"}`,
              `Correquisitos: ${course.corequisites || "No hay"}`,
            ];
            return (
              <CourseCard
                key={course.code}
                code={course.code}
                name={course.name}
                credits={course.credits}
                schedule="Por definir"
                professor="Por asignar"
                description={descriptionParts.join(" • ")}
                type="obligatorio"
                difficulty="Intermedio"
                onAddToPlan={() => undefined}
                onViewDetails={() => undefined}
              />
            );
          })}
          {filteredCourses.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 col-span-full">
              No se encontraron cursos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;
