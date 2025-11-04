import React, { useState } from "react";
import { Check, X, Clock, HelpCircle, ChevronDown } from "lucide-react";
import { programData } from "../data/programData";

const statusOptions = [
  {
    value: "not-coursed",
    label: "No cursado",
    icon: <HelpCircle size={16} />,
  },
  {
    value: "in-progress",
    label: "Cursando",
    icon: <Clock size={16} />,
  },
  {
    value: "approved",
    label: "Aprobado",
    icon: <Check size={16} />,
  },
  {
    value: "failed",
    label: "Reprobado",
    icon: <X size={16} />,
  },
];

type CourseStatus = "not-coursed" | "in-progress" | "approved" | "failed";

const Curriculum: React.FC = () => {
  const [courseStatus, setCourseStatus] = useState<Record<string, CourseStatus>>(
    programData.courses.reduce((acc, block) => {
      block.courses.forEach((course) => {
        acc[course.codigo] = course.status || "not-coursed";
      });
      return acc;
    }, {} as Record<string, CourseStatus>),
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const updateCourseStatus = (courseCode: string, newStatus: CourseStatus) => {
    setCourseStatus((prev) => ({
      ...prev,
      [courseCode]: newStatus,
    }));
    setOpenDropdown(null);
  };

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-50";
      case "in-progress":
        return "bg-blue-50";
      case "failed":
        return "bg-red-50";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: CourseStatus) => {
    switch (status) {
      case "approved":
        return (
          <div className="bg-green-100 text-green-600 rounded-full p-1">
            <Check size={16} />
          </div>
        );
      case "in-progress":
        return (
          <div className="bg-blue-100 text-blue-600 rounded-full p-1">
            <Clock size={16} />
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-100 text-red-600 rounded-full p-1">
            <X size={16} />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-400 rounded-full p-1">
            <HelpCircle size={16} />
          </div>
        );
    }
  };

  const getStatusBadgeColor = (status: CourseStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedCredits = programData.courses
    .flatMap((block) => block.courses)
    .filter((course) => courseStatus[course.codigo] === "approved")
    .reduce((sum, course) => sum + course.creditos, 0);

  const progressPercentage = Math.round(
    (completedCredits / programData.total_credits) * 100,
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Malla Curricular</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-gray-600">
            {programData.program} • Código: {programData.code} • {programData.grado_académico}
          </p>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {completedCredits} de {programData.total_credits} créditos ({progressPercentage}%)
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Información del Programa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">Jornada:</span> {programData.jornada}
            </p>
            <p className="text-sm">
              <span className="font-medium">Grado Académico:</span> {programData.grado_académico}
            </p>
            <p className="text-sm">
              <span className="font-medium">Última Actualización:</span> {programData.última_actualización}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Sedes:</p>
            <ul className="text-sm list-disc list-inside">
              {programData.sedes.map((sede, index) => (
                <li key={index}>{sede}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Estado de los Cursos</h2>
        <div className="flex flex-wrap gap-4">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <div className={`rounded-full p-2 ${getStatusBadgeColor(option.value)}`}>
                {option.icon}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programData.courses
          .filter((block) => block.bloque > 0)
          .map((block) => (
            <div key={block.bloque} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h2 className="font-semibold">Bloque {block.bloque}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {block.courses.map((course) => (
                  <div
                    key={course.codigo}
                    className={`p-4 relative ${getStatusColor(courseStatus[course.codigo])}`}
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        {getStatusIcon(courseStatus[course.codigo])}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-sm">
                              {course.codigo}
                            </div>
                            <div className="font-medium text-gray-800">
                              {course.nombre}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {course.creditos} créditos • {course.horas} horas
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Requisitos:</span> {course.requisitos || "No hay"}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Correquisitos:</span> {course.correquisitos || "No hay"}
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            onClick={() =>
                              setOpenDropdown((prev) =>
                                prev === course.codigo ? null : course.codigo,
                              )
                            }
                          >
                            <span>Cambiar estado</span>
                            <ChevronDown size={12} />
                          </button>
                          {openDropdown === course.codigo && (
                            <div className="mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                  onClick={() => updateCourseStatus(course.codigo, option.value as CourseStatus)}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Curriculum;
