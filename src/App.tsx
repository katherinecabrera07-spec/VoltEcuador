import React, { useState, useEffect } from 'react';
import { INITIAL_MARKETING_PLAN } from './data/mockData';
import { DEFAULT_STRATEGIC_ANALYSIS } from './data/defaultStrategicData';
import { 
  GeneralObjective, 
  SpecificObjective, 
  Activity, 
  KPI, 
  Alert, 
  MarketingPlanState,
  PlanStatus,
  StrategicAnalysisState
} from './types';

// Import newly created submodules
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExecutiveSummary from './components/ExecutiveSummary';
import GeneralObjectiveManager from './components/GeneralObjectiveManager';
import SpecificObjectivesManager from './components/SpecificObjectivesManager';
import ActivitiesManager from './components/ActivitiesManager';
import KpiManager from './components/KpiManager';
import BudgetManager from './components/BudgetManager';
import StrategicTimeline from './components/StrategicTimeline';
import ReportsManager from './components/ReportsManager';
import StrategicAnalysisManager from './components/StrategicAnalysisManager';


const LOCAL_STORAGE_KEY = 'mkt_plan_state_v4_pdf';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Global State initialized from localStorage or mockData
  const [state, setState] = useState<MarketingPlanState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.strategicAnalysis) {
          parsed.strategicAnalysis = DEFAULT_STRATEGIC_ANALYSIS;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing saved state', e);
      }
    }
    return {
      ...INITIAL_MARKETING_PLAN,
      strategicAnalysis: DEFAULT_STRATEGIC_ANALYSIS
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // SMART ALERTS RE-TRIGGER ENGINE
  // Automatically detects anomalies, deadline pressures, and budgets, appending alerts
  const triggerSmartAlert = (title: string, message: string, type: 'info' | 'warning' | 'danger' | 'success', category: 'presupuesto' | 'vencimiento' | 'retraso' | 'general') => {
    const newAlert: Alert = {
      id: `alt-${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString().split('T')[0],
      read: false,
      category
    };
    setState(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts]
    }));
  };

  // 1. General Objective Handlers
  const handleUpdateGeneralObjective = (updated: GeneralObjective) => {
    setState(prev => ({
      ...prev,
      generalObjective: updated
    }));
    triggerSmartAlert(
      'Objetivo General Actualizado',
      `El objetivo estratégico general ha sido redefinido a: "${updated.name}" por ${updated.responsible}.`,
      'info',
      'general'
    );
  };

  // 2. Specific Objectives Handlers
  const handleAddSpecificObjective = (newObj: SpecificObjective) => {
    setState(prev => ({
      ...prev,
      specificObjectives: [...prev.specificObjectives, newObj]
    }));
    triggerSmartAlert(
      'Nuevo Objetivo específico',
      `Se ha incorporado el objetivo "${newObj.name}" con prioridad ${newObj.priority}.`,
      'success',
      'general'
    );
  };

  const handleUpdateSpecificObjective = (updated: SpecificObjective) => {
    setState(prev => ({
      ...prev,
      specificObjectives: prev.specificObjectives.map(o => o.id === updated.id ? updated : o)
    }));
  };

  const handleDeleteSpecificObjective = (id: string) => {
    setState(prev => ({
      ...prev,
      specificObjectives: prev.specificObjectives.filter(o => o.id !== id),
      activities: prev.activities.filter(a => a.specificObjectiveId !== id) // Cascade delete activities
    }));
  };

  // 3. Activities Handlers
  const handleAddActivity = (newAct: Activity) => {
    setState(prev => ({
      ...prev,
      activities: [...prev.activities, newAct]
    }));

    // Trigger alert if budget is high or status is retrasado
    if (newAct.budgetUsed > newAct.budgetAssigned) {
      triggerSmartAlert(
        'Alerta de Sobrecosto Inicial',
        `La actividad "${newAct.name}" fue registrada con un gasto de $${newAct.budgetUsed} superando el asignado de $${newAct.budgetAssigned}.`,
        'warning',
        'presupuesto'
      );
    }
  };

  const handleUpdateActivity = (updated: Activity) => {
    // Find original to verify threshold triggers
    const original = state.activities.find(a => a.id === updated.id);

    setState(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === updated.id ? updated : a)
    }));

    // Alert if budget exceeded just now
    if (original && updated.budgetUsed > updated.budgetAssigned && original.budgetUsed <= original.budgetAssigned) {
      triggerSmartAlert(
        'Presupuesto Excedido',
        `Atención: La actividad "${updated.name}" acaba de exceder su presupuesto asignado de $${updated.budgetAssigned} (Gastado real: $${updated.budgetUsed}).`,
        'danger',
        'presupuesto'
      );
    }

    // Alert if status set to delayed (Retrasado)
    if (original && updated.status === 'Retrasado' && original.status !== 'Retrasado') {
      triggerSmartAlert(
        'Retraso en Actividad',
        `La actividad táctica "${updated.name}" ha sido marcada como RETRASADA por ${updated.responsible}.`,
        'danger',
        'retraso'
      );
    }
  };

  const handleDeleteActivity = (id: string) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id)
    }));
  };

  const handleUpdateActivityDates = (id: string, start: string, end: string) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === id ? { ...a, startDate: start, endDate: end } : a)
    }));
  };

  // 4. KPI Handlers
  const handleAddKpi = (newKpi: KPI) => {
    setState(prev => ({
      ...prev,
      kpis: [...prev.kpis, newKpi]
    }));
  };

  const handleUpdateKpi = (updated: KPI) => {
    const original = state.kpis.find(k => k.id === updated.id);

    setState(prev => ({
      ...prev,
      kpis: prev.kpis.map(k => k.id === updated.id ? updated : k)
    }));

    // Success alert if target achieved just now
    if (original) {
      const nameUpper = updated.name.toUpperCase();
      const isLowerBetter = nameUpper.includes('CAC') || 
                            nameUpper.includes('COST') || 
                            nameUpper.includes('ROTAC') || 
                            nameUpper.includes('ROTACIÓN');
      const achievedNow = isLowerBetter 
        ? (updated.currentValue <= updated.target && original.currentValue > updated.target)
        : (updated.currentValue >= updated.target && original.currentValue < updated.target);

      if (achievedNow) {
        triggerSmartAlert(
          'Meta de KPI Alcanzada',
          `¡Excelente trabajo! Se ha logrado la meta establecida para el KPI "${updated.name}" (${updated.currentValue} de ${updated.target} ${updated.unit}).`,
          'success',
          'general'
        );
      }
    }
  };

  const handleDeleteKpi = (id: string) => {
    setState(prev => ({
      ...prev,
      kpis: prev.kpis.filter(k => k.id !== id)
    }));
  };

  // 5. Budget total annual update
  const handleUpdateAnnualBudget = (amount: number) => {
    setState(prev => ({
      ...prev,
      budgetTotalAnnual: amount
    }));
  };

  // 6. Alerts Notification Center Handlers
  const handleMarkAlertAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === id ? { ...a, read: true } : a)
    }));
  };

  const handleClearAllAlerts = () => {
    setState(prev => ({
      ...prev,
      alerts: []
    }));
  };

  const handleUpdateStrategicAnalysis = (updated: StrategicAnalysisState) => {
    setState(prev => ({
      ...prev,
      strategicAnalysis: updated
    }));
  };


  // Navigation tab component switcher
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <ExecutiveSummary
            generalObjective={state.generalObjective}
            specificObjectives={state.specificObjectives}
            activities={state.activities}
            kpis={state.kpis}
            budgetTotalAnnual={state.budgetTotalAnnual}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'objetivo-general':
        return (
          <GeneralObjectiveManager
            generalObjective={state.generalObjective}
            onUpdate={handleUpdateGeneralObjective}
          />
        );
      case 'objetivos-especificos':
        return (
          <SpecificObjectivesManager
            objectives={state.specificObjectives}
            activities={state.activities}
            onAdd={handleAddSpecificObjective}
            onUpdate={handleUpdateSpecificObjective}
            onDelete={handleDeleteSpecificObjective}
          />
        );
      case 'actividades':
        return (
          <ActivitiesManager
            objectives={state.specificObjectives}
            activities={state.activities}
            onAdd={handleAddActivity}
            onUpdate={handleUpdateActivity}
            onDelete={handleDeleteActivity}
          />
        );
      case 'kpis':
        return (
          <KpiManager
            kpis={state.kpis}
            onAdd={handleAddKpi}
            onUpdate={handleUpdateKpi}
            onDelete={handleDeleteKpi}
          />
        );
      case 'presupuesto':
        return (
          <BudgetManager
            objectives={state.specificObjectives}
            activities={state.activities}
            budgetTotalAnnual={state.budgetTotalAnnual}
            onUpdateAnnualBudget={handleUpdateAnnualBudget}
          />
        );
      case 'cronograma':
        return (
          <StrategicTimeline
            objectives={state.specificObjectives}
            activities={state.activities}
            onUpdateActivityDates={handleUpdateActivityDates}
          />
        );
      case 'reportes':
        return (
          <ReportsManager
            generalObjective={state.generalObjective}
            objectives={state.specificObjectives}
            activities={state.activities}
            kpis={state.kpis}
            budgetTotalAnnual={state.budgetTotalAnnual}
          />
        );
      case 'analisis-estrategico':
        return (
          <StrategicAnalysisManager
            strategicAnalysis={state.strategicAnalysis || DEFAULT_STRATEGIC_ANALYSIS}
            onUpdateStrategicAnalysis={handleUpdateStrategicAnalysis}
            onAddObjective={handleAddSpecificObjective}
            onAddActivity={handleAddActivity}
            onAddKpi={handleAddKpi}
            objectives={state.specificObjectives}
            activities={state.activities}
            kpis={state.kpis}
          />
        );

      default:
        return <div className="text-center py-10">Sección en desarrollo...</div>;
    }
  };

  const unreadAlertsCount = state.alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Layout */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        {/* Header bar */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          alerts={state.alerts}
          onMarkAsRead={handleMarkAlertAsRead}
          onClearAllAlerts={handleClearAllAlerts}
        />

        {/* Content View Workspace wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
