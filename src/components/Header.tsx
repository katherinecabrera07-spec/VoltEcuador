import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Check, Trash2, Calendar } from 'lucide-react';
import { Alert } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onClearAllAlerts: () => void;
  userEmail?: string;
}

export default function Header({ 
  setSidebarOpen, 
  alerts, 
  onMarkAsRead, 
  onClearAllAlerts,
  userEmail = 'katherine.cabrera07@ucuenca.edu.ec'
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const unreadAlerts = alerts.filter(a => !a.read);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAlertBgClass = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-rose-50 border-rose-100 text-rose-800';
      case 'warning': return 'bg-amber-50 border-amber-100 text-amber-800';
      case 'success': return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      default: return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  const getAlertTagClass = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-rose-500 text-white';
      case 'warning': return 'bg-amber-500 text-slate-900';
      case 'success': return 'bg-emerald-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-20 flex items-center justify-between px-6 shadow-sm">
      {/* Left side: Hamburger and Section Name */}
      <div className="flex items-center space-x-4">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <span className="font-mono text-xs text-blue-600 font-semibold tracking-wider block">DEPARTAMENTO DE MARKETING</span>
          <span className="font-sans text-lg font-bold text-slate-900">Plan de Estrategias y Ejecución 2026</span>
        </div>
      </div>

      {/* Right side: Alerts & Profile */}
      <div className="flex items-center space-x-4">
        {/* Date tracker */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="font-mono text-xs text-slate-600 font-medium">Junio, 2026</span>
        </div>

        {/* Notifications Icon and dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            id="alerts-dropdown-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 transition-all relative"
          >
            <Bell className="h-5 w-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-[10px] font-sans font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-sm text-slate-900">Alertas Inteligentes</h3>
                  <p className="font-sans text-xs text-slate-500">{unreadAlerts.length} alertas sin leer</p>
                </div>
                {alerts.length > 0 && (
                  <button
                    onClick={onClearAllAlerts}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <p className="text-sm">No hay alertas en este momento.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-4 transition-all hover:bg-slate-50/50 flex flex-col space-y-1.5 ${
                        alert.read ? 'opacity-65' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between space-x-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider ${getAlertTagClass(alert.type)}`}>
                          {alert.category}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">{alert.date}</span>
                      </div>
                      <h4 className="font-sans font-semibold text-xs text-slate-900 leading-tight">
                        {alert.title}
                      </h4>
                      <p className="font-sans text-xs text-slate-600 leading-relaxed">
                        {alert.message}
                      </p>
                      {!alert.read && (
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          className="self-end text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 mt-1 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                        >
                          <Check className="h-3 w-3" />
                          <span>Marcar leído</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown info */}
        <div className="flex items-center space-x-3 border-l border-slate-100 pl-4">
          <div className="bg-blue-50 border border-blue-100 h-10 w-10 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <p className="font-sans text-xs font-bold text-slate-900">Katherine Cabrera</p>
            <p className="font-mono text-[9px] text-slate-400 tracking-tight">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
