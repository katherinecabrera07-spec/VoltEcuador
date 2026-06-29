import React, { useState } from 'react';
import { 
  DollarSign, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  PiggyBank,
  TrendingDown,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid 
} from 'recharts';
import { SpecificObjective, Activity } from '../types';

interface BudgetManagerProps {
  objectives: SpecificObjective[];
  activities: Activity[];
  budgetTotalAnnual: number;
  onUpdateAnnualBudget: (amount: number) => void;
}

export default function BudgetManager({
  objectives,
  activities,
  budgetTotalAnnual,
  onUpdateAnnualBudget
}: BudgetManagerProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetTotalAnnual);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('all');

  // Calculations
  const totalAssigned = activities.reduce((sum, a) => sum + a.budgetAssigned, 0);
  const totalUsed = activities.reduce((sum, a) => sum + a.budgetUsed, 0);
  const totalRemaining = budgetTotalAnnual - totalUsed;
  
  // Budget Deviation (Diferencia entre gastado y asignado de lo que ya se completó o está en marcha)
  const budgetDeviation = totalUsed - totalAssigned;
  const deviationPercent = totalAssigned > 0 ? Math.round((budgetDeviation / totalAssigned) * 100) : 0;

  // Pie chart: Budget distribution by Specific Objective
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];
  const distributionData = objectives.map(obj => {
    const objActivities = activities.filter(a => a.specificObjectiveId === obj.id);
    const assigned = objActivities.reduce((sum, a) => sum + a.budgetAssigned, 0);
    return {
      name: obj.name.length > 30 ? obj.name.substring(0, 30) + '...' : obj.name,
      value: assigned
    };
  }).filter(item => item.value > 0);

  // Add "Unassigned / Reserved" if objectives do not consume full annual budget
  const objectivesAssignedSum = objectives.reduce((sum, obj) => {
    const objActivities = activities.filter(a => a.specificObjectiveId === obj.id);
    return sum + objActivities.reduce((s, a) => s + a.budgetAssigned, 0);
  }, 0);

  if (budgetTotalAnnual > objectivesAssignedSum) {
    distributionData.push({
      name: 'Reserva Estratégica (No Asignado)',
      value: budgetTotalAnnual - objectivesAssignedSum
    });
  }

  // Bar chart data for active activities
  const activeActivities = selectedObjectiveId === 'all'
    ? activities
    : activities.filter(a => a.specificObjectiveId === selectedObjectiveId);

  const activitiesBarData = activeActivities.map(act => ({
    name: act.name.length > 20 ? act.name.substring(0, 20) + '...' : act.name,
    'Asignado': act.budgetAssigned,
    'Ejecutado': act.budgetUsed
  }));

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempBudget <= 0) return;
    onUpdateAnnualBudget(tempBudget);
    setIsEditingBudget(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Annual Budget Management Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="font-sans font-bold text-lg text-slate-900">Control de Gestión Presupuestaria</h2>
          <p className="font-sans text-xs text-slate-500">Planificación anual corporativa de inversión publicitaria y operativa</p>
        </div>

        {/* Edit Annual Budget Inline Form */}
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center space-x-4">
          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="flex items-center space-x-2">
              <span className="font-mono text-sm text-slate-500 font-bold">$</span>
              <input
                type="number"
                min="1"
                required
                className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tempBudget}
                onChange={(e) => setTempBudget(parseInt(e.target.value) || 0)}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <>
              <div>
                <span className="font-sans text-[9px] text-slate-400 font-bold uppercase block">PRESUPUESTO ANUAL</span>
                <span className="font-mono text-base font-extrabold text-slate-900">
                  ${budgetTotalAnnual.toLocaleString('es-ES')} USD
                </span>
              </div>
              <button
                onClick={() => {
                  setTempBudget(budgetTotalAnnual);
                  setIsEditingBudget(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
              >
                Modificar
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Financial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Annual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Techo Presupuestario</span>
            <span className="font-mono text-2xl font-black text-slate-800">${budgetTotalAnnual.toLocaleString('es-ES')}</span>
            <span className="font-sans text-[10px] text-slate-500 block">Límite anual autorizado</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-slate-700">
            <PiggyBank className="h-6 w-6" />
          </div>
        </div>

        {/* Total Allocated */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Asignado a Tácticas</span>
            <span className="font-mono text-2xl font-black text-blue-600">${totalAssigned.toLocaleString('es-ES')}</span>
            <span className="font-sans text-[10px] text-slate-500 block">
              {Math.round((totalAssigned / budgetTotalAnnual) * 100)}% del total general
            </span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Total Executed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Presupuesto Ejecutado</span>
            <span className="font-mono text-2xl font-black text-emerald-600">${totalUsed.toLocaleString('es-ES')}</span>
            <span className="font-sans text-[10px] text-slate-500 block">
              {Math.round((totalUsed / budgetTotalAnnual) * 100)}% gastado hasta la fecha
            </span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Remaining / Available */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Presupuesto Disponible</span>
            <span className={`font-mono text-2xl font-black ${totalRemaining < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              ${totalRemaining.toLocaleString('es-ES')}
            </span>
            <span className="font-sans text-[10px] text-slate-500 block">
              Saldo no utilizado
            </span>
          </div>
          <div className={`p-4 rounded-xl ${totalRemaining < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-700'}`}>
            <TrendingDown className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Budget Deviation Warning Display */}
      {budgetDeviation !== 0 && (
        <div className={`p-5 rounded-2xl border flex items-start space-x-3.5 ${
          budgetDeviation > 0 
            ? 'bg-rose-50 border-rose-100 text-rose-800' 
            : 'bg-emerald-50 border-emerald-100 text-emerald-800'
        }`}>
          <div className={`p-2.5 rounded-xl ${budgetDeviation > 0 ? 'bg-rose-100' : 'bg-emerald-100'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sans font-bold text-sm">
              {budgetDeviation > 0 
                ? 'Desviación Presupuestaria Negativa (Exceso de Gasto)' 
                : 'Eficiencia Presupuestaria (Ahorro)'}
            </h4>
            <p className="font-sans text-xs leading-relaxed opacity-90">
              {budgetDeviation > 0 
                ? `La ejecución de actividades supera el presupuesto asignado originalmente por un monto de $${budgetDeviation.toLocaleString('es-ES')} (${deviationPercent}% de desviación por encima). Se sugiere revisar las partidas de Paid Media o renegociar contratos de pauta.`
                : `Se registra un remanente positivo de $${Math.abs(budgetDeviation).toLocaleString('es-ES')} con respecto al presupuesto originalmente asignado para las actividades vigentes, lo cual indica un uso eficiente de recursos corporativos.`}
            </p>
          </div>
        </div>
      )}

      {/* Budget Visualizations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Col: Pie Chart of Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-slate-900">Distribución Presupuestaria</h3>
            <p className="font-sans text-xs text-slate-500">Distribución del presupuesto anual asignado entre los objetivos específicos</p>
          </div>

          <div className="h-64 flex items-center justify-center mt-4">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontFamily: 'Inter', fontSize: 11 }}
                    formatter={(value) => [`$${Number(value).toLocaleString('es-ES')} USD`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-xs">No hay distribución registrada.</p>
            )}
          </div>

          {/* Custom Legends list */}
          <div className="space-y-2 border-t border-slate-50 pt-4 mt-2 max-h-40 overflow-y-auto custom-scrollbar">
            {distributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-[11px] font-sans">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-slate-600 truncate" title={entry.name}>{entry.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 shrink-0">
                  ${entry.value.toLocaleString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Comparative bar chart by activities (3 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
            <div>
              <h3 className="font-sans font-bold text-base text-slate-900">Análisis Comparativo de Actividades</h3>
              <p className="font-sans text-xs text-slate-500">Presupuesto Asignado vs. Ejecutado por actividad táctica</p>
            </div>
            
            {/* Filter by specific goal */}
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-medium text-slate-700 focus:outline-none"
              value={selectedObjectiveId}
              onChange={(e) => setSelectedObjectiveId(e.target.value)}
            >
              <option value="all">Todas las actividades</option>
              {objectives.map(o => (
                <option key={o.id} value={o.id}>{o.name.substring(0, 35)}...</option>
              ))}
            </select>
          </div>

          <div className="h-72 mt-6">
            {activitiesBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activitiesBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontFamily: 'Inter' }}
                    formatter={(value) => [`$${Number(value).toLocaleString('es-ES')}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }} />
                  <Bar dataKey="Asignado" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Ejecutado" fill="#ec4899" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No hay actividades de presupuesto en este objetivo.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
