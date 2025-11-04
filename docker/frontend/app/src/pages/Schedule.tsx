import React, { useState } from "react";
import ScheduleBlock from "../components/ScheduleBlock";
import {
  Search,
  PlusCircle,
  Wand2,
  Calendar,
  Clock,
  AlertCircle,
  Sun,
} from "lucide-react";
import ScheduleSuggestionModal from "../components/ScheduleSuggestionModal";
import Button from "../components/ui/Button";
import type { NextCourse, ScheduledCourse } from "../shared/types";
// Mock data for time slots
const timeSlots = [
  "07:30",
  "08:30",
  "09:30",
  "10:30",
  "11:30",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
// Mock data for days
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
// Day mapping removed; direct names used.
// Current semester courses (7th semester)
const currentSemesterCourses = [
  {
    id: 1,
    code: "IC6400",
    name: "Investigación de operaciones",
    professor: "Dr. Helo Guzman",
    location: "B3-7",
    sections: [
      {
        day: "Miércoles",
        startTime: "17:00",
        endTime: "18:50",
      },
      {
        day: "Jueves",
        startTime: "17:00",
        endTime: "18:50",
      },
    ],
  },
  {
    id: 2,
    code: "IC6600",
    name: "Principios de sistemas operativos",
    professor: "Kenneth Obando Rodríguez",
    location: "B3-1",
    sections: [
      {
        day: "Martes",
        startTime: "17:00",
        endTime: "18:50",
      },
      {
        day: "Viernes",
        startTime: "17:00",
        endTime: "18:50",
      },
    ],
  },
  {
    id: 3,
    code: "IC7900",
    name: "Computación y sociedad",
    professor: "Dr. Jaime Solano Soto",
    location: "B3-8",
    sections: [
      {
        day: "Miércoles",
        startTime: "09:30",
        endTime: "11:20",
      },
      {
        day: "Jueves",
        startTime: "09:30",
        endTime: "11:20",
      },
    ],
  },
  {
    id: 4,
    code: "IC8071",
    name: "Seguridad del software",
    professor: "Dr. Herson Esquivel Vargas",
    location: "B6-2",
    sections: [
      {
        day: "Martes",
        startTime: "09:30",
        endTime: "11:20",
      },
      {
        day: "Viernes",
        startTime: "09:30",
        endTime: "11:20",
      },
    ],
  },
  {
    id: 5,
    code: "IC8073",
    name: "Introducción a la realidad virtual",
    professor: "Dr. Yuen Law Wan",
    location: "",
    sections: [
      {
        day: "Miércoles",
        startTime: "13:00",
        endTime: "14:50",
      },
      {
        day: "Jueves",
        startTime: "13:00",
        endTime: "14:50",
      },
    ],
  },
  {
    id: 6,
    code: "SE1222",
    name: "Futbol sala",
    professor: "Johnny Alexander Artavia",
    location: "",
    sections: [
      {
        day: "Viernes",
        startTime: "13:00",
        endTime: "14:50",
      },
    ],
  },
  {
    id: 7,
    code: "CS4402",
    name: "Seminario de estudios costarricenses",
    professor: "Katia Franceschi Sojo",
    location: "",
    sections: [
      {
        day: "Martes",
        startTime: "13:00",
        endTime: "15:50",
      },
    ],
  },
];
// Next semester courses (8th semester)
const nextSemesterCourses: NextCourse[] = [
  {
    id: 8,
    code: "IC6200",
    name: "Inteligencia artificial",
    professor: "Steven Pacheco Portuguez",
    dependsOn: ["IC6400"],
    groups: [
      {
        id: 1,
        name: "Grupo 01",
        schedule: "Lunes-Miércoles 09:30-09:50",
        day: "Lunes",
        startTime: "09:30",
        endTime: "09:50",
        location: "B3-2",
      },
      {
        id: 2,
        name: "Grupo 02",
        schedule: "Martes-Jueves 10:30-11:50",
        day: "Martes",
        startTime: "10:30",
        endTime: "11:50",
        location: "B3-4",
      },
    ],
  },
  {
    id: 9,
    code: "IC7602",
    name: "Redes",
    professor: "Gerardo Nereo Campos Araya",
    dependsOn: ["IC6600"],
    groups: [
      {
        id: 1,
        name: "Grupo 01",
        schedule: "Lunes-Miércoles 13:00-14:50",
        day: "Lunes",
        startTime: "13:00",
        endTime: "14:50",
        location: "B5-1",
      },
      {
        id: 2,
        name: "Grupo 02",
        schedule: "Martes-Jueves 15:00-16:50",
        day: "Martes",
        startTime: "15:00",
        endTime: "16:50",
        location: "B5-3",
      },
    ],
  },
  {
    id: 10,
    code: "IC7841",
    name: "Proyecto de ingeniería de software",
    professor: "Dra. Alicia Salazar Hernandez",
    dependsOn: ["IC8071"],
    groups: [
      {
        id: 1,
        name: "Grupo 01",
        schedule: "Miércoles-Viernes 10:30-11:50",
        day: "Miércoles",
        startTime: "10:30",
        endTime: "11:50",
        location: "B4-2",
      },
    ],
  },
  {
    id: 11,
    code: "AE4208",
    name: "Desarrollo de emprendedores",
    professor: "Ronald Leandro Elizondo",
    dependsOn: [],
    groups: [
      {
        id: 1,
        name: "Grupo 01",
        schedule: "Jueves 13:00-16:50",
        day: "Jueves",
        startTime: "13:00",
        endTime: "16:50",
        location: "B2-1",
      },
      {
        id: 2,
        name: "Grupo 02",
        schedule: "Viernes 09:30-11:50",
        day: "Viernes",
        startTime: "09:30",
        endTime: "11:50",
        location: "B2-3",
      },
    ],
  },
];
// Template schedules
const scheduleTemplates = [
  {
    id: "balanced",
    name: "Horario Balanceado",
    description:
      "Distribución equilibrada de clases durante la semana con tiempo para estudio.",
    icon: <Calendar size={24} />,
    courses: [
      {
        id: 8,
        code: "IC6200",
        name: "Inteligencia artificial",
        professor: "Steven Pacheco Portuguez",
        day: "Lunes",
        startTime: "09:30",
        endTime: "09:50",
        hasConflict: false,
      },
      {
        id: 9,
        code: "IC7602",
        name: "Redes",
        professor: "Gerardo Nereo Campos Araya",
        day: "Lunes",
        startTime: "13:00",
        endTime: "14:50",
        hasConflict: false,
      },
      {
        id: 10,
        code: "IC7841",
        name: "Proyecto de ingeniería de software",
        professor: "Dra. Alicia Salazar Hernandez",
        day: "Miércoles",
        startTime: "10:30",
        endTime: "11:50",
        hasConflict: false,
      },
      {
        id: 11,
        code: "AE4208",
        name: "Desarrollo de emprendedores",
        professor: "Ronald Leandro Elizondo",
        day: "Jueves",
        startTime: "13:00",
        endTime: "16:50",
        hasConflict: false,
      },
    ],
  },
  {
    id: "compact",
    name: "Horario Compacto",
    description:
      "Clases concentradas en menos días para liberar días completos.",
    icon: <Clock size={24} />,
    courses: [
      {
        id: 8,
        code: "IC6200",
        name: "Inteligencia artificial",
        professor: "Steven Pacheco Portuguez",
        day: "Martes",
        startTime: "10:30",
        endTime: "11:50",
        hasConflict: false,
      },
      {
        id: 9,
        code: "IC7602",
        name: "Redes",
        professor: "Gerardo Nereo Campos Araya",
        day: "Martes",
        startTime: "15:00",
        endTime: "16:50",
        hasConflict: false,
      },
      {
        id: 10,
        code: "IC7841",
        name: "Proyecto de ingeniería de software",
        professor: "Dra. Alicia Salazar Hernandez",
        day: "Miércoles",
        startTime: "10:30",
        endTime: "11:50",
        hasConflict: false,
      },
      {
        id: 11,
        code: "AE4208",
        name: "Desarrollo de emprendedores",
        professor: "Ronald Leandro Elizondo",
        day: "Viernes",
        startTime: "09:30",
        endTime: "11:50",
        hasConflict: false,
      },
    ],
  },
  {
    id: "morning",
    name: "Horario Matutino",
    description:
      "Clases concentradas en las mañanas para tener las tardes libres.",
    icon: <Sun size={24} />,
    courses: [
      {
        id: 8,
        code: "IC6200",
        name: "Inteligencia artificial",
        professor: "Steven Pacheco Portuguez",
        day: "Lunes",
        startTime: "09:30",
        endTime: "09:50",
        hasConflict: false,
      },
      {
        id: 9,
        code: "IC7602",
        name: "Redes",
        professor: "Gerardo Nereo Campos Araya",
        day: "Martes",
        startTime: "09:30",
        endTime: "09:50",
        hasConflict: false,
      },
      {
        id: 10,
        code: "IC7841",
        name: "Proyecto de ingeniería de software",
        professor: "Dra. Alicia Salazar Hernandez",
        day: "Miércoles",
        startTime: "10:30",
        endTime: "11:50",
        hasConflict: false,
      },
      {
        id: 11,
        code: "AE4208",
        name: "Desarrollo de emprendedores",
        professor: "Ronald Leandro Elizondo",
        day: "Viernes",
        startTime: "09:30",
        endTime: "11:50",
        hasConflict: false,
      },
    ],
  },
];
// Convert current semester courses to scheduled courses format
const currentScheduledCourses: ScheduledCourse[] =
  currentSemesterCourses.flatMap((course) =>
    course.sections.map((section, index) => ({
      id: `${course.id}-${index}`,
      code: course.code,
      name: course.name,
      professor: course.professor,
      day: section.day as ScheduledCourse["day"],
      startTime: section.startTime,
      endTime: section.endTime,
      hasConflict: false,
      isCurrent: true,
      location: course.location || "",
    }))
  );
const ScheduleTable: React.FC<{
  semester: string;
  days: string[];
  timeSlots: string[];
  scheduledCourses: ScheduledCourse[];
  removeCourse: (id: number | string) => void;
}> = ({ semester, days, timeSlots, scheduledCourses, removeCourse }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 className="font-semibold">Horario - Semestre {semester}</h2>
      <div className="flex items-center text-sm">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-200 rounded-full mr-1"></div>
          <span>Cursos actuales</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-200 rounded-full mr-1"></div>
          <span>Próximo semestre</span>
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 border-r border-b border-gray-200 text-left text-sm font-medium text-gray-500 w-20"></th>
            {days.map((day) => (
              <th
                key={day}
                className="p-3 border-r border-b border-gray-200 text-center text-sm font-medium text-gray-700 min-w-[150px]"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, index) => (
            <tr
              key={time}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="p-3 border-r border-b border-gray-200 text-sm text-gray-500">
                {time}
              </td>
              {days.map((day) => {
                // Courses that start at this exact time
                const starters = scheduledCourses.filter(
                  (c) => c.day === day && c.startTime === time
                );

                if (starters.length === 0) {
                  return (
                    <td
                      key={`${day}-${time}`}
                      className="border-r border-b border-gray-200 p-1 relative"
                    />
                  );
                }

                // Include any ongoing overlaps started earlier
                const ongoingOverlaps = scheduledCourses.filter(
                  (c) => c.day === day && c.startTime < time && c.endTime > time
                );
                const displayCourses = [...starters, ...ongoingOverlaps];

                return (
                  <td
                    key={`${day}-${time}`}
                    className="border-r border-b border-gray-200 p-1 relative"
                  >
                    <div className="absolute inset-0 p-1">
                      <div className="flex gap-2 h-full">
                        {displayCourses.map((course) => (
                          <div
                            key={course.id}
                            className="flex-shrink-0"
                            style={{ width: `${100 / displayCourses.length}%` }}
                          >
                            <ScheduleBlock
                              code={course.code}
                              name={course.name}
                              professor={course.professor}
                              timeSlot={`${course.startTime}-${course.endTime}`}
                              onRemove={
                                course.isCurrent
                                  ? undefined
                                  : () => removeCourse(course.id)
                              }
                              hasConflict={course.hasConflict}
                              isCurrent={course.isCurrent}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Schedule: React.FC = () => {
  const [semester, setSemester] = useState("I-2025");
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize with empty array instead of currentScheduledCourses
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>(
    []
  );
  const [showCurrentCourses, setShowCurrentCourses] = useState(false);
  // State for suggestion modal
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  // Filter available courses based on search
  const filteredCourses = nextSemesterCourses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Note: conflict detection removed from add flow; overlaps are visualized in grid
  // Function to add a course to the schedule
  const addCourseToSchedule = (
    course: NextCourse,
    group: NextCourse["groups"][number]
  ) => {
    // Prevent adding the same course twice (any group)
    const alreadyAdded = scheduledCourses.some(
      (c) => c.code === course.code && !c.isCurrent
    );
    if (alreadyAdded) {
      return;
    }
    const newCourse: ScheduledCourse = {
      id: Date.now(),
      code: course.code,
      name: course.name,
      professor: course.professor,
      day: group.day as ScheduledCourse["day"],
      startTime: group.startTime,
      endTime: group.endTime,
      hasConflict: false,
      isCurrent: false,
      location: group.location || "",
    };
    setScheduledCourses((prev) => {
      const next = [...prev, newCourse];
      // mark conflicts among future courses only (ignore current semester ones)
      const future = next.filter((c) => !c.isCurrent);
      // reset flags
      next.forEach((c) => (c.hasConflict = false));
      for (let i = 0; i < future.length; i++) {
        for (let j = i + 1; j < future.length; j++) {
          const a = future[i];
          const b = future[j];
          if (a.day !== b.day) continue;
          const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
          if (overlaps) {
            a.hasConflict = true;
            b.hasConflict = true;
          }
        }
      }
      return [...next];
    });
  };
  // Function to remove a course from the schedule
  const removeCourseFromSchedule = (courseId: number | string) => {
    setScheduledCourses((prev) => {
      const next = prev.filter((course) => course.id !== courseId);
      // recompute future conflicts
      const future = next.filter((c) => !c.isCurrent);
      next.forEach((c) => (c.hasConflict = false));
      for (let i = 0; i < future.length; i++) {
        for (let j = i + 1; j < future.length; j++) {
          const a = future[i];
          const b = future[j];
          if (a.day !== b.day) continue;
          const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
          if (overlaps) {
            a.hasConflict = true;
            b.hasConflict = true;
          }
        }
      }
      return next;
    });
  };
  // Function to apply a schedule template
  const applyScheduleTemplate = (template: any) => {
    const templateCourses = template.courses.map((course: any) => ({
      ...course,
      isCurrent: false,
    }));
    // Ensure template courses adhere to allowed timeSlots and compute conflicts
    const aligned = templateCourses.map((c: any) => ({
      ...c,
      startTime: timeSlots.includes(c.startTime) ? c.startTime : c.startTime,
    }));
    // compute conflicts among future template items
    const next = aligned as ScheduledCourse[];
    next.forEach((c) => (c.hasConflict = false));
    for (let i = 0; i < next.length; i++) {
      for (let j = i + 1; j < next.length; j++) {
        const a = next[i];
        const b = next[j];
        if (a.day !== b.day) continue;
        const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
        if (overlaps) {
          a.hasConflict = true;
          b.hasConflict = true;
        }
      }
    }
    setScheduledCourses(next);
  };
  // Function to toggle showing current courses
  const toggleCurrentCourses = () => {
    if (showCurrentCourses) {
      // Remove current courses
      setScheduledCourses((prev) => {
        const next = prev.filter((course) => !course.isCurrent);
        // recompute future conflicts
        const future = next.filter((c) => !c.isCurrent);
        next.forEach((c) => (c.hasConflict = false));
        for (let i = 0; i < future.length; i++) {
          for (let j = i + 1; j < future.length; j++) {
            const a = future[i];
            const b = future[j];
            if (a.day !== b.day) continue;
            const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
            if (overlaps) {
              a.hasConflict = true;
              b.hasConflict = true;
            }
          }
        }
        return next;
      });
    } else {
      // Add current courses
      setScheduledCourses((prev) => {
        const next = [...prev, ...currentScheduledCourses];
        // conflicts only among future ones; leave current unaffected
        const future = next.filter((c) => !c.isCurrent);
        next.forEach((c) => (c.hasConflict = false));
        for (let i = 0; i < future.length; i++) {
          for (let j = i + 1; j < future.length; j++) {
            const a = future[i];
            const b = future[j];
            if (a.day !== b.day) continue;
            const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
            if (overlaps) {
              a.hasConflict = true;
              b.hasConflict = true;
            }
          }
        }
        return next;
      });
    }
    setShowCurrentCourses(!showCurrentCourses);
  };
  // Removed getScheduledCourse in favor of direct rendering with scheduledCourses
  // Function to check if a course has dependencies in the current semester
  const hasDependencies = (course: any) => {
    return course.dependsOn && course.dependsOn.length > 0;
  };
  // Function to get dependency courses
  // const getDependencyCourses = (course: NextCourse) =>
  //   course.dependsOn?.map(dep => currentSemesterCourses.find(c => c.code === dep)).filter(Boolean) || [];
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Planificador de Horarios</h1>
          <p className="text-gray-600">
            Planifica tu próximo semestre y evita choques entre materias
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <Button
            variant={showCurrentCourses ? "secondary" : "ghost"}
            onClick={toggleCurrentCourses}
            className="flex items-center gap-2"
          >
            <Calendar size={18} />
            <span>
              {showCurrentCourses
                ? "Ocultar cursos actuales"
                : "Mostrar cursos actuales"}
            </span>
          </Button>
          <Button
            onClick={() => setIsSuggestionModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Wand2 size={18} />
            <span>Sugerir Horario</span>
          </Button>
        </div>
      </div>
      {/* Semester Selection */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            Planificación para el semestre {semester}
          </h2>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="I-2025">I-2025</option>
            <option value="II-2025">II-2025</option>
            <option value="Verano-2025">Verano 2025</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="flex items-center gap-2">
            <AlertCircle size={16} className="text-blue-500" />
            <span>
              Estás planificando tu próximo semestre. Los cursos que puedes
              matricular dependen de los cursos que estás llevando actualmente.
            </span>
          </p>
        </div>
      </div>
      {/* Schedule Suggestion Modal */}
      <ScheduleSuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        templates={scheduleTemplates}
        onSelectTemplate={applyScheduleTemplate}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Schedule Calendar */}
        <div className="lg:flex-1">
          <ScheduleTable
            semester={semester}
            days={days}
            timeSlots={timeSlots}
            scheduledCourses={scheduledCourses}
            removeCourse={removeCourseFromSchedule}
          />
        </div>
        {/* Course Selection */}
        <div className="lg:w-[350px]">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold mb-3">
                Cursos para el próximo semestre
              </h2>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <div key={course.id} className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded font-medium mt-1">
                      {course.code}
                    </div>
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">
                        {course.credits ?? 4} cr
                      </p>
                      {hasDependencies(course) && (
                        <div className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
                          <p>
                            Depende de: {(course.dependsOn ?? []).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-8">
                    {course.groups.map((group) => {
                      const alreadyAdded = scheduledCourses.some(
                        (c) => c.code === course.code && !c.isCurrent
                      );
                      return (
                        <div
                          key={group.id}
                          className="flex items-center justify-between mb-2 last:mb-0"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {group.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {group.schedule}
                            </div>
                            <div className="text-xs text-gray-600">
                              {course.professor}
                              {group.location && ` • ${group.location}`}
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={alreadyAdded}
                            onClick={() => addCourseToSchedule(course, group)}
                            className="gap-1"
                          >
                            {alreadyAdded ? (
                              <span>Agregado</span>
                            ) : (
                              <>
                                <PlusCircle size={14} />
                                <span>Agregar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {filteredCourses.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron cursos que coincidan con tu búsqueda
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Schedule;
