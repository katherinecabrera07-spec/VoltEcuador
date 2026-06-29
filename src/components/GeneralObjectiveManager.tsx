import React, { useState } from 'react';
import { Award, Edit2, Check, X, Calendar, User, Compass, HelpCircle } from 'lucide-react';
import { GeneralObjective, PlanStatus } from '../types';

interface GeneralObjectiveManagerProps {
  generalObjective: GeneralObjective;
  onUpdate: (updated: GeneralObjective) => void;
}

export default function GeneralObjectiveManager({ generalObjective, onUpdate }: GeneralObjectiveManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GeneralObjective>({ ...generalObjective });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const getStatusClass = (status: PlanStatus) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Retrasado': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-lg text-slate-900">Objetivo General Corporativo</h2>
            <p className="font-sans text-xs text-slate-500">La directriz principal que guía todas las tácticas y metas del año</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setFormData({ ...generalObjective });
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center space-x-2"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Editar Objetivo</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-slate-600 uppercase">Nombre del Objetivo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans font-medium text-slate-800"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-slate-600 uppercase">Responsable del Plan</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-slate-600 uppercase">Estado General</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PlanStatus })}
              >
                <option value="No iniciado">No iniciado</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
                <option value="Retrasado">Retrasado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-slate-600 uppercase">Fecha de Inicio</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-xs font-bold text-slate-600 uppercase">Fecha de Finalización</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-slate-600 uppercase">Descripción Detallada</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-slate-600 uppercase">Estrategia Asociada de Marketing</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-sans"
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h3 className="font-sans font-bold text-lg text-slate-800 mb-2">{generalObjective.name}</h3>
            <p className="font-sans text-slate-600 text-sm leading-relaxed">{generalObjective.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-100 p-5 rounded-2xl flex items-start space-x-3.5">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 mt-0.5">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">RESPONSABLE</span>
                <p className="font-sans text-sm font-semibold text-slate-800">{generalObjective.responsible}</p>
              </div>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl flex items-start space-x-3.5">
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 mt-0.5">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">CRONOGRAMA</span>
                <p className="font-mono text-xs font-bold text-slate-800">
                  {generalObjective.startDate} al {generalObjective.endDate}
                </p>
              </div>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl flex items-start space-x-3.5">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 mt-0.5">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">ESTADO</span>
                <div>
                  <span className={`inline-block border px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider mt-1 ${getStatusClass(generalObjective.status)}`}>
                    {generalObjective.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 space-y-3">
            <div className="flex items-center space-x-2 text-slate-800">
              <Compass className="h-5 w-5 text-blue-500" />
              <h4 className="font-sans font-bold text-sm">Metodología y Enfoque Estratégico</h4>
            </div>
            <p className="font-sans text-slate-600 text-sm leading-relaxed bg-blue-50/20 border border-blue-50/50 p-4 rounded-xl">
              {generalObjective.strategy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
