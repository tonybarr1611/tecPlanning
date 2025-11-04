import React from "react";
import { X } from "lucide-react";
import { cn } from "../shared/cn";
interface ScheduleBlockProps {
  code: string;
  name: string;
  professor: string;
  timeSlot: string;
  onRemove?: () => void;
  hasConflict?: boolean;
  isCurrent?: boolean;
}
const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  code,
  name,
  professor,
  timeSlot,
  onRemove,
  hasConflict = false,
  isCurrent = false,
}) => {
  return (
    <div
      className={cn(
        "border rounded-md p-2 text-xs relative",
        hasConflict
          ? "bg-red-100 border-red-300"
          : isCurrent
          ? "bg-blue-100 border-blue-300"
          : "bg-green-100 border-green-300"
      )}
    >
      {onRemove && (
        <button
          aria-label="Eliminar del horario"
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
          onClick={onRemove}
        >
          <X size={16} />
        </button>
      )}
      <div className="font-semibold">{code}</div>
      <div className="mb-1">{name}</div>
      <div className="text-gray-600">{professor}</div>
      <div className="text-gray-600">{timeSlot}</div>
      {hasConflict && (
        <div className="mt-1 text-red-600 font-medium">Conflicto</div>
      )}
    </div>
  );
};
export default ScheduleBlock;
