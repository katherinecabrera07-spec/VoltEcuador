import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  HelpCircle,
  Eye,
  Percent,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { KPI } from '../types';
import { getCompliancePercent } from '../utils/colors';

interface KpiManagerProps {
  kpis: KPI[];
  onAdd: (newKpi: KPI) => void;
  onUpdate: (updatedKpi: KPI) => void;
  onDelete: (id: string) => void;
}

export default function KpiManager({
  kpis,
  onAdd,
  onUpdate,
  onDelete
}: KpiManagerProps) {
  const [selectedKpiId, setSelectedKpiId] = useState<string>(kpis[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formula: '',
    unit: '',
    target: 0,
    currentValue: 0,
    history: [] as { period: string; value: number }[]
  });

  const selectedKpi = kpis.find(k => k.id === selectedKpiId) || kpis[0];

  // Helper to get Traffic Light status color (Semáforo)
  const getTrafficLight = (kpi: KPI) => {
    const pct = getCompliancePercent(kpi);
    if (pct >= 90) {
      return { 
        label: 'Excelente (Verde)', 
        color: 'bg-emerald-500', 
        text: 'text-emerald-700', 
        bg: 'bg-emerald-50 border-emerald-100',
        hex: '#10b981'
      };
    } else if (pct >= 70) {
      return { 
        label: 'En progreso (Amarillo)', 
        color: 'bg-amber-500', 
        text: 'text-amber-700', 
        bg: 'bg-amber-50 border-amber-100',
        hex: '#f59e0b'
      };
    } else {
      return { 
        label: 'Bajo Meta (Rojo)', 
        color: 'bg-rose-500', 
        text: 'text-rose-700', 
        bg: 'bg-rose-50 border-rose-100',
        hex: '#f43f5e'
      };
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      formula: '',
      unit: 'Leads',
      target: 100,
      currentValue: 0,
      history: [
        { period: 'Ene 2026', value: 0 },
        { period: 'Feb 2026', value: 0 },
        { period: 'Mar 2026', value: 0 },
        { period: 'Abr 2026', value: 0 },
        { period: 'May 2026', value: 0 },
        { period: 'Jun 2026', value: 0 },
      ]
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleOpenEdit = (kpi: KPI) => {
    setEditingId(kpi.id);
    setFormData({
      name: kpi.name,
      description: kpi.description,
      formula: kpi.formula,
      unit: kpi.unit,
      target: kpi.target,
      currentValue: kpi.currentValue,
      history: kpi.history || []
    });
    setErrorMsg('');
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.target <= 0) {
      setErrorMsg('La meta del KPI debe ser mayor a cero.');
      return;
    }

    if (editingId) {
      onUpdate({
        id: editingId,
        ...formData
      });
    } else {
      const newId = `kpi-${Date.now()}`;
      onAdd({
        id: newId,
        ...formData
      });
      setSelectedKpiId(newId);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirmId(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector & Top row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-slate-900">Monitoreo de KPIs Estratégicos</h2>
          <p className="font-sans text-xs text-slate-500">Métricas clave de marketing con semáforos integrados de desempeño</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/15"
        >
          <Plus className="h-4 w-4" />
          <span>Definir Nuevo KPI</span>
        </button>
      </div>

      {/* Grid: Left - KPI Selector List, Right - KPI Active Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Selector List */}
        <div className="space-y-3.5">
          <span className="font-sans text-xs font-bold text-slate-400 block uppercase tracking-wider">Métricas Definidas</span>
          <div className="space-y-3">
            {kpis.map(k => {
              const sem = getTrafficLight(k);
              const isSelected = selectedKpiId === k.id;
              const compliance = getCompliancePercent(k);

              return (
                <div
                  key={k.id}
                  onClick={() => setSelectedKpiId(k.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/15' 
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden pr-3">
                    <h4 className={`font-sans font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {k.name}
                    </h4>
                    <p className={`font-mono text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      Meta: {k.target} {k.unit} • Actual: {k.currentValue}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${sem.color} shadow-sm border border-white/20`} title={sem.label}></span>
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                      {compliance}%
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirmId(k.id);
                      }}
                      className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
                        isSelected 
                          ? 'text-blue-100 hover:text-white hover:bg-blue-700' 
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title="Eliminar KPI"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active KPI In-depth dashboard */}
        <div className="lg:col-span-2">
          {selectedKpi ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              
              {/* Header with Title and Actions */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-wider">KPI SELECCIONADO</span>
                  <h3 className="font-sans font-bold text-lg text-slate-900">{selectedKpi.name}</h3>
                  <p className="font-sans text-xs text-slate-500">{selectedKpi.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(selectedKpi)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    title="Editar KPI"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmId(selectedKpi.id)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center space-x-1"
                    title="Eliminar KPI"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              {/* Grid with Gauge, Formulas & Semáforo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* 1. Custom SVG Gauge indicator */}
                <div className="border border-slate-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                  <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-4">CUMPLIMIENTO</span>
                  
                  {/* Gauge Drawing */}
                  <div className="relative h-24 w-32 flex flex-col items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                      {/* Background arc */}
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke="#f1f5f9" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                      />
                      {/* Active Progress arc */}
                      <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke={getTrafficLight(selectedKpi).hex}
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray="125"
                        strokeDashoffset={125 - (125 * Math.min(100, getCompliancePercent(selectedKpi))) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute bottom-1 text-center">
                      <span className="font-mono text-xl font-extrabold text-slate-900 block leading-none">
                        {getCompliancePercent(selectedKpi)}%
                      </span>
                      <span className="font-sans text-[9px] text-slate-400 font-semibold uppercase block mt-1">META LOGRADA</span>
                    </div>
                  </div>
                </div>

                {/* 2. Target and Actual cards */}
                <div className="border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Métricas Actuales</span>
                    <div className="flex items-baseline space-x-1 pt-1.5">
                      <span className="font-mono text-2xl font-extrabold text-slate-800">
                        {selectedKpi.currentValue}
                      </span>
                      <span className="font-sans text-xs text-slate-500">{selectedKpi.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Meta establecida: {selectedKpi.target} {selectedKpi.unit}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <span className="font-sans text-[9px] text-slate-400 font-bold uppercase">Unidad:</span>
                    <span className="font-mono text-xs text-slate-600 font-semibold ml-1.5">{selectedKpi.unit}</span>
                  </div>
                </div>

                {/* 3. Semáforo & Formula */}
                <div className="border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-wider">Semáforo de Alerta</span>
                    <div className={`p-2.5 rounded-xl border mt-2 flex items-center space-x-2.5 ${getTrafficLight(selectedKpi).bg}`}>
                      <span className={`h-3 w-3 rounded-full ${getTrafficLight(selectedKpi).color} shrink-0 shadow-md`}></span>
                      <span className={`font-sans text-xs font-extrabold ${getTrafficLight(selectedKpi).text}`}>
                        {getTrafficLight(selectedKpi).label}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <span className="font-sans text-[9px] text-slate-400 font-bold uppercase block">FÓRMULA MATEMÁTICA</span>
                    <span className="font-sans text-[11px] text-slate-600 italic block leading-snug mt-0.5">{selectedKpi.formula}</span>
                  </div>
                </div>
              </div>

              {/* Historical graph trend of Selected KPI */}
              <div className="border border-slate-100 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-800">Historial y Tendencia en el Tiempo</h4>
                    <p className="font-sans text-[11px] text-slate-400">Variación del KPI por periodo de monitoreo 2026</p>
                  </div>
                  <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    Unidad: {selectedKpi.unit}
                  </span>
                </div>

                <div className="h-56">
                  {selectedKpi.history && selectedKpi.history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedKpi.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontFamily: 'Inter' }}
                          formatter={(value) => [`${value} ${selectedKpi.unit}`]}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorKpi)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      No hay historial registrado.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border text-center text-slate-400">
              No hay KPIs disponibles. Crea uno para comenzar.
            </div>
          )}
        </div>
      </div>

      {/* FORM DIALOG MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-slate-900">
                {editingId ? 'Modificar KPI' : 'Definir Nuevo KPI'}
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

              {/* KPI Name */}
              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Nombre de la Métrica / KPI</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tasa de Apertura de Email Marketing"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium text-slate-800"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Descripción y Objetivo</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explique qué mide esta métrica y por qué es relevante..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Formula */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Fórmula de Cálculo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. (Mails Abiertos / Mails Enviados) * 100"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  />
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Unidad de Medida</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. %, USD, Leads, Ratio, Clientes"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Meta Fijada (Target)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono font-bold"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                {/* Current Value */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase">Valor Actual</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono font-bold"
                    value={formData.currentValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      // Instantly map to history's last point to update chart
                      const hist = formData.history.map((item, idx) => {
                        if (idx === formData.history.length - 1) {
                          return { ...item, value: val };
                        }
                        return item;
                      });
                      setFormData({ 
                        ...formData, 
                        currentValue: val,
                        history: hist
                      });
                    }}
                  />
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
                  {editingId ? 'Guardar Cambios' : 'Establecer KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE MODAL */}
      {showDeleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-base text-slate-900">¿Eliminar este indicador?</h3>
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                  Esta acción no se puede deshacer. Se eliminarán permanentemente el historial y todas las metas asociadas a este indicador.
                </p>
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
                    const id = showDeleteConfirmId;
                    onDelete(id);
                    if (selectedKpiId === id) {
                      const remaining = kpis.filter(k => k.id !== id);
                      setSelectedKpiId(remaining[0]?.id || '');
                    }
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
      )}
    </div>
  );
}
