import React, { useState, useRef } from 'react';
import { 
  ListTodo, 
  Table, 
  Kanban, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  User, 
  DollarSign, 
  FileUp, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  AlertCircle, 
  Paperclip,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SpecificObjective, Activity, Priority, PlanStatus } from '../types';
import { getProgressColor } from '../utils/colors';

interface ActivitiesManagerProps {
  objectives: SpecificObjective[];
  activities: Activity[];
  onAdd: (newAct: Activity) => void;
  onUpdate: (updatedAct: Activity) => void;
  onDelete: (id: string) => void;
}

export default function ActivitiesManager({
  objectives,
  activities,
  onAdd,
  onUpdate,
  onDelete
}: ActivitiesManagerProps) {
  const [selectedObjId, setSelectedObjId] = useState<string>('all');
  const [viewType, setViewType] = useState<'table' | 'kanban' | 'calendar'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms & Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    specificObjectiveId: '',
    name: '',
    description: '',
    responsible: '',
    startDate: '',
    endDate: '',
    status: 'No iniciado' as PlanStatus,
    priority: 'Media' as Priority,
    budgetAssigned: 0,
    budgetUsed: 0,
    progress: 0,
    attachments: [] as { name: string; url: string; size: string }[]
  });

  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter activities based on selected specific objective & search query
  const filteredActivities = activities.filter(act => {
    const matchesObj = selectedObjId === 'all' || act.specificObjectiveId === selectedObjId;
    const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesObj && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      specificObjectiveId: selectedObjId === 'all' ? (objectives[0]?.id || '') : selectedObjId,
      name: '',
      description: '',
      responsible: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
      status: 'No iniciado',
      priority: 'Media',
      budgetAssigned: 1000,
      budgetUsed: 0,
      progress: 0,
      attachments: []
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingId(act.id);
    setFormData({
      specificObjectiveId: act.specificObjectiveId,
      name: act.name,
      description: act.description,
      responsible: act.responsible,
      startDate: act.startDate,
      endDate: act.endDate,
      status: act.status,
      priority: act.priority,
      budgetAssigned: act.budgetAssigned,
      budgetUsed: act.budgetUsed,
      progress: act.progress,
      attachments: act.attachments || []
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.specificObjectiveId) {
      setErrorMsg('Debe seleccionar un objetivo específico asociado.');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrorMsg('La fecha de inicio no puede ser posterior a la fecha límite.');
      return;
    }

    if (editingId) {
      onUpdate({
        id: editingId,
        ...formData
      });
    } else {
      onAdd({
        id: `act-${Date.now()}`,
        ...formData
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      onDelete(id);
    }
  };

  // Simulate File Upload (Drag & Drop + Clickable selection)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    setUploadingFiles(true);
    setTimeout(() => {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        url: '#',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }));
      setUploadingFiles(false);
    }, 1200); // realistic upload visual delay
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Status Change in Kanban
  const moveActivityStatus = (act: Activity, newStatus: PlanStatus) => {
    onUpdate({
      ...act,
      status: newStatus,
      progress: newStatus === 'Completado' ? 100 : (newStatus === 'No iniciado' ? 0 : act.progress)
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Alta': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Media': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Target Selector & Layout Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="font-sans text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Objetivo Asociado:</span>
          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 max-w-sm"
            value={selectedObjId}
            onChange={(e) => setSelectedObjId(e.target.value)}
          >
            <option value="all">Todas las Actividades</option>
            {objectives.map(obj => (
              <option key={obj.id} value={obj.id}>{obj.name}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar actividad..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right side controls: view selectors and Add Button */}
        <div className="flex items-center justify-between xl:justify-end gap-3">
          <div className="bg-slate-100/80 p-1 rounded-xl flex items-center space-x-0.5">
            <button
              onClick={() => setViewType('table')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewType === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista de Tabla"
            >
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
            <button
              onClick={() => setViewType('kanban')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewType === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Kanban"
            >
              <Kanban className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewType === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista de Calendario"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calendario</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/15"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Actividad</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE VIEW */}
      {viewType === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Actividad</th>
                  <th className="py-4 px-4">Responsable</th>
                  <th className="py-4 px-3 text-center">Prioridad</th>
                  <th className="py-4 px-4">Fechas</th>
                  <th className="py-4 px-3 text-center">Estado</th>
                  <th className="py-4 px-4 text-right">Presupuesto Asignado</th>
                  <th className="py-4 px-4 text-right">Ejecutado</th>
                  <th className="py-4 px-4">Avance</th>
                  <th className="py-4 px-4">Evidencias</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 px-6 text-center text-slate-400">
                      No hay actividades configuradas para este objetivo o consulta.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map(act => {
                    const obj = objectives.find(o => o.id === act.specificObjectiveId);
                    const isOverBudget = act.budgetUsed > act.budgetAssigned;
                    return (
                      <tr key={act.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6 max-w-xs">
                          <p className="font-semibold text-slate-900 leading-tight">{act.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5" title={obj?.name}>
                            Obj: {obj?.name || 'Desconocido'}
                          </p>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-800">{act.responsible}</td>
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getPriorityColor(act.priority)}`}>
                            {act.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          <div>{act.startDate}</div>
                          <div className="text-[10px] text-slate-400">al {act.endDate}</div>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            act.status === 'Completado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            act.status === 'En progreso' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            act.status === 'Retrasado' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-medium text-slate-900">
                          ${act.budgetAssigned.toLocaleString('es-ES')}
                        </td>
                        <td className="py-4 px-4 text-right font-mono">
                          <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                            ${act.budgetUsed.toLocaleString('es-ES')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1.5 min-w-[70px]">
                            <span className={`font-mono font-bold ${getProgressColor(act.progress).text}`}>{act.progress}%</span>
                            <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className={`${getProgressColor(act.progress).bg} h-1`} style={{ width: `${act.progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {act.attachments && act.attachments.length > 0 ? (
                            <div className="flex items-center space-x-1 text-blue-600" title={`${act.attachments.length} archivos`}>
                              <Paperclip className="h-3.5 w-3.5" />
                              <span className="font-mono font-bold text-[10px]">{act.attachments.length}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(act)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(act.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
      )}

      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['No iniciado', 'En progreso', 'Retrasado', 'Completado'] as PlanStatus[]).map(columnStatus => {
            const columnActs = filteredActivities.filter(a => a.status === columnStatus);
            
            // Column Header colors
            const colHeaderColor = 
              columnStatus === 'Completado' ? 'border-t-4 border-t-emerald-500 bg-emerald-50/50 text-emerald-800' :
              columnStatus === 'En progreso' ? 'border-t-4 border-t-blue-500 bg-blue-50/50 text-blue-800' :
              columnStatus === 'Retrasado' ? 'border-t-4 border-t-rose-500 bg-rose-50/50 text-rose-800' :
              'border-t-4 border-t-slate-400 bg-slate-50/50 text-slate-700';

            return (
              <div key={columnStatus} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col h-[600px]">
                <div className={`p-3 rounded-xl border border-slate-100 flex items-center justify-between mb-4 font-sans font-bold text-xs ${colHeaderColor}`}>
                  <span className="uppercase tracking-wider">{columnStatus}</span>
                  <span className="font-mono text-[10px] bg-white/80 border border-slate-200/50 h-5 px-1.5 rounded-full flex items-center justify-center">
                    {columnActs.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1">
                  {columnActs.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[11px] font-sans">
                      Columna vacía
                    </div>
                  ) : (
                    columnActs.map(act => (
                      <div 
                        key={act.id}
                        className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-sans font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {act.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider ${getPriorityColor(act.priority)}`}>
                            {act.priority}
                          </span>
                        </div>

                        <p className="font-sans text-slate-500 text-[11px] line-clamp-2">
                          {act.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                          <div className="flex items-center space-x-1.5">
                            <div className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[9px] border">
                              {act.responsible.charAt(0)}
                            </div>
                            <span className="font-sans font-medium text-slate-600">{act.responsible}</span>
                          </div>
                          <span className="font-mono text-[10px]">{act.endDate}</span>
                        </div>

                        {/* Drag alternative quick-move select */}
                        <div className="flex items-center justify-between pt-1">
                          <span className={`font-mono text-[10px] font-bold ${getProgressColor(act.progress).text}`}>{act.progress}%</span>
                          
                          <select
                            className="bg-slate-50 border border-slate-200 text-[10px] rounded-md py-0.5 px-1.5 text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/10"
                            value={act.status}
                            onChange={(e) => moveActivityStatus(act, e.target.value as PlanStatus)}
                          >
                            <option value="No iniciado">Mover a...</option>
                            <option value="No iniciado">No iniciado</option>
                            <option value="En progreso">En progreso</option>
                            <option value="Retrasado">Retrasado</option>
                            <option value="Completado">Completado</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewType === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-sans font-bold text-sm text-slate-800">Cronograma de Entrega (Calendario de Actividades)</h3>
            <span className="font-sans text-xs text-slate-500">Visualización secuencial por fecha de vencimiento</span>
          </div>
          
          <div className="space-y-3">
            {filteredActivities
              .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
              .map(act => {
                const diffTime = new Date(act.endDate).getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1024 * 60 * 60 * 24));
                const isOverdue = diffDays < 0 && act.status !== 'Completado';

                return (
                  <div key={act.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-all">
                    <div className="flex items-start space-x-3.5">
                      <div className={`p-2.5 rounded-xl ${
                        act.status === 'Completado' ? 'bg-emerald-100 text-emerald-600' :
                        isOverdue ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-sm text-slate-800">{act.name}</h4>
                        <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500 font-sans">
                          <span className="font-medium text-slate-700">Responsable: {act.responsible}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">Límite: {act.endDate}</span>
                          <span>•</span>
                          <span className={`font-mono font-bold ${
                            isOverdue ? 'text-rose-600' : 
                            diffDays <= 7 && act.status !== 'Completado' ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            {act.status === 'Completado' ? 'Completado con éxito' : 
                             isOverdue ? `Atrasado por ${Math.abs(diffDays)} días` : 
                             diffDays === 0 ? 'Vence hoy' : `Quedan ${diffDays} días`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                        act.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' :
                        act.status === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                        act.status === 'Retrasado' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {act.status}
                      </span>
                      <button
                        onClick={() => handleOpenEdit(act)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Detalles
                      </button>
                    </div>
                  </div>
                );
              })}
            {filteredActivities.length === 0 && (
              <p className="text-center text-slate-400 py-6 text-sm">No hay actividades para mostrar en el calendario.</p>
            )}
          </div>
        </div>
      )}

      {/* FORM DIALOG MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-slate-900">
                {editingId ? 'Editar Actividad' : 'Registrar Nueva Actividad'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-center space-x-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Specific Objective Selector */}
              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Objetivo Específico Relacionado</label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                  value={formData.specificObjectiveId}
                  onChange={(e) => setFormData({ ...formData, specificObjectiveId: e.target.value })}
                >
                  <option value="">Seleccione el objetivo específico...</option>
                  {objectives.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.name}</option>
                  ))}
                </select>
              </div>

              {/* Activity name */}
              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Nombre de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Diseño de las plantillas publicitarias para Meta Ads"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Descripción de la Actividad</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Escriba los detalles o entregables de esta actividad..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Responsible */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Responsable de Ejecución</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo del ejecutor"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Prioridad Táctica</label>
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
                {/* Dates */}
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
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Budget assigned */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Presupuesto Asignado ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono font-bold text-slate-800"
                    value={formData.budgetAssigned}
                    onChange={(e) => setFormData({ ...formData, budgetAssigned: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Budget Used */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Presupuesto Ejecutado ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono font-bold text-slate-800"
                    value={formData.budgetUsed}
                    onChange={(e) => setFormData({ ...formData, budgetUsed: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Estado</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.status}
                    onChange={(e) => {
                      const st = e.target.value as PlanStatus;
                      setFormData({ 
                        ...formData, 
                        status: st,
                        progress: st === 'Completado' ? 100 : (st === 'No iniciado' ? 0 : formData.progress)
                      });
                    }}
                  >
                    <option value="No iniciado">No iniciado</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completado">Completado</option>
                    <option value="Retrasado">Retrasado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Avance Real ({formData.progress}%)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                    value={formData.progress}
                    disabled={formData.status === 'Completado'}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  />
                  <span className="font-mono text-xs font-bold w-10 text-right">{formData.progress}%</span>
                </div>
              </div>

              {/* Evidencias (Files upload compliant with Usability Patterns) */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block">Evidencias y Documentos Adjuntos</label>
                
                {/* File Dropzone Area */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    dragActive ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="space-y-2">
                    <div className="bg-slate-50 border border-slate-100 h-10 w-10 rounded-full flex items-center justify-center text-slate-400 mx-auto group-hover:text-blue-500">
                      <FileUp className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-blue-600 hover:text-blue-800">Sube un archivo</span> o arrástralo aquí
                    </div>
                    <p className="text-[10px] text-slate-400">Archivos PDF, XLSX, DOCX o PNG (Máximo 10MB)</p>
                  </div>
                </div>

                {uploadingFiles && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-blue-600 font-medium py-1">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                    <span>Subiendo documentos, espere...</span>
                  </div>
                )}

                {/* Attachment list */}
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {formData.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl text-xs">
                        <div className="flex items-center space-x-2 truncate">
                          <Paperclip className="h-4 w-4 text-slate-400 shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-slate-700 truncate" title={file.name}>{file.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
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
                  {editingId ? 'Guardar Cambios' : 'Registrar Actividad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
