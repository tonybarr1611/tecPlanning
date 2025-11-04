import React from "react";
import { BarChart3, Clock, Calendar, BookOpen } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div
      className="bg-white rounded-lg p-4 border border-gray-200 flex-1"
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold">{value}</span>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
    </div>
  );
};

interface ProgressStatsProps {
  progress: number;
  gpa: number;
  currentSemester: number;
  timeRemaining: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  progress,
  gpa,
  currentSemester,
  timeRemaining,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Progreso Académico"
        value={`${progress}%`}
        subtitle={`${Math.round(progress * 1.36)} de 136 créditos`}
        icon={<BarChart3 className="text-blue-500" />}
      />
      <StatCard
        title="Promedio Ponderado"
        value={gpa.toFixed(2)}
        subtitle="Escala de 0 a 100"
        icon={<BookOpen className="text-green-500" />}
      />
      <StatCard
        title="Semestre Actual"
        value={currentSemester}
        subtitle={`II Semestre ${new Date().getFullYear()}`}
        icon={<Calendar className="text-purple-500" />}
      />
      <StatCard
        title="Tiempo Estimado"
        value={timeRemaining}
        subtitle="años restantes"
        icon={<Clock className="text-orange-500" />}
      />
    </div>
  );
};

export default ProgressStats;
