import React from "react";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import Button from "./ui/Button";
import { Capacity, CourseKind, Difficulty } from "../shared/types";

interface CourseCardProps {
  code: string;
  name: string;
  credits: number;
  schedule: string;
  professor: string;
  description: string;
  difficulty?: Difficulty;
  rating?: number;
  capacity?: Capacity;
  type: CourseKind;
  onAddToPlan?: () => void;
  onViewDetails?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  code,
  name,
  credits,
  schedule,
  professor,
  description,
  difficulty = "Intermedio",
  rating,
  capacity,
  type,
  onAddToPlan,
  onViewDetails,
}) => {
  // Determine badge color based on difficulty
  const difficultyTone =
    difficulty === "Fácil"
      ? "success"
      : difficulty === "Difícil"
      ? "danger"
      : "warning";
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{code}</Badge>
          <Badge tone="info">{type}</Badge>
          {difficulty && (
            <Badge tone={difficultyTone as any}>{difficulty}</Badge>
          )}
        </div>
        {typeof rating === "number" && (
          <div
            className="flex items-center"
            aria-label={`Calificación ${rating}`}
          >
            <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{credits} créditos</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{schedule}</span>
        </div>
      </div>
      {capacity && (
        <div className="flex items-center gap-2 mb-4" aria-label="Capacidad">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {capacity.current}/{capacity.total}
          </span>
        </div>
      )}
      <div className="text-sm text-gray-600 mb-4">Prof: {professor}</div>
      <div className="flex gap-2 mt-2">
        <Button onClick={onAddToPlan} className="flex-1">
          Agregar al Plan
        </Button>
        <Button variant="secondary" onClick={onViewDetails}>
          Ver Detalles
        </Button>
      </div>
    </Card>
  );
};
export default CourseCard;
