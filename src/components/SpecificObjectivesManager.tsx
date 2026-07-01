import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  ArrowUpDown
} from 'lucide-react';
import { SpecificObjective, Priority, PlanStatus, Activity } from '../types';
import { getProgressColor } from '../utils/colors';

interface SpecificObjectivesManagerProps {
  objectives: SpecificObjective[];
  activities: Activity[];
  onAdd: (newObj: SpecificObjective) => void;
  onUpdate: (updatedObj: SpecificObjective) => void;
  onDelete: (id: string) => void;
}

export default function SpecificObjectivesManager({
  objectives,
  activities,
  onAdd,
  onUpdate,
  onDelete
}: SpecificObjectivesManagerProps) {
  // Local state for CRUD & search/filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Modal/Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    strategicReason: '',
    responsible: '',
    priority: 'Media' as Priority,
    startDate: '',
    endDate: '',
    status: 'No iniciado' as PlanStatus,
    progress: 0
  });

  // Calculate dynamic progress based on child activities if they exist
  const getObjectiveProgress = (objId: string, manualProgress: number) => {
    const objActivities = activities.filter(a => a.specificObjectiveId === objId);
    if (objActivities.length === 0) return manualProgress;
    const totalProgress = objActivities.reduce((sum, a) => sum + a.progress, 0);
    return Math.round(totalProgress / objActivities.length);
  };

  // Filter and Search objectives
  const filteredObjectives = objectives.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          obj.strategicReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          obj.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || obj.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || obj.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      strategicReason: '',
      responsible: '',
      priority: 'Media',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: 'No iniciado',
      progress: 0
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (obj: SpecificObjective) => {
    setEditingId(obj.id);
    setFormData({
      name: obj.name,
      strategicReason: obj.strategicReason,
      responsible: obj.responsible,
      priority: obj.priority,
      startDate: obj.startDate,
      endDate: obj.endDate,
      status: obj.status,
      progress: obj.progress
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrorMsg('La fecha de inicio no puede ser posterior a la fecha de finalización.');
      return;
    }

    if (editingId) {
      // Edit
      onUpdate({
        id: editingId,
        ...formData
      });
    } else {
      // Create
      onAdd({
        id: `obj-${Date.now()}`,
        ...formData
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirmId(id);
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'Alta': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Media': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusBadgeClass = (status: PlanStatus) => {
    switch (status) {
      case 'Completado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'En progreso': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Retrasado': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filters panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar objetivo, responsable o motivo..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Todas las Prioridades</option>
              <option value="Alta">Prioridad Alta</option>
              <option value="Media">Prioridad Media</option>
              <option value="Baja">Prioridad Baja</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los Estados</option>
              <option value="No iniciado">No iniciado</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Retrasado">Retrasado</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/15"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Objetivo</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Objetivo Específico</th>
                <th className="py-4 px-4">Motivo Estratégico</th>
                <th className="py-4 px-4">Responsable</th>
                <th className="py-4 px-3 text-center">Prioridad</th>
                <th className="py-4 px-4">Periodo</th>
                <th className="py-4 px-3 text-center">Estado</th>
                <th className="py-4 px-4">Avance</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {filteredObjectives.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-slate-400">
                    No se encontraron objetivos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredObjectives.map((obj) => {
                  const currentProgress = getObjectiveProgress(obj.id, obj.progress);
                  return (
                    <tr key={obj.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs">
                        {obj.name}
                      </td>
                      <td className="py-4 px-4 text-slate-500 max-w-xs leading-relaxed">
                        {obj.strategicReason}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {obj.responsible}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getPriorityBadgeClass(obj.priority)}`}>
                          {obj.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        <div>{obj.startDate}</div>
                        <div className="text-[10px] text-slate-400">al {obj.endDate}</div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(obj.status)}`}>
                          {obj.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 min-w-[80px]">
                          <span className={`font-mono font-bold ${getProgressColor(currentProgress).text}`}>{currentProgress}%</span>
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`${getProgressColor(currentProgress).bg} h-1.5 rounded-full`} style={{ width: `${currentProgress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(obj)}
                            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Editar objetivo"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(obj.id)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar objetivo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Dialog Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-slate-900">
                {editingId ? 'Editar Objetivo Específico' : 'Agregar Nuevo Objetivo Específico'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-center space-x-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Nombre del Objetivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Incrementar la tasa de clics orgánicos"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Motivo Estratégico (Justificación)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="¿Por qué es clave este objetivo para la estrategia global?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none"
                  value={formData.strategicReason}
                  onChange={(e) => setFormData({ ...formData, strategicReason: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Responsable</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Prioridad</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Estado inicial</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PlanStatus })}
                  >
                    <option value="No iniciado">No iniciado</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completado">Completado</option>
                    <option value="Retrasado">Retrasado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Progreso Base (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono font-bold"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    placeholder="Solo aplica si no hay sub-actividades"
                  />
                  <span className="text-[9px] text-slate-400 block">Se recalcula automáticamente al tener actividades.</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Objetivo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE MODAL */}
      {showDeleteConfirmId && (() => {
        const objActivities = activities.filter(a => a.specificObjectiveId === showDeleteConfirmId);
        const hasActivities = objActivities.length > 0;
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-base text-slate-900">¿Eliminar objetivo específico?</h3>
                  {hasActivities ? (
                    <p className="font-sans text-xs text-rose-600 font-medium leading-relaxed bg-rose-50 p-2.5 rounded-xl border border-rose-100 mt-2">
                      Este objetivo tiene {objActivities.length} actividades asociadas. Al eliminarlo, también se eliminarán de forma permanente todas sus actividades asociadas.
                    </p>
                  ) : (
                    <p className="font-sans text-xs text-slate-500 leading-relaxed">
                      Esta acción no se puede deshacer. Se eliminará permanentemente este objetivo del plan estratégico.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(showDeleteConfirmId);
                      setShowDeleteConfirmId(null);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/10"
                  >
                    Sí, eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
