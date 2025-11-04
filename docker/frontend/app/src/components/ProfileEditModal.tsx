import React, { useState } from "react";
import { User, BookOpen, Hash, AlertCircle, CheckCircle } from 'lucide-react';
import Button from "./ui/Button";
import { Modal } from "./ui/Modal";
import { useAuth } from '../hooks/useAuth';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    program: user?.program || '',
    carne: user?.carne || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const programs = [
    'Ingeniería en Computación',
    'Ingeniería en Sistemas',
    'Ingeniería Industrial',
    'Ingeniería Civil',
    'Ingeniería Mecánica',
    'Ingeniería Eléctrica',
    'Arquitectura',
    'Administración de Empresas',
    'Contaduría Pública',
    'Psicología'
  ];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('El nombre es requerido.');
      return;
    }

    if (!formData.program) {
      setError('Por favor selecciona tu programa académico.');
      return;
    }

    if (!formData.carne.trim()) {
      setError('Por favor ingresa tu número de carné.');
      return;
    }

    if (formData.carne.length < 6) {
      setError('El número de carné debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const updateSuccess = await updateProfile(formData.name, formData.program, formData.carne);
      if (updateSuccess) {
        setSuccess('Perfil actualizado exitosamente.');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1500);
      } else {
        setError('Este número de carné ya está en uso por otro usuario.');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      program: user?.program || '',
      carne: user?.carne || ''
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Perfil" size="sm">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 mb-4">
            <CheckCircle size={16} />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre completo"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Carné
          </label>
          <div className="relative">
            <Hash size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="carne"
              value={formData.carne}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2023123456"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programa Académico
          </label>
          <div className="relative">
            <BookOpen size={18} className="absolute left-3 top-3 text-gray-400" />
            <select
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              required
            >
              <option value="">Selecciona tu programa</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            onClick={handleClose} 
            variant="secondary"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || success !== ''}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileEditModal;
