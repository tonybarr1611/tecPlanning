import React, { useState } from "react";
import ProgressStats from "../components/ProgressStats";
import { Calendar } from "lucide-react";
import ProfileEditModal from "../components/ProfileEditModal";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const CurrentCoursesList: React.FC<{
  courses: {
    code: string;
    name: string;
    credits: number;
    schedule: string;
    location: string;
  }[];
}> = ({ courses }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
      <h2 className="font-semibold">Cursos Actuales</h2>
      <p className="text-sm text-gray-600">VII Semestre - II-2024</p>
    </div>
    <div className="divide-y divide-gray-200">
      {courses.map((course) => (
        <div key={course.code} className="px-4 py-3 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <h3 className="font-medium">{course.name}</h3>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {course.credits} créditos • {course.schedule}
                {course.location && ` • ${course.location}`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UpcomingEvents: React.FC<{
  events: { date: string; name: string; type: "info" | "warning" | "danger" }[];
}> = ({ events }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
      <div>
        <h2 className="font-semibold">Próximos Hitos</h2>
        <p className="text-sm text-gray-600">Fechas importantes</p>
      </div>
      <Calendar className="h-5 w-5 text-gray-500" />
    </div>
    <div className="divide-y divide-gray-200">
      {events.map((event, index) => (
        <div
          key={index}
          className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
        >
          <div
            className={`min-w-[45px] text-center px-1 py-0.5 rounded text-xs font-medium ${
              event.type === "danger"
                ? "bg-red-100 text-red-800"
                : event.type === "warning"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {event.date}
          </div>
          <span>{event.name}</span>
        </div>
      ))}
    </div>
  </div>
);
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // State for modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Show loading if user data is not available yet
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
        </div>
      </div>
    );
  }
  // Mock data for current courses
  const currentCourses = [
    {
      code: "IC6400",
      name: "Investigación de operaciones",
      credits: 4,
      schedule: "K-J 17:00-18:50",
      location: "B3-7",
    },
    {
      code: "IC6600",
      name: "Principios de sistemas operativos",
      credits: 4,
      schedule: "M-V 17:00-18:50",
      location: "B3-1",
    },
    {
      code: "IC7900",
      name: "Computación y sociedad",
      credits: 2,
      schedule: "K-J 09:30-11:20",
      location: "B3-8",
    },
    {
      code: "IC8071",
      name: "Seguridad del software",
      credits: 3,
      schedule: "M-V 09:30-11:20",
      location: "B6-2",
    },
    {
      code: "IC8073",
      name: "Introducción a la realidad virtual",
      credits: 3,
      schedule: "K-J 13:00-14:50",
      location: "",
    },
    {
      code: "SE1222",
      name: "Futbol sala",
      credits: 0,
      schedule: "V 13:00-14:50",
      location: "",
    },
    {
      code: "CS4402",
      name: "Seminario de estudios costarricenses",
      credits: 2,
      schedule: "M 13:00-15:50",
      location: "",
    },
  ];
  // Mock data for upcoming events
  const upcomingEvents: { date: string; name: string; type: "info" | "warning" | "danger" }[] = [
    {
      date: "6 Oct",
      name: "Inscripción suficiencia",
      type: "warning",
    },
    {
      date: "21 Nov",
      name: "Semana 16",
      type: "info",
    },
    {
      date: "11 Dic",
      name: "Entrega de actas",
      type: "danger",
    },
    {
      date: "15 Dic",
      name: "Matrícula V-2025",
      type: "info",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Bienvenido, {user.name}
          </h1>
          <p className="text-gray-600">
            {user.program} • Carné: {user.carne}
          </p>
        </div>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="secondary"
          size="sm"
          className="mt-2 md:mt-0"
        >
          Editar Perfil
        </Button>
      </div>
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <ProgressStats
        progress={68}
        gpa={94.7}
        currentSemester={6}
        timeRemaining={1}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CurrentCoursesList courses={currentCourses} />
        </div>
        <div>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
