import React, { useState } from "react";
// icons are provided by templates, no direct imports needed here
import { Modal } from "./ui/Modal";
import Button from "./ui/Button";
export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  courses: {
    id: number;
    code: string;
    name: string;
    professor: string;
    day: string;
    startTime: string;
    endTime: string;
    hasConflict: boolean;
  }[];
}
interface ScheduleSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ScheduleTemplate[];
  onSelectTemplate: (template: ScheduleTemplate) => void;
}
const ScheduleSuggestionModal: React.FC<ScheduleSuggestionModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  if (!isOpen) return null;
  const handleSelect = () => {
    const selected = templates.find((t) => t.id === selectedTemplateId);
    if (selected) {
      onSelectTemplate(selected);
      onClose();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sugerencias de Horario"
      size="md"
    >
      <p className="text-gray-600 mb-6">
        Selecciona un horario sugerido que se ajuste a tus necesidades:
      </p>
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedTemplateId === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                {template.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {template.courses.length} cursos •{" "}
                  {template.courses.reduce((acc, course) => {
                    // Calculate hours per course (assuming endTime - startTime)
                    const start = parseInt(course.startTime.split(":")[0]);
                    const end = parseInt(course.endTime.split(":")[0]);
                    return acc + (end - start);
                  }, 0)}{" "}
                  horas semanales
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSelect} disabled={!selectedTemplateId}>
          Aplicar Horario
        </Button>
      </div>
    </Modal>
  );
};
export default ScheduleSuggestionModal;
