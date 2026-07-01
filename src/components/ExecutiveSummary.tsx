import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  ArrowRight,
  Compass
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
  Legend
} from 'recharts';
import { GeneralObjective, SpecificObjective, Activity, KPI } from '../types';
import { getProgressColor, getCompliancePercent } from '../utils/colors';

interface ExecutiveSummaryProps {
  generalObjective: GeneralObjective;
  specificObjectives: SpecificObjective[];
  activities: Activity[];
  kpis: KPI[];
  budgetTotalAnnual: number;
  onNavigateToTab: (tab: string) => void;
}

export default function ExecutiveSummary({
  generalObjective,
  specificObjectives,
  activities,
  kpis,
  budgetTotalAnnual,
  onNavigateToTab
}: ExecutiveSummaryProps) {
  // Calculations
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'Completado').length;
  const pendingActivities = totalActivities - completedActivities;

  // Global advance is the average progress of specific objectives weighted or simple
  const globalProgress = specificObjectives.length > 0
    ? Math.round(specificObjectives.reduce((acc, obj) => acc + obj.progress, 0) / specificObjectives.length)
    : 0;

  // Budgets
  const budgetAssignedTotal = activities.reduce((acc, a) => acc + a.budgetAssigned, 0);
  const budgetUsedTotal = activities.reduce((acc, a) => acc + a.budgetUsed, 0);
  const budgetAvailable = budgetTotalAnnual - budgetUsedTotal;

  // KPIs Met (target accomplished based on KPI metric)
  const kpisMet = kpis.filter(k => getCompliancePercent(k) >= 100).length;

  // Charts Data
  const progressData = [
    { name: 'Progreso', value: globalProgress, color: '#2563eb' },
    { name: 'Pendiente', value: 100 - globalProgress, color: '#f1f5f9' },
  ];

  const objDistributionData = specificObjectives.map(obj => {
    const objActivities = activities.filter(a => a.specificObjectiveId === obj.id);
    const assigned = objActivities.reduce((sum, a) => sum + a.budgetAssigned, 0);
    const used = objActivities.reduce((sum, a) => sum + a.budgetUsed, 0);
    return {
      name: obj.name.length > 25 ? obj.name.substring(0, 25) + '...' : obj.name,
      'Asignado': assigned,
      'Ejecutado': used,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Progress Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Avance Global</span>
            <span className={`font-mono text-3xl font-extrabold ${getProgressColor(globalProgress).text} block`}>{globalProgress}%</span>
            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className={`${getProgressColor(globalProgress).bg} h-1.5`} style={{ width: `${globalProgress}%` }}></div>
            </div>
          </div>
          <div className={`${getProgressColor(globalProgress).bgLight} p-4 rounded-xl ${getProgressColor(globalProgress).text}`}>
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Budget Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Presupuesto Ejecutado</span>
            <span className="font-mono text-3xl font-extrabold text-slate-900 block">
              ${budgetUsedTotal.toLocaleString('es-ES')}
            </span>
            <span className="font-sans text-xs text-slate-500 block">
              de ${budgetTotalAnnual.toLocaleString('es-ES')} anuales
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-slate-700">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Activities Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Actividades Completadas</span>
            <span className="font-mono text-3xl font-extrabold text-emerald-600 block">
              {completedActivities} / {totalActivities}
            </span>
            <span className="font-sans text-xs text-amber-600 font-semibold block">
              {pendingActivities} pendientes
            </span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* KPIs Met Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">KPIs Cumplidos</span>
            <span className="font-mono text-3xl font-extrabold text-amber-600 block">
              {kpisMet} / {kpis.length}
            </span>
            <span className="font-sans text-xs text-slate-500 block">
              Bajo monitoreo constante
            </span>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Strategic Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600/30 text-blue-300 p-3 rounded-xl border border-blue-500/25">
            <Compass className="h-6 w-6 animate-spin-slow" />
          </div>
          <div>
            <span className="font-sans text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">SISTEMA DE CONTROL ESTRATÉGICO</span>
            <h3 className="font-sans font-extrabold text-base text-white mt-0.5">Diagnóstico y Posicionamiento de Negocio</h3>
            <p className="font-sans text-xs text-slate-300 mt-1">
              Las matrices estratégicas indican una posición competitiva de liquidación de stock. Acceda para visualizar FODA, EFI, PEYEA y McKinsey.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('analisis-estrategico')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold font-sans text-xs transition-colors flex items-center space-x-1.5 shrink-0 shadow-lg"
        >
          <span>Abrir Análisis Estratégico</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* General Strategy Mission Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="bg-blue-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {generalObjective.status}
              </span>
              <span className="font-mono text-xs text-slate-400">Objetivo General Corporativo</span>
            </div>
            <h2 className="font-sans font-extrabold text-2xl text-white tracking-tight leading-tight">
              {generalObjective.name}
            </h2>
            <p className="font-sans text-slate-300 text-sm leading-relaxed">
              {generalObjective.description}
            </p>
            <div className="pt-4 border-t border-slate-800 space-y-1">
              <span className="font-sans text-xs text-slate-400 block uppercase font-semibold">Estrategia Asociada</span>
              <p className="font-sans text-xs text-slate-300 italic">{generalObjective.strategy}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-sans text-xs font-semibold text-slate-400 block uppercase">Detalles del Plan</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-sans text-[10px] text-slate-500 block">RESPONSABLE</span>
                  <span className="font-sans text-xs font-medium text-slate-200">{generalObjective.responsible}</span>
                </div>
                <div>
                  <span className="font-sans text-[10px] text-slate-500 block">FECHAS</span>
                  <span className="font-mono text-xs font-medium text-slate-200">2026</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigateToTab('objetivo-general')}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/10"
            >
              <span>Ver Objetivo General</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graphs Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: General Progress Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-slate-900">Avance General</h3>
            <p className="font-sans text-xs text-slate-500">Representación del cumplimiento promedio de los objetivos específicos</p>
          </div>
          <div className="h-64 flex items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={getProgressColor(globalProgress).hex} />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-4xl font-black ${getProgressColor(globalProgress).text}`}>{globalProgress}%</span>
              <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">COMPLETADO</span>
            </div>
          </div>
          <div className="flex justify-around border-t border-slate-50 pt-4 mt-2">
            <div className="text-center">
              <span className="h-2.5 w-2.5 bg-blue-600 rounded-full inline-block mr-1"></span>
              <span className="font-sans text-xs text-slate-500">Ejecutado</span>
            </div>
            <div className="text-center">
              <span className="h-2.5 w-2.5 bg-slate-200 rounded-full inline-block mr-1"></span>
              <span className="font-sans text-xs text-slate-500">Pendiente</span>
            </div>
          </div>
        </div>

        {/* Right: Specific Objectives Budgets */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-slate-900">Distribución Presupuestaria por Objetivo</h3>
            <p className="font-sans text-xs text-slate-500">Comparativa de presupuesto asignado versus ejecutado por cada objetivo específico</p>
          </div>
          <div className="h-64 mt-4">
            {objDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontFamily: 'Inter' }}
                    formatter={(value) => [`$${Number(value).toLocaleString('es-ES')}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter', marginTop: 10 }} />
                  <Bar dataKey="Asignado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ejecutado" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No hay datos disponibles.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-sans font-bold text-base text-slate-900">Línea de Tiempo Estratégica</h3>
            <p className="font-sans text-xs text-slate-500">Cronograma secuencial de los objetivos específicos y sus hitos de entrega</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('cronograma')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
          >
            <span>Ver Gantt Completo</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Custom Strategic Milestone Cards Timeline */}
        <div className="relative border-l border-slate-100 ml-4 pl-8 space-y-6">
          {specificObjectives.map((obj, idx) => {
            const statusColor = 
              obj.status === 'Completado' ? 'bg-emerald-500 border-emerald-100 text-emerald-700' :
              obj.status === 'En progreso' ? 'bg-blue-500 border-blue-100 text-blue-700' :
              obj.status === 'Retrasado' ? 'bg-rose-500 border-rose-100 text-rose-700' :
              'bg-slate-400 border-slate-100 text-slate-600';

            const objActivities = activities.filter(a => a.specificObjectiveId === obj.id);

            return (
              <div key={obj.id} className="relative group">
                {/* Visual Circle indicator */}
                <div className={`absolute -left-12 top-1.5 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                  obj.status === 'Completado' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/50 p-4 rounded-xl border border-slate-100 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h4 className="font-sans font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {obj.name}
                    </h4>
                    <span className={`self-start md:self-auto px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                      obj.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' :
                      obj.status === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                      obj.status === 'Retrasado' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {obj.status}
                    </span>
                  </div>

                  <p className="font-sans text-slate-600 text-xs mb-4">
                    {obj.strategicReason}
                  </p>

                  {/* Sincronización de Periodos de Actividades */}
                  {objActivities.length > 0 && (
                    <div className="mb-4 bg-white/80 rounded-xl p-3.5 border border-slate-200/50 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Actividades de Ejecución
                        </span>
                        <span className="font-sans text-[9px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          Cronograma Sincronizado
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {objActivities.map(act => (
                          <div key={act.id} className="bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-sans font-semibold text-xs text-slate-700 leading-snug">
                                {act.name}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                                act.status === 'Completado' ? 'bg-emerald-100 text-emerald-800' :
                                act.status === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                                'bg-slate-200 text-slate-700'
                              }`}>
                                {act.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                              <div className="flex items-center space-x-1 font-mono">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span>{act.startDate} al {act.endDate}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <span className={`font-mono font-bold ${getProgressColor(act.progress).text}`}>{act.progress}%</span>
                                <div className="w-10 bg-slate-200 h-1 rounded-full overflow-hidden">
                                  <div className={`${getProgressColor(act.progress).bg} h-1`} style={{ width: `${act.progress}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center space-x-6">
                      <div>
                        <span className="font-sans text-[9px] text-slate-400 block uppercase">Responsable</span>
                        <span className="font-sans text-xs text-slate-700 font-medium">{obj.responsible}</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] text-slate-400 block uppercase">Prioridad</span>
                        <span className={`font-sans text-xs font-bold ${
                          obj.priority === 'Alta' ? 'text-rose-600' :
                          obj.priority === 'Media' ? 'text-amber-600' :
                          'text-slate-500'
                        }`}>{obj.priority}</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] text-slate-400 block uppercase">Periodo</span>
                        <span className="font-mono text-xs text-slate-600">{obj.startDate} al {obj.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto mt-2 md:mt-0">
                      <span className={`font-mono text-xs font-bold ${getProgressColor(obj.progress).text}`}>{obj.progress}%</span>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`${getProgressColor(obj.progress).bg} h-1.5`} style={{ width: `${obj.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
