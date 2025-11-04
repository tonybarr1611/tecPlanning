import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import CourseCard from "../components/CourseCard";
// Courses available next semester (mirrors Schedule "nextSemesterCourses")
const coursesData = [
  {
    code: "IC6200",
    name: "Inteligencia artificial",
    credits: 4,
    schedule: "Lunes-Miércoles 09:30-09:50 | Martes-Jueves 10:30-11:50",
    professor: "Steven Pacheco Portuguez",
    description:
      "Fundamentos y técnicas de IA: búsqueda, representación del conocimiento y aprendizaje básico.",
    difficulty: "Intermedio" as const,
    rating: 4.4,
    capacity: { current: 22, total: 30 },
    type: "obligatorio" as const,
  },
  {
    code: "IC7602",
    name: "Redes",
    credits: 4,
    schedule: "Lunes-Miércoles 13:00-14:50 | Martes-Jueves 15:00-16:50",
    professor: "Gerardo Nereo Campos Araya",
    description:
      "Arquitecturas, protocolos y herramientas para el diseño y administración de redes de datos.",
    difficulty: "Intermedio" as const,
    rating: 4.1,
    capacity: { current: 28, total: 35 },
    type: "obligatorio" as const,
  },
  {
    code: "IC7841",
    name: "Proyecto de ingeniería de software",
    credits: 4,
    schedule: "Miércoles-Viernes 10:30-11:50",
    professor: "Dra. Alicia Salazar Hernandez",
    description:
      "Desarrollo de un proyecto integrador aplicando prácticas modernas de ingeniería de software.",
    difficulty: "Difícil" as const,
    rating: 4.3,
    capacity: { current: 18, total: 25 },
    type: "obligatorio" as const,
  },
  {
    code: "AE4208",
    name: "Desarrollo de emprendedores",
    credits: 3,
    schedule: "Jueves 13:00-16:50 | Viernes 09:30-11:50",
    professor: "Ronald Leandro Elizondo",
    description:
      "Herramientas para ideación, validación y gestión de iniciativas emprendedoras.",
    difficulty: "Fácil" as const,
    rating: 4.6,
    capacity: { current: 20, total: 30 },
    type: "obligatorio" as const,
  },
];
const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  // Departments filter options
  const departments = ["Computación", "Matemática", "Física", "Humanidades"];
  // Course types filter options
  const courseTypes = ["Obligatorio", "Electivo", "Cultural", "Deportivo"];
  // Semester filter options
  const semesters = ["I-2025", "II-2025", "Verano 2025"];
  // Filter courses based on search and filters
  const filteredCourses = coursesData.filter((course) => {
    return (
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Catálogo de Cursos</h1>
        <p className="text-gray-600">
          Explora los cursos disponibles y planifica tu próximo semestre
        </p>
      </div>
      <FilterBar
        onSearch={setSearchQuery}
        searchPlaceholder="Buscar cursos..."
        filters={[
          {
            label: "Todos los departamentos",
            options: departments,
            value: departmentFilter,
            onChange: setDepartmentFilter,
          },
          {
            label: "Todos los tipos",
            options: courseTypes,
            value: typeFilter,
            onChange: setTypeFilter,
          },
          {
            label: "Todos los semestres",
            options: semesters,
            value: semesterFilter,
            onChange: setSemesterFilter,
          },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.code}
            code={course.code}
            name={course.name}
            credits={course.credits}
            schedule={course.schedule}
            professor={course.professor}
            description={course.description}
            difficulty={course.difficulty}
            rating={course.rating}
            capacity={course.capacity}
            type={course.type}
            onAddToPlan={() => alert(`Curso ${course.code} agregado al plan`)}
            onViewDetails={() => alert(`Ver detalles de ${course.code}`)}
          />
        ))}
      </div>
    </div>
  );
};
export default Catalog;
