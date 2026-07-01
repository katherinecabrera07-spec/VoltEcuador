import React from 'react';
import { 
  BarChart3, 
  Target, 
  ListTodo, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  FileText, 
  Bell, 
  X,
  Menu,
  Award,
  Compass
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  unreadAlertsCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, unreadAlertsCount }: SidebarProps) {
  const menuItems = [
    { id: 'resumen', label: 'Resumen Ejecutivo', icon: BarChart3 },
    { id: 'analisis-estrategico', label: 'Análisis Estratégico', icon: Compass },
    { id: 'objetivo-general', label: 'Objetivo General', icon: Award },
    { id: 'objetivos-especificos', label: 'Objetivos Específicos', icon: Target },
    { id: 'actividades', label: 'Gestión de Actividades', icon: ListTodo },
    { id: 'kpis', label: 'Gestión de KPIs', icon: TrendingUp },
    { id: 'presupuesto', label: 'Gestión Presupuestaria', icon: DollarSign },
    { id: 'cronograma', label: 'Cronograma Gantt', icon: Clock },
    { id: 'reportes', label: 'Reportes y Análisis', icon: FileText },
  ];


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-100 w-72 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col border-r border-slate-800 shadow-2xl lg:shadow-none`}
      >
        {/* Header/Logo section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg leading-tight tracking-tight text-white">
                Volt<span className="text-blue-500">Ecuador</span>
              </h1>
              <p className="font-mono text-[10px] text-slate-400">CONTROL ESTRATÉGICO</p>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // Close on mobile
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <IconComponent className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'resumen' && unreadAlertsCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-sans font-bold text-[10px] h-5 px-1.5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Corporate footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800/60">
            <p className="font-sans text-xs text-slate-400">Organización</p>
            <p className="font-sans text-sm font-semibold text-slate-200 mt-0.5">VoltEcuador</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[10px] text-slate-500 tracking-wider">SISTEMA EN TIEMPO REAL</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
