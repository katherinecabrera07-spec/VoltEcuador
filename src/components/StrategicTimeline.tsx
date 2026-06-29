import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  AlertCircle, 
  Info,
  Flag,
  User,
  Sliders,
  ChevronLeft
} from 'lucide-react';
import { SpecificObjective, Activity, PlanStatus } from '../types';
import { getProgressColor } from '../utils/colors';

interface StrategicTimelineProps {
  objectives: SpecificObjective[];
  activities: Activity[];
  onUpdateActivityDates: (id: string, start: string, end: string) => void;
}

// Helper to convert date 'YYYY-MM-DD' to day of year (0 to 365)
function getDayOfYear(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  const start = new Date('2026-01-01');
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.min(364, Math.floor(diff / oneDay)));
}

// Helper to convert day of year back to 'YYYY-MM-DD'
function getDateFromDayOfYear(day: number): string {
  const start = new Date('2026-01-01T12:00:00'); // mid-day to avoid TZ shifts
  const targetDate = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

export default function StrategicTimeline({
  objectives,
  activities,
  onUpdateActivityDates
}: StrategicTimelineProps) {
  const [collapsedObjectives, setCollapsedObjectives] = useState<Record<string, boolean>>({});
  const [activeActivityEditId, setActiveActivityEditId] = useState<string | null>(null);

  const months = [
    { name: 'Ene', days: 31 },
    { name: 'Feb', days: 28 },
    { name: 'Mar', days: 31 },
    { name: 'Abr', days: 30 },
    { name: 'May', days: 31 },
    { name: 'Jun', days: 30 },
    { name: 'Jul', days: 31 },
    { name: 'Ago', days: 31 },
    { name: 'Sep', days: 30 },
    { name: 'Oct', days: 31 },
    { name: 'Nov', days: 30 },
    { name: 'Dic', days: 31 },
  ];

  const totalDays = 365;

  const toggleCollapse = (objId: string) => {
    setCollapsedObjectives(prev => ({ ...prev, [objId]: !prev[objId] }));
  };

  // Helper to calculate percentages for CSS styles
  const getBarLayout = (startDate: string, endDate: string) => {
    const startDay = getDayOfYear(startDate);
    const endDay = getDayOfYear(endDate);
    
    const left = (startDay / totalDays) * 100;
    const width = ((endDay - startDay + 1) / totalDays) * 100;

    return {
      left: `${Math.max(0, Math.min(98, left))}%`,
      width: `${Math.max(2, Math.min(100 - left, width))}%`,
    };
  };

  const handleSliderChange = (act: Activity, field: 'start' | 'end', val: number) => {
    const startDay = getDayOfYear(act.startDate);
    const endDay = getDayOfYear(act.endDate);

    let newStart = act.startDate;
    let newEnd = act.endDate;

    if (field === 'start') {
      const targetStart = Math.min(val, endDay - 1);
      newStart = getDateFromDayOfYear(targetStart);
    } else {
      const targetEnd = Math.max(val, startDay + 1);
      newEnd = getDateFromDayOfYear(targetEnd);
    }

    onUpdateActivityDates(act.id, newStart, newEnd);
  };

  // Check if an activity is delayed/retrasada
  const isActivityDelayed = (act: Activity) => {
    if (act.status === 'Completado') return false;
    const today = new Date('2026-06-28'); // current simulated date
    const deadline = new Date(act.endDate);
    return today > deadline;
  };

  // Hitos Importantes (Milestones) hardcoded representing high value dates
  const hitos = [
    { name: 'Auditoría SEO', date: '2026-02-28', desc: 'Completado con Lighthouse 98%', type: 'success' },
    { name: 'Lanzamiento Search', date: '2026-03-05', desc: 'Arranque Google Ads', type: 'info' },
    { name: 'Webinars Promo', date: '2026-04-01', desc: 'Lanzamiento de webinars', type: 'info' },
    { name: 'Retargeting Live', date: '2026-05-20', desc: 'Filtro de abandono activo', type: 'warning' },
    { name: 'Cierre Paid Media', date: '2026-10-15', desc: 'Evaluación ROI', type: 'danger' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Description Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-slate-900">Cronograma Estratégico (Diagrama de Gantt)</h2>
          <p className="font-sans text-xs text-slate-500">Alineación temporal de objetivos corporativos y actividades para el año de gestión 2026</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-sans font-medium text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 bg-blue-600 rounded"></span>
            <span>Objetivos</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 bg-blue-400 rounded"></span>
            <span>Actividades</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 bg-rose-500 rounded"></span>
            <span>Retraso / Alerta</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3.5 w-3.5 text-amber-500 flex items-center justify-center border border-amber-300 rounded-full bg-amber-50">
              <Flag className="h-2 w-2" />
            </span>
            <span>Hito Clave</span>
          </div>
        </div>
      </div>

      {/* Gantt Area Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col">
        
        {/* Gantt Headers */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">
          {/* Left panel header placeholder */}
          <div className="w-80 p-4 border-r border-slate-100 shrink-0">
            Estructura Estratégica (2026)
          </div>
          
          {/* Timeline months header */}
          <div className="flex-1 relative flex">
            {months.map(m => (
              <div key={m.name} className="flex-1 text-center py-4 border-r border-slate-100/60 last:border-0 font-mono text-[10px]">
                {m.name}
              </div>
            ))}
            
            {/* Interactive Current Date vertical marker line (June 2026 is approx 179 days) */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10" 
              style={{ left: `${(179 / totalDays) * 100}%` }}
              title="Fecha Actual: 28 de Junio, 2026"
            >
              <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </div>
          </div>
        </div>

        {/* Gantt Rows */}
        <div className="divide-y divide-slate-100">
          {objectives.map(obj => {
            const isCollapsed = collapsedObjectives[obj.id];
            const objActivities = activities.filter(a => a.specificObjectiveId === obj.id);
            const objLayout = getBarLayout(obj.startDate, obj.endDate);

            return (
              <React.Fragment key={obj.id}>
                
                {/* 1. OBJECTIVE ROW (Parent) */}
                <div className="flex items-center hover:bg-slate-50/30 transition-colors">
                  
                  {/* Left Label */}
                  <div className="w-80 p-4 border-r border-slate-100 shrink-0 flex items-start space-x-2">
                    <button 
                      onClick={() => toggleCollapse(obj.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 mt-0.5"
                    >
                      {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className="space-y-0.5">
                      <span className="font-sans font-extrabold text-xs text-slate-900 leading-tight">
                        {obj.name}
                      </span>
                      <p className="font-sans text-[10px] text-slate-400">Resp: {obj.responsible}</p>
                    </div>
                  </div>

                  {/* Right Timeline Bar */}
                  <div className="flex-1 relative h-16 flex items-center px-2">
                    {/* Background Month columns guides */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {months.map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-100/40 last:border-0"></div>
                      ))}
                    </div>

                    {/* The Goal duration bar */}
                    <div 
                      className={`absolute h-7 rounded-lg shadow-sm border flex items-center justify-between px-3 text-[10px] font-sans font-bold text-white transition-all ${
                        getProgressColor(obj.progress).bg
                      } ${getProgressColor(obj.progress).border}`}
                      style={objLayout}
                      title={`${obj.name}: ${obj.startDate} a ${obj.endDate}`}
                    >
                      <span className="truncate">{obj.progress}%</span>
                      <span className="font-mono text-[9px] shrink-0 opacity-80">{obj.startDate} / {obj.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* 2. ACTIVITY ROWS (Children) */}
                {!isCollapsed && objActivities.map(act => {
                  const actLayout = getBarLayout(act.startDate, act.endDate);
                  const isDelayed = isActivityDelayed(act);
                  const isEditingThis = activeActivityEditId === act.id;

                  return (
                    <div key={act.id} className="flex items-center bg-slate-50/40 hover:bg-slate-100/40 transition-colors">
                      
                      {/* Left label */}
                      <div className="w-80 p-3 pl-11 border-r border-slate-100 shrink-0 flex flex-col space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-sans font-medium text-[11px] text-slate-700 leading-snug">
                            {act.name}
                          </span>
                          {isDelayed && (
                            <span className="bg-rose-50 border border-rose-100 text-rose-600 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm shrink-0 uppercase ml-2 animate-pulse">
                              Atrasado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{act.startDate} al {act.endDate}</span>
                          <button
                            onClick={() => setActiveActivityEditId(isEditingThis ? null : act.id)}
                            className="text-blue-600 hover:text-blue-800 font-sans font-bold flex items-center space-x-0.5"
                          >
                            <Sliders className="h-3 w-3" />
                            <span>{isEditingThis ? 'Cerrar' : 'Ajustar'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Timeline Bar */}
                      <div className="flex-1 relative h-16 flex items-center px-2">
                        {/* Column Guides */}
                        <div className="absolute inset-0 flex pointer-events-none">
                          {months.map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-100/40 last:border-0"></div>
                          ))}
                        </div>

                        {/* Interactive edit panel on timeline if Adjust clicked */}
                        {isEditingThis ? (
                          <div className="absolute inset-x-4 bg-white border border-blue-100 rounded-xl p-3 shadow-lg z-20 flex items-center justify-between gap-6">
                            <div className="flex-1 space-y-1">
                              <span className="font-sans font-bold text-[10px] text-slate-500 uppercase">Ajustar Periodo: {act.name}</span>
                              <div className="flex items-center space-x-4">
                                <div className="flex-1 flex items-center space-x-2">
                                  <span className="font-sans text-[10px] text-slate-400 shrink-0">INICIO:</span>
                                  <input 
                                    type="range"
                                    min="0"
                                    max="364"
                                    className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                    value={getDayOfYear(act.startDate)}
                                    onChange={(e) => handleSliderChange(act, 'start', parseInt(e.target.value))}
                                  />
                                  <span className="font-mono text-[10px] font-bold text-slate-600 w-16">{act.startDate}</span>
                                </div>
                                <div className="flex-1 flex items-center space-x-2">
                                  <span className="font-sans text-[10px] text-slate-400 shrink-0">LÍMITE:</span>
                                  <input 
                                    type="range"
                                    min="0"
                                    max="364"
                                    className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                                    value={getDayOfYear(act.endDate)}
                                    onChange={(e) => handleSliderChange(act, 'end', parseInt(e.target.value))}
                                  />
                                  <span className="font-mono text-[10px] font-bold text-slate-600 w-16">{act.endDate}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveActivityEditId(null)}
                              className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold"
                            >
                              Hecho
                            </button>
                          </div>
                        ) : (
                          /* Standard activity bar */
                          <div 
                            className={`absolute h-5 rounded-md shadow-sm border flex items-center px-2 text-[9px] font-sans font-semibold text-white transition-all ${
                              getProgressColor(act.progress).bg
                            } ${getProgressColor(act.progress).border}`}
                            style={actLayout}
                            title={`${act.name}: ${act.startDate} a ${act.endDate}`}
                          >
                            <span className="truncate mr-1">{act.responsible}</span>
                            <span className="font-mono text-[8px] opacity-75">({act.progress}%)</span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Strategic Milestones (Hitos Importantes) Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Flag className="h-5 w-5 text-amber-500" />
          <h3 className="font-sans font-bold text-sm text-slate-900">Hitos Estratégicos del Proyecto 2026</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {hitos.map(hito => (
            <div key={hito.name} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    hito.type === 'success' ? 'bg-emerald-500' :
                    hito.type === 'danger' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}></span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{hito.date}</span>
                </div>
                <h4 className="font-sans font-bold text-xs text-slate-800">{hito.name}</h4>
              </div>
              <p className="font-sans text-[10px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                {hito.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
