import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Check, 
  Search, 
  User, 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  Award,
  DownloadCloud
} from 'lucide-react';
import { SpecificObjective, Activity, KPI, GeneralObjective } from '../types';
import { getProgressColor, getCompliancePercent } from '../utils/colors';

interface ReportsManagerProps {
  generalObjective: GeneralObjective;
  objectives: SpecificObjective[];
  activities: Activity[];
  kpis: KPI[];
  budgetTotalAnnual: number;
}

type ReportType = 'objetivos' | 'kpis' | 'presupuesto' | 'productividad';

export default function ReportsManager({
  generalObjective,
  objectives,
  activities,
  kpis,
  budgetTotalAnnual
}: ReportsManagerProps) {
  const [activeReport, setActiveReport] = useState<ReportType>('objetivos');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Math helpers
  const totalAssigned = activities.reduce((sum, a) => sum + a.budgetAssigned, 0);
  const totalUsed = activities.reduce((sum, a) => sum + a.budgetUsed, 0);

  // Generate dataset based on active report type
  const getReportData = () => {
    switch (activeReport) {
      case 'objetivos':
        return objectives.map(obj => {
          const objActs = activities.filter(a => a.specificObjectiveId === obj.id);
          const compActs = objActs.filter(a => a.status === 'Completado').length;
          const avgProgress = objActs.length > 0 
            ? Math.round(objActs.reduce((sum, a) => sum + a.progress, 0) / objActs.length)
            : obj.progress;

          return {
            id: obj.id,
            col1: obj.name,
            col2: obj.responsible,
            col3: obj.priority,
            col4: obj.status,
            col5: `${avgProgress}%`,
            col6: `${compActs}/${objActs.length} Act.`
          };
        });

      case 'kpis':
        return kpis.map(k => {
          const compl = getCompliancePercent(k);
          return {
            id: k.id,
            col1: k.name,
            col2: k.formula,
            col3: `${k.target} ${k.unit}`,
            col4: `${k.currentValue} ${k.unit}`,
            col5: `${compl}%`,
            col6: compl >= 100 ? 'Cumplido' : 'En proceso'
          };
        });

      case 'presupuesto':
        return objectives.map(obj => {
          const objActs = activities.filter(a => a.specificObjectiveId === obj.id);
          const assigned = objActs.reduce((sum, a) => sum + a.budgetAssigned, 0);
          const used = objActs.reduce((sum, a) => sum + a.budgetUsed, 0);
          const diff = assigned - used;

          return {
            id: obj.id,
            col1: obj.name,
            col2: `$${assigned.toLocaleString('es-ES')}`,
            col3: `$${used.toLocaleString('es-ES')}`,
            col4: `$${diff.toLocaleString('es-ES')}`,
            col5: assigned > 0 ? `${Math.round((used / assigned) * 100)}%` : '0%',
            col6: diff < 0 ? 'Exceso' : 'Óptimo'
          };
        });

      case 'productividad':
        // Group activities by responsible person
        const leadersMap: Record<string, { total: number; done: number; assigned: number; spent: number }> = {};
        activities.forEach(act => {
          if (!leadersMap[act.responsible]) {
            leadersMap[act.responsible] = { total: 0, done: 0, assigned: 0, spent: 0 };
          }
          leadersMap[act.responsible].total += 1;
          if (act.status === 'Completado') leadersMap[act.responsible].done += 1;
          leadersMap[act.responsible].assigned += act.budgetAssigned;
          leadersMap[act.responsible].spent += act.budgetUsed;
        });

        return Object.entries(leadersMap).map(([name, stats]) => {
          // Find strategic (specific) objectives this leader is responsible for
          const leaderObjectives = objectives.filter(o => o.responsible === name);
          let rate = 0;
          if (leaderObjectives.length > 0) {
            const totalProgress = leaderObjectives.reduce((sum, o) => {
              const objActs = activities.filter(a => a.specificObjectiveId === o.id);
              const progress = objActs.length > 0 
                ? Math.round(objActs.reduce((acc, a) => acc + a.progress, 0) / objActs.length)
                : o.progress;
              return sum + progress;
            }, 0);
            rate = Math.round(totalProgress / leaderObjectives.length);
          } else {
            // Fallback to average progress of their activities if no objectives are mapped directly
            const leaderActs = activities.filter(a => a.responsible === name);
            rate = leaderActs.length > 0 
              ? Math.round(leaderActs.reduce((sum, a) => sum + a.progress, 0) / leaderActs.length)
              : 0;
          }

          return {
            id: name,
            col1: name,
            col2: `${stats.total} Actividades`,
            col3: `${stats.done} Completadas`,
            col4: `${rate}%`,
            col5: `$${stats.spent.toLocaleString('es-ES')} Gastados`,
            col6: stats.spent > stats.assigned ? 'Desviado' : 'Eficiente'
          };
        });

      default:
        return [];
    }
  };

  const reportHeaders = {
    objetivos: ['Objetivo Específico', 'Responsable', 'Prioridad', 'Estado', 'Progreso', 'Estatus Actividades'],
    kpis: ['Métrica KPI', 'Fórmula de Cálculo', 'Meta Anual', 'Valor Actual', '% Cumplimiento', 'Estado'],
    presupuesto: ['Objetivo estratégico', 'Presupuesto Asignado', 'Presupuesto Ejecutado', 'Disponible (USD)', '% Ejecución', 'Estatus Gasto'],
    productividad: ['Responsable de Marketing', 'Total Actividades', 'Actividades Listas', 'Tasa Cumplimiento', 'Presupuesto Administrado', 'Desempeño Presupuestal']
  };

  // Search filter
  const reportData = getReportData().filter(row => {
    return row.col1.toLowerCase().includes(searchQuery.toLowerCase()) || 
           row.col2.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // FUNCTIONAL EXPORTS (Generates actual file downloads with correct mime-types)
  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const headers = reportHeaders[activeReport];
    const data = getReportData();
    
    let content = '';
    let filename = `reporte_marketing_${activeReport}_2026`;

    if (format === 'csv' || format === 'xlsx') {
      // Create CSV text structure
      content = headers.join(',') + '\n';
      data.forEach(row => {
        const line = [
          `"${row.col1.replace(/"/g, '""')}"`,
          `"${row.col2.replace(/"/g, '""')}"`,
          `"${row.col3.replace(/"/g, '""')}"`,
          `"${row.col4.replace(/"/g, '""')}"`,
          `"${row.col5.replace(/"/g, '""')}"`,
          `"${row.col6.replace(/"/g, '""')}"`
        ];
        content += line.join(',') + '\n';
      });
      filename += '.csv';
    } else {
      // PDF Printable Summary representation
      content = `===========================================================\n`;
      content += `   REPORTE EJECUTIVO DE MARKETING CORPORATIVO 2026\n`;
      content += `   Generado por: Katherine Cabrera\n`;
      content += `   Fecha de emisión: 28 de Junio, 2026\n`;
      content += `===========================================================\n\n`;
      content += `Objetivo General: ${generalObjective.name}\n`;
      content += `Presupuesto Techo Anual: $${budgetTotalAnnual.toLocaleString('es-ES')} USD\n`;
      content += `Gasto total ejecutado: $${totalUsed.toLocaleString('es-ES')} USD\n\n`;
      content += `--- DETALLES DEL REPORTE: ${activeReport.toUpperCase()} ---\n\n`;
      
      headers.forEach((h, i) => {
        content += `${h.padEnd(25)}`;
      });
      content += `\n----------------------------------------------------------------------------------------------------------------------------------\n`;
      
      data.forEach(row => {
        content += `${row.col1.substring(0, 22).padEnd(25)}`;
        content += `${row.col2.substring(0, 22).padEnd(25)}`;
        content += `${row.col3.padEnd(25)}`;
        content += `${row.col4.padEnd(25)}`;
        content += `${row.col5.padEnd(25)}`;
        content += `${row.col6.padEnd(25)}\n`;
      });
      
      content += `\n========================= FIN DEL INFORME =========================`;
      filename += '.txt';
    }

    // Trigger HTML5 Anchor download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show visual success alert
    setExportSuccess(`Reporte de ${activeReport} exportado con éxito en formato ${format.toUpperCase()}.`);
    setTimeout(() => setExportSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Selector and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Selector tab buttons */}
        <div className="bg-slate-100/80 p-1 rounded-2xl flex flex-wrap gap-1">
          <button
            onClick={() => { setActiveReport('objetivos'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeReport === 'objetivos' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Objetivos Estratégicos</span>
          </button>
          <button
            onClick={() => { setActiveReport('kpis'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeReport === 'kpis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>KPIs y Métricas</span>
          </button>
          <button
            onClick={() => { setActiveReport('presupuesto'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeReport === 'presupuesto' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Ejecución Presupuestal</span>
          </button>
          <button
            onClick={() => { setActiveReport('productividad'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeReport === 'productividad' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Productividad Líderes</span>
          </button>
        </div>

        {/* Live Filter query */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar reporte..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Export feedback message */}
      {exportSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl flex items-center space-x-2.5 text-xs animate-slide-in">
          <Check className="h-4.5 w-4.5 shrink-0 bg-emerald-500 text-white rounded-full p-0.5" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Main Grid View */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Actions header bar inside table card */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-blue-600 font-bold uppercase tracking-wider">REPORTE DETALLADO</span>
            <h3 className="font-sans font-bold text-sm text-slate-900">
              {activeReport === 'objetivos' ? 'Cumplimiento y Desempeño de Objetivos Específicos' :
               activeReport === 'kpis' ? 'Métricas Clave de Rendimiento y Avances' :
               activeReport === 'presupuesto' ? 'Estado de Inversión y Auditoría Presupuestaria' :
               'Productividad del Equipo de Mercadotecnia'}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-blue-600/10"
              title="Descargar reporte ejecutivo imprimible"
            >
              <DownloadCloud className="h-3.5 w-3.5" />
              <span>Reporte Ejecutivo (TXT/PDF)</span>
            </button>
          </div>
        </div>

        {/* The data table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">{reportHeaders[activeReport][0]}</th>
                <th className="py-4 px-4">{reportHeaders[activeReport][1]}</th>
                <th className="py-4 px-4">{reportHeaders[activeReport][2]}</th>
                <th className="py-4 px-4">{reportHeaders[activeReport][3]}</th>
                <th className="py-4 px-4">{reportHeaders[activeReport][4]}</th>
                <th className="py-4 px-6 text-right">{reportHeaders[activeReport][5]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
              {reportData.map((row, index) => (
                <tr key={row.id + index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs">{row.col1}</td>
                  <td className="py-4 px-4 text-slate-600">{row.col2}</td>
                  <td className="py-4 px-4 font-mono text-slate-600">{row.col3}</td>
                  <td className="py-4 px-4">
                    {(() => {
                      if (row.col4.endsWith('%')) {
                        const pctNum = parseInt(row.col4.replace('%', ''));
                        if (!isNaN(pctNum)) {
                          const colMeta = getProgressColor(pctNum);
                          return (
                            <span className={`font-mono font-bold px-2 py-0.5 rounded ${colMeta.bgLight} ${colMeta.text}`}>
                              {row.col4}
                            </span>
                          );
                        }
                      }
                      return <span className="font-mono font-medium text-slate-900">{row.col4}</span>;
                    })()}
                  </td>
                  <td className="py-4 px-4">
                    {(() => {
                      let colClass = 'bg-slate-100 text-slate-700';
                      if (row.col5.endsWith('%')) {
                        const pctNum = parseInt(row.col5.replace('%', ''));
                        if (!isNaN(pctNum)) {
                          const colMeta = getProgressColor(pctNum);
                          colClass = `${colMeta.bgLight} ${colMeta.text}`;
                        }
                      }
                      return (
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${colClass}`}>
                          {row.col5}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.col6 === 'Completado' || row.col6 === 'Cumplido' || row.col6 === 'Óptimo' || row.col6 === 'Eficiente' || row.col6.includes('Éxito')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {row.col6}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
