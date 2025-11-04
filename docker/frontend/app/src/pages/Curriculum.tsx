import React, { useState } from "react";
import { Check, X, Clock, HelpCircle, ChevronDown } from "lucide-react";
import { programData } from "../data/programData";
// Status options for courses
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
  // State to track course statuses
  const [courseStatus, setCourseStatus] = useState<
    Record<string, CourseStatus>
  >(
    // Initialize with the statuses from the data
    programData.courses.reduce((acc, block) => {
      block.courses.forEach((course) => {
        acc[course.codigo] = course.status || "not-coursed";
      });
      return acc;
    }, {} as Record<string, CourseStatus>)
  );
  // State to track which course's dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Function to update a course's status
  const updateCourseStatus = (courseCode: string, newStatus: CourseStatus) => {
    setCourseStatus((prev) => ({
      ...prev,
      [courseCode]: newStatus,
    }));
    setOpenDropdown(null);
  };
  // Helper function to get the appropriate color based on status
  const getStatusColor = (status: string) => {
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
  // Helper function to get the appropriate icon based on status
  const getStatusIcon = (status: string) => {
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
  // Helper function to get the appropriate badge color based on status
  const getStatusBadgeColor = (status: string) => {
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
  // Calculate completed credits
  const completedCredits = programData.courses
    .flatMap((block) => block.courses)
    .filter((course) => courseStatus[course.codigo] === "approved")
    .reduce((sum, course) => sum + course.creditos, 0);
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (completedCredits / programData.total_credits) * 100
  );
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Malla Curricular</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-gray-600">
            {programData.program} • Código: {programData.code} •{" "}
            {programData.grado_académico}
          </p>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {completedCredits} de {programData.total_credits} créditos (
            {progressPercentage}%)
          </div>
        </div>
      </div>

      {/* Program Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Información del Programa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">Jornada:</span>{" "}
              {programData.jornada}
            </p>
            <p className="text-sm">
              <span className="font-medium">Grado Académico:</span>{" "}
              {programData.grado_académico}
            </p>
            <p className="text-sm">
              <span className="font-medium">Última Actualización:</span>{" "}
              {programData.última_actualización}
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

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Estado de los Cursos</h2>
        <div className="flex flex-wrap gap-4">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <div
                className={`rounded-full p-1 ${
                  getStatusBadgeColor(option.value).split(" ")[0]
                }`}
              >
                {option.icon}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programData.courses
          .filter((block) => block.bloque > 0) // Skip block 0 (examen diagnóstico)
          .map((block) => (
            <div
              key={block.bloque}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h2 className="font-semibold">Bloque {block.bloque}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {block.courses.map((course) => (
                  <div
                    key={course.codigo}
                    className={`p-4 relative ${getStatusColor(
                      courseStatus[course.codigo]
                    )}`}
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        {getStatusIcon(courseStatus[course.codigo])}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`
                          text-xs px-2 py-0.5 rounded font-medium
                          ${getStatusBadgeColor(courseStatus[course.codigo])}
                        `}
                          >
                            {course.codigo}
                          </span>
                          <span className="text-xs text-gray-500">
                            {course.creditos} cr
                          </span>
                          <span className="text-xs text-gray-500">
                            {course.horas} hrs
                          </span>
                          {/* Status Dropdown */}
                          <div className="relative ml-auto">
                            <button
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === course.codigo
                                    ? null
                                    : course.codigo
                                )
                              }
                              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-2 py-1"
                            >
                              {
                                statusOptions.find(
                                  (opt) =>
                                    opt.value === courseStatus[course.codigo]
                                )?.label
                              }
                              <ChevronDown size={14} />
                            </button>
                            {openDropdown === course.codigo && (
                              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-10 w-36">
                                {statusOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                    onClick={() =>
                                      updateCourseStatus(
                                        course.codigo,
                                        option.value as any
                                      )
                                    }
                                  >
                                    {option.icon}
                                    <span>{option.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <h3 className="font-medium mb-1">{course.nombre}</h3>
                        {(course.requisitos !== "No hay" ||
                          course.correquisitos !== "No hay") && (
                          <div className="mt-1 text-xs">
                            {course.requisitos !== "No hay" && (
                              <div className="text-gray-600">
                                <span className="font-medium">Req:</span>{" "}
                                {course.requisitos}
                              </div>
                            )}
                            {course.correquisitos !== "No hay" && (
                              <div className="text-gray-600">
                                <span className="font-medium">Correq:</span>{" "}
                                {course.correquisitos}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 border-t border-gray-200 p-3 text-right">
                <span className="text-sm font-medium">
                  {block.courses.reduce(
                    (sum, course) => sum + course.creditos,
                    0
                  )}{" "}
                  créditos total
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Curriculum;
