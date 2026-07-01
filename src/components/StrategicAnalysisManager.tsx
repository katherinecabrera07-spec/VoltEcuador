import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  FileText, 
  Layers, 
  BarChart, 
  PieChart, 
  Activity as ActivityIcon,
  Shield, 
  Target, 
  Zap, 
  Check, 
  X,
  Grid3X3, 
  Award,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell as RechartsCell, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  StrategicAnalysisState, 
  SwotFactor, 
  SwotStrategy, 
  PeyeaFactor, 
  MckinseyUnit, 
  CompetitivenessUnit, 
  SpecificObjective, 
  Activity, 
  KPI, 
  Priority, 
  PlanStatus 
} from '../types';
import { getProgressColor } from '../utils/colors';

interface StrategicAnalysisManagerProps {
  strategicAnalysis: StrategicAnalysisState;
  onUpdateStrategicAnalysis: (updated: StrategicAnalysisState) => void;
  onAddObjective: (obj: SpecificObjective) => void;
  onAddActivity: (act: Activity) => void;
  onAddKpi: (kpi: KPI) => void;
  objectives: SpecificObjective[];
  activities: Activity[];
  kpis: KPI[];
}

type SubTab = 'general' | 'foda' | 'efi' | 'efe' | 'matriz-ie' | 'peyea' | 'mckinsey' | 'atractivo' | 'gran-estrategia' | 'diagnostico';

export default function StrategicAnalysisManager({
  strategicAnalysis,
  onUpdateStrategicAnalysis,
  onAddObjective,
  onAddActivity,
  onAddKpi,
  objectives,
  activities,
  kpis
}: StrategicAnalysisManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('general');
  const [editingFactor, setEditingFactor] = useState<SwotFactor | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<SwotStrategy | null>(null);
  const [inlineEditingStrategyId, setInlineEditingStrategyId] = useState<string | null>(null);
  const [inlineStrategyTitle, setInlineStrategyTitle] = useState('');
  const [inlineStrategyDesc, setInlineStrategyDesc] = useState('');
  const [editingMckinsey, setEditingMckinsey] = useState<MckinseyUnit | null>(null);
  const [editingCompetitiveness, setEditingCompetitiveness] = useState<CompetitivenessUnit | null>(null);

  // States for custom IE Analysis and Strategy edit
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isEditingIeAnalysis, setIsEditingIeAnalysis] = useState(false);
  const [ieAnalysisEditVal, setIeAnalysisEditVal] = useState('');
  const [isEditingIeStrategy, setIsEditingIeStrategy] = useState(false);
  const [ieStrategyEditVal, setIeStrategyEditVal] = useState('');

  // Form states
  const [factorText, setFactorText] = useState('');
  const [factorType, setFactorType] = useState<SwotFactor['type']>('fortaleza');
  const [factorWeight, setFactorWeight] = useState<string | number>('0.1');
  const [factorRating, setFactorRating] = useState(3);
  const [factorArea, setFactorArea] = useState<SwotFactor['area']>('Marketing');

  // Form states for local inline addition inside EFI
  const [internalText, setInternalText] = useState('');
  const [internalType, setInternalType] = useState<'fortaleza' | 'debilidad'>('fortaleza');
  const [internalArea, setInternalArea] = useState<SwotFactor['area']>('Marketing');
  const [internalWeight, setInternalWeight] = useState<string | number>('0.10');
  const [internalRating, setInternalRating] = useState(3);

  // Form states for local inline addition inside EFE
  const [externalText, setExternalText] = useState('');
  const [externalType, setExternalType] = useState<'oportunidad' | 'amenaza'>('oportunidad');
  const [externalArea, setExternalArea] = useState<SwotFactor['area']>('Marketing');
  const [externalWeight, setExternalWeight] = useState<string | number>('0.10');
  const [externalRating, setExternalRating] = useState(3);

  const [stratType, setStratType] = useState<SwotStrategy['type']>('FO');
  const [stratTitle, setStratTitle] = useState('');
  const [stratDesc, setStratDesc] = useState('');

  const [mckName, setMckName] = useState('');
  const [mckAttr, setMckAttr] = useState(3.5);
  const [mckStrength, setMckStrength] = useState(3.5);
  const [mckShare, setMckShare] = useState(25);

  const [compName, setCompName] = useState('');
  const [compAttr, setCompAttr] = useState(3.5);
  const [compStrength, setCompStrength] = useState(3.5);

  // Helper to mark changes and update date
  const triggerUpdate = (updated: StrategicAnalysisState) => {
    onUpdateStrategicAnalysis({
      ...updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  // --- FODA FACTOR ACTIONS ---
  const handleAddOrEditFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorText.trim()) return;

    if (editingFactor) {
      const updatedFactors = strategicAnalysis.swotFactors.map(f => 
        f.id === editingFactor.id 
          ? { ...f, text: factorText, type: factorType, weight: factorWeight, rating: factorRating, area: factorArea } 
          : f
      );
      triggerUpdate({ ...strategicAnalysis, swotFactors: updatedFactors });
      setEditingFactor(null);
    } else {
      const newFactor: SwotFactor = {
        id: `fct-${Date.now()}`,
        text: factorText,
        type: factorType,
        weight: factorWeight,
        rating: factorRating,
        area: factorArea
      };
      triggerUpdate({ ...strategicAnalysis, swotFactors: [...strategicAnalysis.swotFactors, newFactor] });
    }
    setFactorText('');
  };

  const handleDeleteFactor = (id: string) => {
    const updated = strategicAnalysis.swotFactors.filter(f => f.id !== id);
    triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
  };

  // --- SWOT STRATEGIES ---
  const handleAddOrEditStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stratTitle.trim() || !stratDesc.trim()) return;

    if (editingStrategy) {
      const updated = strategicAnalysis.swotStrategies.map(s => 
        s.id === editingStrategy.id ? { ...s, type: stratType, title: stratTitle, description: stratDesc } : s
      );
      triggerUpdate({ ...strategicAnalysis, swotStrategies: updated });
      setEditingStrategy(null);
    } else {
      const newStrat: SwotStrategy = {
        id: `str-${Date.now()}`,
        type: stratType,
        title: stratTitle,
        description: stratDesc
      };
      triggerUpdate({ ...strategicAnalysis, swotStrategies: [...strategicAnalysis.swotStrategies, newStrat] });
    }
    setStratTitle('');
    setStratDesc('');
  };

  const handleDeleteStrategy = (id: string) => {
    const updated = strategicAnalysis.swotStrategies.filter(s => s.id !== id);
    triggerUpdate({ ...strategicAnalysis, swotStrategies: updated });
    if (inlineEditingStrategyId === id) {
      setInlineEditingStrategyId(null);
    }
  };

  const handleSaveInlineStrategy = (id: string) => {
    if (!inlineStrategyTitle.trim() || !inlineStrategyDesc.trim()) return;
    const updated = strategicAnalysis.swotStrategies.map(s => 
      s.id === id ? { ...s, title: inlineStrategyTitle.trim(), description: inlineStrategyDesc.trim() } : s
    );
    triggerUpdate({ ...strategicAnalysis, swotStrategies: updated });
    setInlineEditingStrategyId(null);
  };

  // Inline factor updates
  const handleUpdateFactorWeight = (id: string, weight: number) => {
    const updated = strategicAnalysis.swotFactors.map(f => f.id === id ? { ...f, weight } : f);
    triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
  };

  const handleUpdateFactorRating = (id: string, rating: number) => {
    const updated = strategicAnalysis.swotFactors.map(f => f.id === id ? { ...f, rating } : f);
    triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
  };

  const handleUpdateFactorText = (id: string, text: string) => {
    const updated = strategicAnalysis.swotFactors.map(f => f.id === id ? { ...f, text } : f);
    triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
  };

  const handleUpdateFactorArea = (id: string, area: SwotFactor['area']) => {
    const updated = strategicAnalysis.swotFactors.map(f => f.id === id ? { ...f, area } : f);
    triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
  };

  // Normalization helper
  const handleNormalizeWeights = (type: 'internal' | 'external') => {
    const targets = type === 'internal' ? ['fortaleza', 'debilidad'] : ['oportunidad', 'amenaza'];
    const subFactors = strategicAnalysis.swotFactors.filter(f => targets.includes(f.type));
    const sum = subFactors.reduce((s, f) => s + f.weight, 0);
    if (sum === 0) return;
    
    const updated = strategicAnalysis.swotFactors.map(f => {
      if (targets.includes(f.type)) {
        return { ...f, weight: parseFloat((f.weight / sum).toFixed(2)) };
      }
      return f;
    });

    // Adjust small decimal errors
    const adjustedSubFactors = updated.filter(f => targets.includes(f.type));
    const newSum = adjustedSubFactors.reduce((s, f) => s + f.weight, 0);
    const diff = parseFloat((1.0 - newSum).toFixed(2));
    if (diff !== 0 && adjustedSubFactors.length > 0) {
      const lastId = adjustedSubFactors[adjustedSubFactors.length - 1].id;
      const finalUpdated = updated.map(f => {
        if (f.id === lastId) {
          return { ...f, weight: parseFloat((f.weight + diff).toFixed(2)) };
        }
        return f;
      });
      triggerUpdate({ ...strategicAnalysis, swotFactors: finalUpdated });
    } else {
      triggerUpdate({ ...strategicAnalysis, swotFactors: updated });
    }
  };

  // --- EFI CALCULATIONS ---
  const efiFactors = strategicAnalysis.swotFactors.filter(f => f.type === 'fortaleza' || f.type === 'debilidad');
  const efiWeightSum = efiFactors.reduce((sum, f) => sum + f.weight, 0);
  // Normalize automatically on the fly if weights don't sum to exactly 1.0 to ensure standard 1.0 - 4.0 scale
  const efiWeightedTotal = efiFactors.reduce((sum, f) => {
    const normalizedWeight = efiWeightSum > 0 ? (f.weight / efiWeightSum) : 0;
    return sum + (normalizedWeight * f.rating);
  }, 0);

  // Interpretation for EFI
  const getEfiStatus = (val: number) => {
    if (val < 2.5) return { text: 'Débil', color: 'text-rose-600 bg-rose-50 border-rose-200', scoreColor: 'text-rose-600' };
    if (val === 2.5) return { text: 'Promedio', color: 'text-amber-600 bg-amber-50 border-amber-200', scoreColor: 'text-amber-600' };
    return { text: 'Fuerte', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', scoreColor: 'text-emerald-600' };
  };
  const efiStatus = getEfiStatus(efiWeightedTotal);

  // --- EFE CALCULATIONS ---
  const efeFactors = strategicAnalysis.swotFactors.filter(f => f.type === 'oportunidad' || f.type === 'amenaza');
  const efeWeightSum = efeFactors.reduce((sum, f) => sum + f.weight, 0);
  // Normalize automatically on the fly if weights don't sum to exactly 1.0 to ensure standard 1.0 - 4.0 scale
  const efeWeightedTotal = efeFactors.reduce((sum, f) => {
    const normalizedWeight = efeWeightSum > 0 ? (f.weight / efeWeightSum) : 0;
    return sum + (normalizedWeight * f.rating);
  }, 0);

  // Interpretation for EFE
  const getEfeStatus = (val: number) => {
    if (val < 2.5) return { text: 'Desfavorable', color: 'text-rose-600 bg-rose-50 border-rose-200', scoreColor: 'text-rose-600' };
    if (val === 2.5) return { text: 'Promedio', color: 'text-amber-600 bg-amber-50 border-amber-200', scoreColor: 'text-amber-600' };
    return { text: 'Favorable', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', scoreColor: 'text-emerald-600' };
  };
  const efeStatus = getEfeStatus(efeWeightedTotal);

  // --- IE MATRIX (3x3) QUADRANT CALCULATION ---
  const getIeQuadrant = (efi: number, efe: number) => {
    // EFI columns: Fuerte (3.0 - 4.0), Media/Promedio (2.0 - 2.99), Débil (1.0 - 1.99)
    const efiCol = efi < 2.0 ? 'Débil' : efi < 3.0 ? 'Media' : 'Fuerte';
    // EFE rows: Alta (3.0 - 4.0), Media (2.0 - 2.99), Baja (1.0 - 1.99)
    const efeRow = efe < 2.0 ? 'Baja' : efe < 3.0 ? 'Media' : 'Alta';

    let cell = '';
    let region = '';
    let recs: string[] = [];

    if (efeRow === 'Alta') {
      if (efiCol === 'Fuerte') {
        cell = 'I';
        region = 'Crecer y construir';
        recs = ['Penetración de mercado', 'Desarrollo de mercado', 'Desarrollo de productos', 'Integración vertical', 'Integración horizontal'];
      } else if (efiCol === 'Media') {
        cell = 'II';
        region = 'Crecer y construir';
        recs = ['Penetración de mercado', 'Desarrollo de mercado', 'Desarrollo de productos', 'Integración vertical', 'Integración horizontal'];
      } else {
        cell = 'III';
        region = 'Mantener y sostener';
        recs = ['Optimización operativa', 'Incremento de eficiencia', 'Fortalecimiento comercial'];
      }
    } else if (efeRow === 'Media') {
      if (efiCol === 'Fuerte') {
        cell = 'IV';
        region = 'Crecer y construir';
        recs = ['Penetración de mercado', 'Desarrollo de mercado', 'Desarrollo de productos', 'Integración vertical', 'Integración horizontal'];
      } else if (efiCol === 'Media') {
        cell = 'V';
        region = 'Mantener y sostener';
        recs = ['Optimización operativa', 'Incremento de eficiencia', 'Fortalecimiento comercial'];
      } else {
        cell = 'VI';
        region = 'Cosechar o desinvestir';
        recs = ['Reducción de costos', 'Reestructuración', 'Eliminación de líneas poco rentables'];
      }
    } else { // Baja
      if (efiCol === 'Fuerte') {
        cell = 'VII';
        region = 'Mantener y sostener';
        recs = ['Optimización operativa', 'Incremento de eficiencia', 'Fortalecimiento comercial'];
      } else if (efiCol === 'Media') {
        cell = 'VIII';
        region = 'Cosechar o desinvestir';
        recs = ['Reducción de costos', 'Reestructuración', 'Eliminación de líneas poco rentables'];
      } else {
        cell = 'IX';
        region = 'Cosechar o desinvestir';
        recs = ['Reducción de costos', 'Reestructuración', 'Eliminación de líneas poco rentables'];
      }
    }

    return { cell, region, recs, col: efiCol, row: efeRow };
  };

  const ieResult = getIeQuadrant(efiWeightedTotal, efeWeightedTotal);

  // --- PEYEA (SPACE) CALCULATIONS ---
  const handleUpdatePeyeaScore = (id: string, score: number) => {
    const updatedFactors = strategicAnalysis.peyeaFactors.map(f => 
      f.id === id ? { ...f, score } : f
    );
    triggerUpdate({ ...strategicAnalysis, peyeaFactors: updatedFactors });
  };

  const getPeyeaCoordsAndQuadrant = () => {
    const pFactors = strategicAnalysis.peyeaFactors;
    const ff = pFactors.filter(f => f.dimension === 'FF');
    const vc = pFactors.filter(f => f.dimension === 'VC');
    const fi = pFactors.filter(f => f.dimension === 'FI');
    const ee = pFactors.filter(f => f.dimension === 'EE');

    const ffAvg = ff.length > 0 ? ff.reduce((sum, f) => sum + f.score, 0) / ff.length : 0;
    const vcAvg = vc.length > 0 ? vc.reduce((sum, f) => sum + f.score, 0) / vc.length : 0;
    const fiAvg = fi.length > 0 ? fi.reduce((sum, f) => sum + f.score, 0) / fi.length : 0;
    const eeAvg = ee.length > 0 ? ee.reduce((sum, f) => sum + f.score, 0) / ee.length : 0;

    // VC and EE should have negative values in PEYEA convention
    // Coords: X = FI + VC; Y = FF + EE
    const xCoord = parseFloat((fiAvg + vcAvg).toFixed(2));
    const yCoord = parseFloat((ffAvg + eeAvg).toFixed(2));

    let position: 'Agresiva' | 'Competitiva' | 'Conservadora' | 'Defensiva' = 'Defensiva';
    if (xCoord >= 0 && yCoord >= 0) position = 'Agresiva';
    else if (xCoord >= 0 && yCoord < 0) position = 'Competitiva';
    else if (xCoord < 0 && yCoord >= 0) position = 'Conservadora';
    else position = 'Defensiva';

    return { x: xCoord, y: yCoord, position, ffAvg, vcAvg, fiAvg, eeAvg };
  };

  const peyeaResult = getPeyeaCoordsAndQuadrant();

  // --- MCKINSEY GE ACTIONS & CALCULATIONS ---
  const handleAddOrEditMckinseyUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mckName.trim()) return;

    if (editingMckinsey) {
      const updated = strategicAnalysis.mckinseyUnits.map(u => 
        u.id === editingMckinsey.id 
          ? { ...u, name: mckName, industryAttractiveness: mckAttr, competitiveStrength: mckStrength, marketShare: mckShare } 
          : u
      );
      triggerUpdate({ ...strategicAnalysis, mckinseyUnits: updated });
      setEditingMckinsey(null);
    } else {
      const newUnit: MckinseyUnit = {
        id: `mck-${Date.now()}`,
        name: mckName,
        industryAttractiveness: mckAttr,
        competitiveStrength: mckStrength,
        marketShare: mckShare
      };
      triggerUpdate({ ...strategicAnalysis, mckinseyUnits: [...strategicAnalysis.mckinseyUnits, newUnit] });
    }
    setMckName('');
  };

  const handleDeleteMckinseyUnit = (id: string) => {
    const updated = strategicAnalysis.mckinseyUnits.filter(u => u.id !== id);
    triggerUpdate({ ...strategicAnalysis, mckinseyUnits: updated });
  };

  const getMcKinseyClassification = (attr: number, strength: number) => {
    if (attr >= 3.6 && strength >= 3.6) return { text: 'Invertir y Crecer', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' };
    if (attr >= 3.6 || strength >= 3.6) {
      if (attr >= 2.5 && strength >= 2.5) return { text: 'Seleccionar e Invertir', color: 'bg-blue-50 border-blue-200 text-blue-800' };
    }
    if (attr >= 2.5 && strength >= 2.5) return { text: 'Mantener', color: 'bg-amber-50 border-amber-200 text-amber-800' };
    if (attr < 2.5 && strength >= 3.6) return { text: 'Cosechar', color: 'bg-orange-50 border-orange-200 text-orange-800' };
    return { text: 'Desinvertir', color: 'bg-rose-50 border-rose-200 text-rose-800' };
  };

  // McKinsey Overall Averages
  const mckUnits = strategicAnalysis.mckinseyUnits;
  const avgMckAttr = mckUnits.length > 0 
    ? mckUnits.reduce((sum, u) => sum + u.industryAttractiveness, 0) / mckUnits.length 
    : 2.85; // default
  const avgMckStrength = mckUnits.length > 0 
    ? mckUnits.reduce((sum, u) => sum + u.competitiveStrength, 0) / mckUnits.length 
    : 2.75; // default

  const getMcKinseyRegion = (attr: number, strength: number) => {
    const attrCat = attr >= 3.6 ? 'Alta' : attr >= 2.5 ? 'Media' : 'Baja';
    const strengthCat = strength >= 3.6 ? 'Fuerte' : strength >= 2.5 ? 'Media' : 'Débil';

    if (attrCat === 'Alta') {
      if (strengthCat === 'Fuerte' || strengthCat === 'Media') return 'Crecer y construir';
      return 'Mantener y sostener';
    } else if (attrCat === 'Media') {
      if (strengthCat === 'Fuerte') return 'Crecer y construir';
      if (strengthCat === 'Media') return 'Mantener y sostener';
      return 'Cosechar o desinvestir';
    } else { // Baja
      if (strengthCat === 'Fuerte') return 'Mantener y sostener';
      return 'Cosechar o desinvestir';
    }
  };

  const mckRegion = getMcKinseyRegion(avgMckAttr, avgMckStrength);

  const getPeyeaEquivalentRegion = (pos: string) => {
    if (pos === 'Agresiva') return 'Crecer y construir';
    if (pos === 'Competitiva' || pos === 'Conservadora' || pos === 'Defensiva') return 'Mantener y sostener';
    return 'Cosechar o desinvestir';
  };

  const peyeaEquivalentRegion = getPeyeaEquivalentRegion(peyeaResult.position);

  const isIeMckAligned = ieResult.region === mckRegion;
  const isIePeyeaAligned = ieResult.region === peyeaEquivalentRegion;
  const isMckPeyeaAligned = mckRegion === peyeaEquivalentRegion;

  const isAllAligned = isIeMckAligned && isIePeyeaAligned;

  // --- ATTRACTIVENESS - COMPETITIVENESS ACTIONS ---
  const handleAddOrEditCompetitivenessUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;

    if (editingCompetitiveness) {
      const updated = strategicAnalysis.competitivenessUnits.map(u => 
        u.id === editingCompetitiveness.id 
          ? { ...u, name: compName, marketAttractiveness: compAttr, businessCompetitiveness: compStrength } 
          : u
      );
      triggerUpdate({ ...strategicAnalysis, competitivenessUnits: updated });
      setEditingCompetitiveness(null);
    } else {
      const newUnit: CompetitivenessUnit = {
        id: `cmp-${Date.now()}`,
        name: compName,
        marketAttractiveness: compAttr,
        businessCompetitiveness: compStrength
      };
      triggerUpdate({ ...strategicAnalysis, competitivenessUnits: [...strategicAnalysis.competitivenessUnits, newUnit] });
    }
    setCompName('');
  };

  const handleDeleteCompetitivenessUnit = (id: string) => {
    const updated = strategicAnalysis.competitivenessUnits.filter(u => u.id !== id);
    triggerUpdate({ ...strategicAnalysis, competitivenessUnits: updated });
  };

  const getCompetitivenessRec = (attr: number, strength: number) => {
    if (attr >= 3.5 && strength >= 3.5) return 'Inversión y Expansión Prioritaria';
    if (attr >= 2.5 && strength >= 2.5) return 'Mantenimiento y Reposicionamiento Selectivo';
    if (attr < 2.5 && strength >= 3.5) return 'Cosechar o Especializarse';
    return 'Desinversión / Retiro del Mercado';
  };

  // --- GRAND STRATEGY ACTIONS & INTERPRETATION ---
  const handleToggleGrandStrategy = (field: 'pos' | 'growth', val: string) => {
    const pos = field === 'pos' ? val : strategicAnalysis.grandStrategy.competitivePosition;
    const growth = field === 'growth' ? val : strategicAnalysis.grandStrategy.marketGrowth;

    let targetQuadrantId = 4;
    if (pos === 'fuerte' && growth === 'rapido') targetQuadrantId = 1;
    else if (pos === 'debil' && growth === 'rapido') targetQuadrantId = 2;
    else if (pos === 'debil' && growth === 'lento') targetQuadrantId = 3;

    const updated = {
      ...strategicAnalysis.grandStrategy,
      competitivePosition: pos as 'fuerte' | 'debil',
      marketGrowth: growth as 'rapido' | 'lento',
      customQuadrantId: targetQuadrantId
    };
    triggerUpdate({ ...strategicAnalysis, grandStrategy: updated });
    setSuccessToast(`Posicionamiento ajustado a Cuadrante ${targetQuadrantId} y guardado con éxito`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const getGrandStrategyQuadrant = () => {
    // Calculate default computed quadrant based on McKinsey matrix averages
    const computedMckQuadrantId = (() => {
      const attrCat = avgMckAttr >= 3.6 ? 'Alta' : avgMckAttr >= 2.5 ? 'Media' : 'Baja';
      const strengthCat = avgMckStrength >= 3.6 ? 'Fuerte' : avgMckStrength >= 2.5 ? 'Media' : 'Débil';

      if (
        (attrCat === 'Alta' && (strengthCat === 'Fuerte' || strengthCat === 'Media')) ||
        (attrCat === 'Media' && strengthCat === 'Fuerte')
      ) {
        return 1; // Cuadrante I ↔ Zona Alta de "Invertir / Crecer"
      } else if (
        (attrCat === 'Alta' && strengthCat === 'Débil') ||
        (attrCat === 'Media' && strengthCat === 'Media')
      ) {
        return 2; // Cuadrante II ↔ Celda de "Selectividad / Reevaluación"
      } else if (
        (attrCat === 'Baja' && (strengthCat === 'Débil' || strengthCat === 'Media')) ||
        (attrCat === 'Media' && strengthCat === 'Débil')
      ) {
        return 3; // Cuadrante III ↔ Zona Baja de "Cosechar / Desinvestir"
      } else {
        return 4; // Cuadrante IV ↔ Celda de "Cosechar con Táctica / Retener y Mantener"
      }
    })();

    // Determine active quadrant (customOverride if present, otherwise McKinsey dependent)
    const activeQuadrantId = strategicAnalysis.grandStrategy.customQuadrantId ?? computedMckQuadrantId;

    if (activeQuadrantId === 1) {
      return { 
        id: 1, 
        text: 'Cuadrante I', 
        desc: 'Posición competitiva excelente en un mercado en rápido crecimiento. Se asocia directamente con la Zona Alta de "Invertir / Crecer" en McKinsey.', 
        recs: ['Penetración de mercado', 'Desarrollo de mercado', 'Desarrollo de producto', 'Integración hacia adelante'],
        isCustom: strategicAnalysis.grandStrategy.customQuadrantId !== undefined,
        computedId: computedMckQuadrantId
      };
    }
    if (activeQuadrantId === 2) {
      return { 
        id: 2, 
        text: 'Cuadrante II', 
        desc: 'Débil posición competitiva en un mercado con rápido crecimiento. Se asocia directamente con la Celda de "Selectividad / Reevaluación" en McKinsey.', 
        recs: ['Desarrollo de mercado', 'Penetración de mercado', 'Desarrollo de producto', 'Integración horizontal o alianzas'],
        isCustom: strategicAnalysis.grandStrategy.customQuadrantId !== undefined,
        computedId: computedMckQuadrantId
      };
    }
    if (activeQuadrantId === 3) {
      return { 
        id: 3, 
        text: 'Cuadrante III', 
        desc: 'Débil posición competitiva en un mercado de lento crecimiento. Se asocia directamente con la Zona Baja de "Cosechar / Desinvestir" en McKinsey.', 
        recs: ['Reducción', 'Diversificación', 'Desinversión', 'Liquidación selectiva de activos'],
        isCustom: strategicAnalysis.grandStrategy.customQuadrantId !== undefined,
        computedId: computedMckQuadrantId
      };
    }
    return { 
      id: 4, 
      text: 'Cuadrante IV', 
      desc: 'Fuerte posición competitiva en un mercado de lento crecimiento. Se asocia directamente con la Celda de "Cosechar con Táctica / Retener y Mantener" en McKinsey.', 
      recs: ['Diversificación concéntrica', 'Diversificación horizontal', 'Empresas conjuntas (Joint ventures)', 'Alianzas estratégicas'],
      isCustom: strategicAnalysis.grandStrategy.customQuadrantId !== undefined,
      computedId: computedMckQuadrantId
    };
  };

  const grandStratResult = getGrandStrategyQuadrant();

  // --- INTEGRAL HEALTH SCORE CALCULATION (0-100) ---
  // 1. EFI Score normalized: (efiVal - 1) / 3 * 100 (20%)
  const efiNorm = Math.max(0, Math.min(100, ((efiWeightedTotal - 1) / 3) * 100));
  // 2. EFE Score normalized: (efeVal - 1) / 3 * 100 (20%)
  const efeNorm = Math.max(0, Math.min(100, ((efeWeightedTotal - 1) / 3) * 100));
  // 3. PEYEA quadrant score (Agresiva: 100, Competitiva: 75, Conservadora: 50, Defensiva: 25) (15%)
  let peyeaScore = 25;
  if (peyeaResult.position === 'Agresiva') peyeaScore = 100;
  else if (peyeaResult.position === 'Competitiva') peyeaScore = 75;
  else if (peyeaResult.position === 'Conservadora') peyeaScore = 50;
  // 4. McKinsey Portfolio score (15%)
  const mckAvg = strategicAnalysis.mckinseyUnits.length > 0 
    ? (strategicAnalysis.mckinseyUnits.reduce((sum, u) => sum + (u.industryAttractiveness + u.competitiveStrength) / 2, 0) / strategicAnalysis.mckinseyUnits.length)
    : 3.0;
  const mckNorm = (mckAvg / 5) * 100;
  // 5. Attractiveness-Competitiveness score (15%)
  const compAvg = strategicAnalysis.competitivenessUnits.length > 0
    ? (strategicAnalysis.competitivenessUnits.reduce((sum, u) => sum + (u.marketAttractiveness + u.businessCompetitiveness) / 2, 0) / strategicAnalysis.competitivenessUnits.length)
    : 3.0;
  const compNorm = (compAvg / 5) * 100;
  // 6. Grand Strategy score (I: 100, II: 70, IV: 70, III: 40) (15%)
  let gsScore = 40;
  if (grandStratResult.id === 1) gsScore = 100;
  else if (grandStratResult.id === 2 || grandStratResult.id === 4) gsScore = 70;

  const calculateStrategicScore = () => {
    const total = Math.round(
      (efiNorm * 0.20) + 
      (efeNorm * 0.20) + 
      (peyeaScore * 0.15) + 
      (mckNorm * 0.15) + 
      (compNorm * 0.15) + 
      (gsScore * 0.15)
    );
    return Math.min(100, Math.max(0, total));
  };

  const strategicScore = calculateStrategicScore();

  // Helper for strategic score colors
  const getScoreMeta = (score: number) => {
    if (score >= 75) return { text: 'Fuerte / Saludable', bg: 'bg-emerald-500', textCol: 'text-emerald-600', border: 'border-emerald-200' };
    if (score >= 50) return { text: 'Estable / Moderado', bg: 'bg-amber-500', textCol: 'text-amber-600', border: 'border-amber-200' };
    return { text: 'Crítico / Riesgoso', bg: 'bg-rose-500', textCol: 'text-rose-600', border: 'border-rose-200' };
  };

  const scoreMeta = getScoreMeta(strategicScore);

  // --- AUTOMATIC INSTANT STRATEGIC CAMPAIGNS & INTEGRATION CREATOR ---
  const handleCreateActiveIntegration = (type: 'obj' | 'act' | 'kpi', title: string, reasonOrDesc: string, valueOrTarget?: number, extra?: string) => {
    if (type === 'obj') {
      const newObj: SpecificObjective = {
        id: `obj-${Date.now()}`,
        name: title,
        strategicReason: reasonOrDesc,
        responsible: 'Katherine Cabrera (Directora de Planificación Estratégica)',
        priority: 'Alta',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        status: 'No iniciado',
        progress: 0
      };
      onAddObjective(newObj);
    } else if (type === 'act') {
      // Find or default to first objective
      const parentObjId = objectives[0]?.id || 'obj-1';
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        specificObjectiveId: parentObjId,
        name: title,
        description: reasonOrDesc,
        responsible: 'Equipo de Marketing',
        startDate: '2026-07-01',
        endDate: '2026-09-30',
        status: 'No iniciado',
        priority: 'Media',
        budgetAssigned: valueOrTarget || 3500,
        budgetUsed: 0,
        progress: 0,
        attachments: []
      };
      onAddActivity(newAct);
    } else if (type === 'kpi') {
      const newKpi: KPI = {
        id: `kpi-${Date.now()}`,
        name: title,
        description: reasonOrDesc,
        formula: extra || 'Unidades vendidas / Inventario total',
        unit: extra?.includes('Costo') ? 'USD' : 'Porcentaje',
        target: valueOrTarget || 85,
        currentValue: 0,
        history: []
      };
      onAddKpi(newKpi);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header with Last Updated Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Compass className="h-7 w-7 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-2xl tracking-tight">Módulo de Análisis Estratégico</h1>
            <p className="font-sans text-sm text-slate-400 mt-1">
              Optimización, toma de decisiones y alineamiento con el Plan de Marketing de VoltEcuador
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span>ÚLTIMA ACTUALIZACIÓN: {strategicAnalysis.lastUpdated}</span>
        </div>
      </div>

      {/* PANEL SUPERIOR DE INDICADORES (5 TARJETAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: EFI */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">EFI (Factores Internos)</span>
            <Shield className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">{efiWeightedTotal.toFixed(2)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                efiWeightedTotal >= 3.0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                efiWeightedTotal >= 2.0 ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                'bg-rose-50 text-rose-700 border border-rose-200/50'
              }`}>
                {efiWeightedTotal >= 3.0 ? 'Fuerte' : efiWeightedTotal >= 2.0 ? 'Media' : 'Débil'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                Suma: {efiWeightSum.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: EFE */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">EFE (Factores Externos)</span>
            <Compass className="h-4 w-4 text-purple-500 animate-pulse-slow" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">{efeWeightedTotal.toFixed(2)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                efeWeightedTotal >= 3.0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                efeWeightedTotal >= 2.0 ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                'bg-rose-50 text-rose-700 border border-rose-200/50'
              }`}>
                {efeWeightedTotal >= 3.0 ? 'Favorable' : efeWeightedTotal >= 2.0 ? 'Promedio' : 'Desfavorable'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                Suma: {efeWeightSum.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Cuadrante IE */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Cuadrante IE</span>
            <Layers className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">Celda {ieResult.cell}</div>
            <div className="flex items-center mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                ieResult.region === 'Crecer y construir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' :
                ieResult.region === 'Mantener y sostener' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                'bg-rose-50 text-rose-700 border border-rose-200/50'
              }`}>
                {ieResult.region}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Posición Estratégica */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Posición General</span>
            <Target className="h-4 w-4 text-amber-500 animate-spin-slow" />
          </div>
          <div>
            <div className="text-sm font-bold font-sans tracking-tight text-slate-900 line-clamp-1">
              {peyeaResult.position === 'Agresiva' ? 'Expansión Agresiva' :
               peyeaResult.position === 'Competitiva' ? 'Despliegue Competitivo' :
               peyeaResult.position === 'Conservadora' ? 'Consolidación' : 'Reestructuración Urgente'}
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Foco: {grandStratResult.text}
            </p>
          </div>
        </div>

        {/* Card 5: Salud Estratégica */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Salud General</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-slate-900">{strategicScore}</span>
              <span className="text-xs text-slate-400 font-mono">/100</span>
            </div>
            <div className="flex items-center mt-1">
              <span className={`h-2 w-2 rounded-full mr-1.5 ${
                strategicScore >= 75 ? 'bg-emerald-500 animate-ping-slow' :
                strategicScore >= 50 ? 'bg-amber-500' :
                'bg-rose-500 animate-pulse'
              }`} />
              <span className="text-[10px] font-medium text-slate-600 truncate">{scoreMeta.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner border border-slate-200/50 min-w-max">
          {(['general', 'foda', 'efi', 'efe', 'matriz-ie', 'peyea', 'mckinsey', 'atractivo', 'gran-estrategia', 'diagnostico'] as const).map((tab) => {
            const labelMap: Record<SubTab, string> = {
              general: 'Panel General',
              foda: 'Matriz FODA',
              efi: 'Matriz EFI',
              efe: 'Matriz EFE',
              'matriz-ie': 'Matriz IE',
              peyea: 'PEYEA (SPACE)',
              mckinsey: 'McKinsey GE',
              atractivo: 'Atractivo - Comp.',
              'gran-estrategia': 'Gran Estrategia',
              diagnostico: 'Diagnóstico Integral'
            };
            const iconMap: Record<SubTab, React.ComponentType<{ className?: string }>> = {
              general: BarChart,
              foda: Grid3X3,
              efi: Shield,
              efe: Compass,
              'matriz-ie': Layers,
              peyea: ActivityIcon,
              mckinsey: TrendingUp,
              atractivo: PieChart,
              'gran-estrategia': Zap,
              diagnostico: Award
            };
            const Icon = iconMap[tab];
            const isSelected = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-sans transition-all duration-200 ${
                  isSelected 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{labelMap[tab]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------- SUB-TAB PANELS ----------------- */}

      {/* 1. GENERAL PANEL */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Strategic Summary and Status Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  <span>Resumen de la Posición Estratégica</span>
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${scoreMeta.textCol} ${scoreMeta.border} border bg-slate-50`}>
                  ESTADO: {scoreMeta.text}
                </span>
              </div>
              <p className="font-sans text-slate-600 text-sm leading-relaxed mb-4">
                VoltEcuador mantiene actualmente una posición estratégica con un fuerte enfoque de 
                <span className="font-semibold text-slate-800"> Recuperación de Activos Inmovilizados</span>. 
                Los análisis de la Matriz EFI y FODA reflejan que los recursos congelados en bodega (baja rotación de stock) representan el principal desafío de liquidez, mientras que el creciente sector de la micromovilidad eléctrica urbana ofrece excelentes oportunidades de comercialización selectiva.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2 text-rose-600 font-semibold text-xs uppercase font-sans tracking-wide mb-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Riesgo Crítico Detectado</span>
                  </div>
                  <p className="font-sans text-xs text-slate-600 leading-snug">
                    Costos elevados de mantenimiento de bodega debido al stock inmovilizado. Requiere desinversión acelerada mediante promociones de última milla.
                  </p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold text-xs uppercase font-sans tracking-wide mb-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Oportunidad Prioritaria</span>
                  </div>
                  <p className="font-sans text-xs text-slate-600 leading-snug">
                    Alianzas con plataformas de entrega rápida interesadas en reducir su huella de carbono mediante vehículos sostenibles Volt.
                  </p>
                </div>
              </div>
            </div>

            {/* FODA / SWOT Quick Overview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="font-sans font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
                <Grid3X3 className="h-5 w-5 text-indigo-500" />
                <span>Factores Estratégicos Relevantes</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-800 font-sans mb-1 uppercase tracking-wider">Fortalezas Clave</p>
                  <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                    {strategicAnalysis.swotFactors.filter(f => f.type === 'fortaleza').slice(0,2).map(f => (
                      <li key={f.id}>{f.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-800 font-sans mb-1 uppercase tracking-wider">Oportunidades Clave</p>
                  <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                    {strategicAnalysis.swotFactors.filter(f => f.type === 'oportunidad').slice(0,2).map(f => (
                      <li key={f.id}>{f.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-rose-800 font-sans mb-1 uppercase tracking-wider">Debilidades Clave</p>
                  <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                    {strategicAnalysis.swotFactors.filter(f => f.type === 'debilidad').slice(0,2).map(f => (
                      <li key={f.id}>{f.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-800 font-sans mb-1 uppercase tracking-wider">Amenazas Clave</p>
                  <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                    {strategicAnalysis.swotFactors.filter(f => f.type === 'amenaza').slice(0,2).map(f => (
                      <li key={f.id}>{f.text}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info - Score & Recommendations */}
          <div className="space-y-6">
            {/* Global Score card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
              <h3 className="font-sans font-bold text-sm text-slate-500 uppercase tracking-wider">Score Global de Salud Estratégica</h3>
              <div className="relative my-6 flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-36 h-36">
                  <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="72" cy="72" />
                  <circle className="text-blue-500" strokeWidth="8" strokeDasharray="364" strokeDashoffset={364 - (364 * strategicScore) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="72" cy="72" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-extrabold text-slate-900">{strategicScore}</span>
                  <span className="font-sans text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">SOBRE 100</span>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans ${scoreMeta.textCol} ${scoreMeta.border} border bg-slate-50`}>
                Diagnóstico: {scoreMeta.text}
              </span>
            </div>

            {/* PEYEA Vector quick look */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-sans font-bold text-sm text-slate-800 mb-3">Posicionamiento Competitivo PEYEA</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">CUADRANTE REVELADO</p>
                  <p className="font-sans text-base font-bold text-blue-600 mt-0.5">{peyeaResult.position}</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1">Coordenadas: ({peyeaResult.x}, {peyeaResult.y})</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
                  <ActivityIcon className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Recommendations automatic */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl space-y-3.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide">Acción Recomendada</h3>
              </div>
              <p className="font-sans text-xs text-blue-100 leading-relaxed">
                "Ejecutar el enfoque defensivo promoviendo empaquetamiento comercial, garantizando el mantenimiento para liquidar inventario inmovilizado."
              </p>
              <button 
                onClick={() => setActiveSubTab('diagnostico')}
                className="w-full flex items-center justify-center space-x-2 bg-white text-blue-700 py-2.5 rounded-xl font-semibold font-sans text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Ver Diagnóstico Completo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SWOT / FODA PANEL */}
      {activeSubTab === 'foda' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Factor Input Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs h-fit">
              <h3 className="font-sans font-bold text-sm text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                {editingFactor ? 'Editar Factor Estratégico' : 'Agregar Factor FODA'}
              </h3>
              <form onSubmit={handleAddOrEditFactor} className="space-y-4">
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Descripción del Factor</label>
                  <textarea
                    value={factorText}
                    onChange={(e) => setFactorText(e.target.value)}
                    placeholder="Ej. Alta demanda de micromovilidad en Quito..."
                    rows={3}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 font-sans text-xs text-slate-800 transition-all outline-hidden resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Clasificación</label>
                    <select
                      value={factorType}
                      onChange={(e) => setFactorType(e.target.value as SwotFactor['type'])}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      <option value="fortaleza">Fortaleza (+)</option>
                      <option value="debilidad">Debilidad (-)</option>
                      <option value="oportunidad">Oportunidad (+)</option>
                      <option value="amenaza">Amenaza (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1 font-semibold">Área Crítica</label>
                    <select
                      value={factorArea}
                      onChange={(e) => setFactorArea(e.target.value as SwotFactor['area'])}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      <option value="Marketing">Marketing</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Operaciones">Operaciones</option>
                      <option value="Talento Humano">Talento Humano</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Peso</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={factorWeight}
                      onChange={(e) => setFactorWeight(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden transition-all shadow-inner"
                      placeholder="0.10"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Calificación (1 - 4)</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={factorRating}
                      onChange={(e) => setFactorRating(parseInt(e.target.value) || 3)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{editingFactor ? 'Guardar Cambios' : 'Agregar Factor'}</span>
                  </button>
                  {editingFactor && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFactor(null);
                        setFactorText('');
                      }}
                      className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-sans text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* FODA Interactive 2x2 grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="font-sans font-bold text-lg text-slate-800 mb-4 flex items-center space-x-2">
                  <Grid3X3 className="h-5 w-5 text-indigo-500" />
                  <span>Matriz FODA Interactiva (2x2)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fortalezas (F) */}
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                      <span className="font-sans text-xs font-extrabold text-emerald-800 uppercase tracking-wide">FORTALEZAS (INTERNO)</span>
                      <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">F</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {strategicAnalysis.swotFactors.filter(f => f.type === 'fortaleza').map(f => (
                        <div key={f.id} className="bg-white p-2.5 rounded-lg border border-slate-100 hover:border-blue-400 group transition-all flex items-start justify-between">
                          <div className="space-y-1 pr-2">
                            <p className="font-sans text-xs text-slate-700 leading-snug">{f.text}</p>
                            <span className="inline-block bg-slate-100 font-sans text-[9px] text-slate-500 px-1.5 py-0.5 rounded">{f.area}</span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingFactor(f); setFactorText(f.text); setFactorType(f.type); setFactorWeight(f.weight); setFactorRating(f.rating); setFactorArea(f.area); }} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteFactor(f.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Debilidades (D) */}
                  <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                      <span className="font-sans text-xs font-extrabold text-rose-800 uppercase tracking-wide">DEBILIDADES (INTERNO)</span>
                      <span className="bg-rose-100 text-rose-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">D</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {strategicAnalysis.swotFactors.filter(f => f.type === 'debilidad').map(f => (
                        <div key={f.id} className="bg-white p-2.5 rounded-lg border border-slate-100 hover:border-blue-400 group transition-all flex items-start justify-between">
                          <div className="space-y-1 pr-2">
                            <p className="font-sans text-xs text-slate-700 leading-snug">{f.text}</p>
                            <span className="inline-block bg-slate-100 font-sans text-[9px] text-slate-500 px-1.5 py-0.5 rounded">{f.area}</span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingFactor(f); setFactorText(f.text); setFactorType(f.type); setFactorWeight(f.weight); setFactorRating(f.rating); setFactorArea(f.area); }} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteFactor(f.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Oportunidades (O) */}
                  <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
                      <span className="font-sans text-xs font-extrabold text-blue-800 uppercase tracking-wide">OPORTUNIDADES (EXTERNO)</span>
                      <span className="bg-blue-100 text-blue-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">O</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {strategicAnalysis.swotFactors.filter(f => f.type === 'oportunidad').map(f => (
                        <div key={f.id} className="bg-white p-2.5 rounded-lg border border-slate-100 hover:border-blue-400 group transition-all flex items-start justify-between">
                          <div className="space-y-1 pr-2">
                            <p className="font-sans text-xs text-slate-700 leading-snug">{f.text}</p>
                            <span className="inline-block bg-slate-100 font-sans text-[9px] text-slate-500 px-1.5 py-0.5 rounded">{f.area}</span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingFactor(f); setFactorText(f.text); setFactorType(f.type); setFactorWeight(f.weight); setFactorRating(f.rating); setFactorArea(f.area); }} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteFactor(f.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenazas (A) */}
                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                      <span className="font-sans text-xs font-extrabold text-amber-800 uppercase tracking-wide">AMENAZAS (EXTERNO)</span>
                      <span className="bg-amber-100 text-amber-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">A</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {strategicAnalysis.swotFactors.filter(f => f.type === 'amenaza').map(f => (
                        <div key={f.id} className="bg-white p-2.5 rounded-lg border border-slate-100 hover:border-blue-400 group transition-all flex items-start justify-between">
                          <div className="space-y-1 pr-2">
                            <p className="font-sans text-xs text-slate-700 leading-snug">{f.text}</p>
                            <span className="inline-block bg-slate-100 font-sans text-[9px] text-slate-500 px-1.5 py-0.5 rounded">{f.area}</span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingFactor(f); setFactorText(f.text); setFactorType(f.type); setFactorWeight(f.weight); setFactorRating(f.rating); setFactorArea(f.area); }} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteFactor(f.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FODA Cruce de Estrategias FO/FA/DO/DA */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-sans font-bold text-base text-slate-800 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                    <span>Cruce y Matriz de Estrategias Derivadas</span>
                  </h3>
                </div>

                {/* Strategy Creator */}
                <form onSubmit={handleAddOrEditStrategy} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Cruce Estratégico</label>
                      <select
                        value={stratType}
                        onChange={(e) => setStratType(e.target.value as SwotStrategy['type'])}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 font-sans text-xs text-slate-800 outline-hidden"
                      >
                        <option value="FO">Estrategias FO (Fortalezas + Oportunidades)</option>
                        <option value="FA">Estrategias FA (Fortalezas + Amenazas)</option>
                        <option value="DO">Estrategias DO (Debilidades + Oportunidades)</option>
                        <option value="DA">Estrategias DA (Debilidades + Amenazas)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Título de la Estrategia</label>
                      <input
                        type="text"
                        value={stratTitle}
                        onChange={(e) => setStratTitle(e.target.value)}
                        placeholder="Ej. Lanzamiento de renting masivo para flotas urbanas"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 font-sans text-xs text-slate-800 outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Descripción de la Estrategia de Acción</label>
                    <textarea
                      value={stratDesc}
                      onChange={(e) => setStratDesc(e.target.value)}
                      placeholder="Explicación detallada de la táctica para el mercado..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-sans text-xs text-slate-800 outline-hidden resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    {editingStrategy && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStrategy(null);
                          setStratTitle('');
                          setStratDesc('');
                        }}
                        className="bg-slate-150 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors">
                      {editingStrategy ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      <span>{editingStrategy ? 'Guardar Cambios' : 'Agregar Estrategia'}</span>
                    </button>
                  </div>
                </form>

                {/* Strategy List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {(['FO', 'FA', 'DO', 'DA'] as const).map(type => {
                    const strats = strategicAnalysis.swotStrategies.filter(s => s.type === type);
                    const borderMap = {
                      FO: 'border-emerald-200 bg-emerald-50/20 text-emerald-800',
                      FA: 'border-blue-200 bg-blue-50/20 text-blue-800',
                      DO: 'border-indigo-200 bg-indigo-50/20 text-indigo-800',
                      DA: 'border-rose-200 bg-rose-50/20 text-rose-800'
                    };
                    return (
                      <div key={type} className={`border rounded-xl p-4 space-y-2.5`}>
                        <div className="flex items-center justify-between border-b pb-1.5 border-slate-100">
                          <span className={`text-[10px] font-extrabold uppercase font-sans tracking-wide`}>ESTRATEGIAS {type}</span>
                          <span className="font-mono text-[9px] text-slate-400">{strats.length} agregadas</span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {strats.length === 0 ? (
                            <p className="font-sans text-[10px] text-slate-400 italic">No se han registrado estrategias para esta combinación.</p>
                          ) : (
                            strats.map(s => {
                              const isInlineEditing = inlineEditingStrategyId === s.id;
                              return isInlineEditing ? (
                                <div key={s.id} className="bg-slate-50 p-2.5 rounded-lg border border-blue-400 space-y-2">
                                  <div className="space-y-1.5">
                                    <input
                                      type="text"
                                      value={inlineStrategyTitle}
                                      onChange={(e) => setInlineStrategyTitle(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 font-sans text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                                      placeholder="Título de la estrategia"
                                      autoFocus
                                    />
                                    <textarea
                                      value={inlineStrategyDesc}
                                      onChange={(e) => setInlineStrategyDesc(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 font-sans text-[10px] text-slate-600 focus:outline-hidden focus:border-blue-500 resize-none"
                                      rows={2}
                                      placeholder="Descripción de la estrategia"
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-1.5">
                                    <button
                                      onClick={() => handleSaveInlineStrategy(s.id)}
                                      className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded transition-colors"
                                      title="Guardar"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setInlineEditingStrategyId(null)}
                                      className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                                      title="Cancelar"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div key={s.id} className="bg-white p-2 rounded-lg border border-slate-100 hover:border-blue-300 group transition-all flex items-start justify-between">
                                  <div className="pr-2 space-y-0.5">
                                    <h4 className="font-sans font-bold text-xs text-slate-800">{s.title}</h4>
                                    <p className="font-sans text-[10px] text-slate-500 leading-snug">{s.description}</p>
                                  </div>
                                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => {
                                        setInlineEditingStrategyId(s.id);
                                        setInlineStrategyTitle(s.title);
                                        setInlineStrategyDesc(s.description);
                                      }}
                                      className="text-slate-400 hover:text-blue-600 p-1 shrink-0"
                                      title="Editar"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStrategy(s.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EFI / IFIS PANEL */}
      {activeSubTab === 'efi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Editable Factors Table */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-150 gap-4">
                  <div>
                    <h2 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>Matriz de Evaluación de Factores Internos (EFI)</span>
                    </h2>
                    <p className="font-sans text-xs text-slate-500 mt-1">
                      Valores asignados e inline-editing de Fortalezas y Debilidades de VoltEcuador.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150">
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase">Factor Interno</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-24">Tipo</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-32">Área</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-24 text-right">Peso</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-24 text-right">Calificación</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-28 text-right">Ponderación</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-12 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {efiFactors.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center font-sans text-xs text-slate-400 italic">
                            No se han configurado factores internos. Regístrelos abajo o en FODA.
                          </td>
                        </tr>
                      ) : (
                        efiFactors.map((f, idx) => (
                          <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={f.text}
                                onChange={(e) => handleUpdateFactorText(f.id, e.target.value)}
                                className="w-full bg-transparent hover:bg-slate-50 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 font-sans text-xs text-slate-800 outline-hidden transition"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                f.type === 'fortaleza' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {f.type === 'fortaleza' ? 'Fortaleza' : 'Debilidad'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={f.area}
                                onChange={(e) => handleUpdateFactorArea(f.id, e.target.value as SwotFactor['area'])}
                                className="bg-transparent hover:bg-slate-50 border border-transparent rounded px-1 py-0.5 font-sans text-xs text-slate-700 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              >
                                {['Marketing', 'Finanzas', 'Operaciones', 'Talento Humano', 'Tecnología', 'Otros'].map(a => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="any"
                                value={f.weight}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  handleUpdateFactorWeight(f.id, isNaN(val) ? 0 : val);
                                }}
                                className="w-16 bg-transparent hover:bg-slate-50 border border-transparent rounded text-right px-1 py-0.5 font-mono text-xs text-slate-800 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <select
                                value={f.rating}
                                onChange={(e) => handleUpdateFactorRating(f.id, parseInt(e.target.value) || 1)}
                                className="bg-transparent hover:bg-slate-50 border border-transparent rounded text-right px-1 py-0.5 font-mono text-xs font-semibold text-slate-800 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              >
                                {[1, 2, 3, 4].map(val => (
                                  <option key={val} value={val}>{val}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-slate-900 text-right font-bold">
                              {(f.weight * f.rating).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleDeleteFactor(f.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded transition opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      {/* Totals Row */}
                      <tr className="bg-slate-50/80 font-semibold border-t-2 border-slate-200">
                        <td className="py-3 px-3 font-sans text-xs text-slate-800 font-bold">Total Acumulado</td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3"></td>
                        <td className={`py-3 px-3 font-mono text-xs text-right font-bold ${Math.abs(efiWeightSum - 1.0) > 0.02 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {efiWeightSum.toFixed(2)}
                        </td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3 font-mono text-xs text-right text-blue-600 font-black">
                          {efiWeightedTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inline Quick Add Factor Form inside EFI */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center space-x-2">
                  <Plus className="h-4.5 w-4.5 text-blue-600" />
                  <span>Agregar Nuevo Factor Interno</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Descripción del Factor Interno</label>
                    <input
                      type="text"
                      value={internalText}
                      onChange={(e) => setInternalText(e.target.value)}
                      placeholder="Ej. Personal altamente capacitado en soporte de baterías"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo</label>
                    <select
                      value={internalType}
                      onChange={(e) => setInternalType(e.target.value as 'fortaleza' | 'debilidad')}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      <option value="fortaleza">Fortaleza</option>
                      <option value="debilidad">Debilidad</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Área</label>
                    <select
                      value={internalArea}
                      onChange={(e) => setInternalArea(e.target.value as SwotFactor['area'])}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      {['Marketing', 'Finanzas', 'Operaciones', 'Talento Humano', 'Tecnología', 'Otros'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[11px] font-extrabold text-blue-600 uppercase block mb-1">Peso</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={internalWeight}
                      onChange={(e) => setInternalWeight(e.target.value)}
                      className="w-full bg-blue-50/40 border-2 border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl p-3 font-mono text-sm font-black text-slate-900 outline-hidden transition-all shadow-inner"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Calificación</label>
                    <select
                      value={internalRating}
                      onChange={(e) => setInternalRating(parseInt(e.target.value) || 3)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800 outline-hidden"
                    >
                      {[1, 2, 3, 4].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!internalText.trim()) return;
                      const parsedWeight = typeof internalWeight === 'string' ? parseFloat(internalWeight) || 0 : internalWeight;
                      const newFactor: SwotFactor = {
                        id: 'fi_' + Date.now(),
                        text: internalText.trim(),
                        type: internalType,
                        weight: parsedWeight,
                        rating: internalRating,
                        area: internalArea
                      };
                      onUpdateStrategicAnalysis({
                        ...strategicAnalysis,
                        swotFactors: [...strategicAnalysis.swotFactors, newFactor],
                        lastUpdated: new Date().toLocaleDateString('es-ES')
                      });
                      setInternalText('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Factor Interno</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Analytics Panel (Validation, Rating Card, and Recharts Distribution) */}
            <div className="space-y-6">
              {/* EFI Performance Indicator Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">Desempeño Interno</span>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900">{efiWeightedTotal.toFixed(2)}</span>
                    <span className="text-slate-400 text-xs font-sans block">sobre 4.00</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase shadow-sm ${efiStatus.color}`}>
                    {efiStatus.text}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {efiWeightedTotal >= 2.5 
                    ? 'VoltEcuador posee una posición interna FUERTE. Las fortalezas corporativas superan los cuellos de botella de operación.' 
                    : 'VoltEcuador posee una posición interna DÉBIL. Es imperativo formular estrategias inmediatas de reestructuración interna.'}
                </p>
              </div>

              {/* Weight normalization warning and quick action */}
              {Math.abs(efiWeightSum - 1.0) > 0.01 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-xs text-amber-800">Suma de pesos actual: {efiWeightSum.toFixed(2)}</h4>
                      <p className="font-sans text-[11px] text-amber-700 leading-snug">
                        Has ingresado pesos en una escala distinta a 1.00. <strong>¡No te preocupes!</strong> El sistema normaliza automáticamente los pesos para calcular tu puntuación correcta sobre 4.00.
                      </p>
                      <p className="font-sans text-[10px] text-slate-500 leading-snug">
                        Si prefieres que la tabla muestre la escala estándar decimal (que sume 1.00), haz clic abajo.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNormalizeWeights('internal')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold font-sans text-xs py-2 rounded-xl flex items-center justify-center space-x-1 shadow-sm transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                    <span>Normalizar Pesos EFI a 1.00</span>
                  </button>
                </div>
              )}

              {/* Distribution Chart */}
              {efiFactors.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-sans font-bold text-xs text-slate-700 uppercase tracking-wider">Aporte de Factores Internos</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={efiFactors.slice(0, 5).map(f => ({
                          name: f.text.length > 15 ? f.text.substring(0, 12) + '...' : f.text,
                          puntuacion: parseFloat((f.weight * f.rating).toFixed(2)),
                          type: f.type
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 1.5]} fontSize={10} fontStyle="italic" />
                        <YAxis dataKey="name" type="category" fontSize={9} width={75} />
                        <Tooltip formatter={(value) => [`${value} pts`, 'Ponderación']} />
                        <Bar dataKey="puntuacion" radius={[0, 4, 4, 0]}>
                          {efiFactors.slice(0, 5).map((entry, index) => (
                            <RechartsCell 
                              key={`cell-${index}`} 
                              fill={entry.type === 'fortaleza' ? '#10b981' : '#f43f5e'} 
                            />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3.1 EFE / EVALUACIÓN DE FACTORES EXTERNOS PANEL */}
      {activeSubTab === 'efe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Editable Factors Table */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-150 gap-4">
                  <div>
                    <h2 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
                      <Compass className="h-5 w-5 text-purple-600 animate-spin-slow" />
                      <span>Matriz de Evaluación de Factores Externos (EFE)</span>
                    </h2>
                    <p className="font-sans text-xs text-slate-500 mt-1">
                      Valores asignados e inline-editing de Oportunidades y Amenazas del entorno de VoltEcuador.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150">
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase">Factor Externo</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-28">Tipo</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-32">Área</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-24 text-right">Peso</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-24 text-right">Calificación</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-28 text-right">Ponderación</th>
                        <th className="py-3 px-3 font-sans text-xs font-bold text-slate-500 uppercase w-12 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {efeFactors.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center font-sans text-xs text-slate-400 italic">
                            No se han configurado factores externos. Regístrelos abajo o en FODA.
                          </td>
                        </tr>
                      ) : (
                        efeFactors.map((f, idx) => (
                          <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={f.text}
                                onChange={(e) => handleUpdateFactorText(f.id, e.target.value)}
                                className="w-full bg-transparent hover:bg-slate-50 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded px-1.5 py-1 font-sans text-xs text-slate-800 outline-hidden transition"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                f.type === 'oportunidad' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                              }`}>
                                {f.type === 'oportunidad' ? 'Oportunidad' : 'Amenaza'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={f.area}
                                onChange={(e) => handleUpdateFactorArea(f.id, e.target.value as SwotFactor['area'])}
                                className="bg-transparent hover:bg-slate-50 border border-transparent rounded px-1 py-0.5 font-sans text-xs text-slate-700 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              >
                                {['Marketing', 'Finanzas', 'Operaciones', 'Talento Humano', 'Tecnología', 'Otros'].map(a => (
                                  <option key={a} value={a}>{a}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="any"
                                value={f.weight}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  handleUpdateFactorWeight(f.id, isNaN(val) ? 0 : val);
                                }}
                                className="w-16 bg-transparent hover:bg-slate-50 border border-transparent rounded text-right px-1 py-0.5 font-mono text-xs text-slate-800 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <select
                                value={f.rating}
                                onChange={(e) => handleUpdateFactorRating(f.id, parseInt(e.target.value) || 1)}
                                className="bg-transparent hover:bg-slate-50 border border-transparent rounded text-right px-1 py-0.5 font-mono text-xs font-semibold text-slate-800 outline-hidden focus:bg-white focus:border-slate-300 transition"
                              >
                                {[1, 2, 3, 4].map(val => (
                                  <option key={val} value={val}>{val}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-slate-900 text-right font-bold">
                              {(f.weight * f.rating).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleDeleteFactor(f.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded transition opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      {/* Totals Row */}
                      <tr className="bg-slate-50/80 font-semibold border-t-2 border-slate-200">
                        <td className="py-3 px-3 font-sans text-xs text-slate-800 font-bold">Total Acumulado</td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3"></td>
                        <td className={`py-3 px-3 font-mono text-xs text-right font-bold ${Math.abs(efeWeightSum - 1.0) > 0.02 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {efeWeightSum.toFixed(2)}
                        </td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3 font-mono text-xs text-right text-purple-600 font-black">
                          {efeWeightedTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inline Quick Add Factor Form inside EFE */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center space-x-2">
                  <Plus className="h-4.5 w-4.5 text-purple-600" />
                  <span>Agregar Nuevo Factor Externo</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Descripción del Factor Externo</label>
                    <input
                      type="text"
                      value={externalText}
                      onChange={(e) => setExternalText(e.target.value)}
                      placeholder="Ej. Crecimiento del mercado de electromovilidad en Guayaquil"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden focus:border-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo</label>
                    <select
                      value={externalType}
                      onChange={(e) => setExternalType(e.target.value as 'oportunidad' | 'amenaza')}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      <option value="oportunidad">Oportunidad</option>
                      <option value="amenaza">Amenaza</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Área</label>
                    <select
                      value={externalArea}
                      onChange={(e) => setExternalArea(e.target.value as SwotFactor['area'])}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-sans text-xs text-slate-800 outline-hidden"
                    >
                      {['Marketing', 'Finanzas', 'Operaciones', 'Talento Humano', 'Tecnología', 'Otros'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[11px] font-extrabold text-purple-600 uppercase block mb-1">Peso</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={externalWeight}
                      onChange={(e) => setExternalWeight(e.target.value)}
                      className="w-full bg-purple-50/40 border-2 border-purple-200 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 rounded-xl p-3 font-mono text-sm font-black text-slate-900 outline-hidden transition-all shadow-inner"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Calificación</label>
                    <select
                      value={externalRating}
                      onChange={(e) => setExternalRating(parseInt(e.target.value) || 3)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800 outline-hidden"
                    >
                      {[1, 2, 3, 4].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!externalText.trim()) return;
                      const parsedWeight = typeof externalWeight === 'string' ? parseFloat(externalWeight) || 0 : externalWeight;
                      const newFactor: SwotFactor = {
                        id: 'fe_' + Date.now(),
                        text: externalText.trim(),
                        type: externalType,
                        weight: parsedWeight,
                        rating: externalRating,
                        area: externalArea
                      };
                      onUpdateStrategicAnalysis({
                        ...strategicAnalysis,
                        swotFactors: [...strategicAnalysis.swotFactors, newFactor],
                        lastUpdated: new Date().toLocaleDateString('es-ES')
                      });
                      setExternalText('');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold font-sans text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Factor Externo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Analytics Panel (Validation, Rating Card, and Recharts Distribution) */}
            <div className="space-y-6">
              {/* EFE Performance Indicator Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">Atractivo del Entorno</span>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900">{efeWeightedTotal.toFixed(2)}</span>
                    <span className="text-slate-400 text-xs font-sans block">sobre 4.00</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase shadow-sm ${efeStatus.color}`}>
                    {efeStatus.text}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {efeWeightedTotal >= 2.5 
                    ? 'El entorno de VoltEcuador es FAVORABLE. Existen oportunidades críticas que mitigan las amenazas regulatorias o competitivas.' 
                    : 'El entorno de VoltEcuador es DESFAVORABLE. El mercado externo impone amenazas severas que requieren blindaje estratégico inmediato.'}
                </p>
              </div>

              {/* Weight normalization warning and quick action */}
              {Math.abs(efeWeightSum - 1.0) > 0.01 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-xs text-amber-800">Suma de pesos actual: {efeWeightSum.toFixed(2)}</h4>
                      <p className="font-sans text-[11px] text-amber-700 leading-snug">
                        Has ingresado pesos en una escala distinta a 1.00. <strong>¡No te preocupes!</strong> El sistema normaliza automáticamente los pesos para calcular tu puntuación correcta sobre 4.00.
                      </p>
                      <p className="font-sans text-[10px] text-slate-500 leading-snug">
                        Si prefieres que la tabla muestre la escala estándar decimal (que sume 1.00), haz clic abajo.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNormalizeWeights('external')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold font-sans text-xs py-2 rounded-xl flex items-center justify-center space-x-1 shadow-sm transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                    <span>Normalizar Pesos EFE a 1.00</span>
                  </button>
                </div>
              )}

              {/* Distribution Chart */}
              {efeFactors.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-sans font-bold text-xs text-slate-700 uppercase tracking-wider">Aporte de Factores Externos</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={efeFactors.slice(0, 5).map(f => ({
                          name: f.text.length > 15 ? f.text.substring(0, 12) + '...' : f.text,
                          puntuacion: parseFloat((f.weight * f.rating).toFixed(2)),
                          type: f.type
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 1.5]} fontSize={10} fontStyle="italic" />
                        <YAxis dataKey="name" type="category" fontSize={9} width={75} />
                        <Tooltip formatter={(value) => [`${value} pts`, 'Ponderación']} />
                        <Bar dataKey="puntuacion" radius={[0, 4, 4, 0]}>
                          {efeFactors.slice(0, 5).map((entry, index) => (
                            <RechartsCell 
                              key={`cell-${index}`} 
                              fill={entry.type === 'oportunidad' ? '#3b82f6' : '#f97316'} 
                            />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3.2 MATRIZ INTERNA-EXTERNA (IE) PANEL */}
      {activeSubTab === 'matriz-ie' && (
        <div className="space-y-6">
          {!isAllAligned && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="font-sans font-bold text-sm text-amber-800">Alerta de Desalineación Estratégica</span>
              </div>
              <p className="font-sans text-xs text-slate-700 leading-relaxed">
                Se ha detectado una discrepancia en las conclusiones estratégicas de las matrices de posicionamiento. Esto ocurre cuando el estado de los factores internos/externos, las unidades registradas o las fuerzas financieras no apuntan a la misma dirección estratégica general:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz IE:</strong> Recomienda <span className="font-semibold text-amber-800">"{ieResult.region}"</span> (Celda {ieResult.cell})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz McKinsey:</strong> Recomienda <span className="font-semibold text-amber-800">"{mckRegion}"</span> (Atractivo Promedio: {avgMckAttr.toFixed(2)}, Competitividad Promedio: {avgMckStrength.toFixed(2)})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz PEYEA:</strong> Recomienda postura <span className="font-semibold text-amber-800">"{peyeaResult.position}"</span> (Equivalente a "{peyeaEquivalentRegion}")
                </li>
              </ul>
              <p className="font-sans text-[10px] text-slate-500 italic pt-1 border-t border-amber-200/50">
                Sugerencia: Revise las calificaciones, ponderaciones de los factores FODA (que alimentan EFI/EFE/IE) o ajuste los datos de las Unidades de Negocio en McKinsey para lograr coherencia metodológica.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <span>Matriz Interna - Externa (IE)</span>
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Generación automática en base al cruce de los puntajes totales de las matrices EFI ({efiWeightedTotal.toFixed(2)}) y EFE ({efeWeightedTotal.toFixed(2)}).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Interactive 3x3 Strategic Matrix Grid */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <span className="font-mono text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">EJE VERTICAL: MATRIZ EFE (ATRACTIVO)</span>
                <div className="relative flex w-full max-w-md">
                  {/* Left-side EFE values markers */}
                  <div className="flex flex-col justify-between text-right pr-2 py-4 text-[9px] font-bold font-mono text-slate-500 shrink-0 h-80">
                    <div className="h-1/3 flex items-center justify-end">ALTA (3.0 - 4.0)</div>
                    <div className="h-1/3 flex items-center justify-end">MEDIA (2.0 - 2.99)</div>
                    <div className="h-1/3 flex items-center justify-end">BAJA (1.0 - 1.99)</div>
                  </div>

                  <div className="flex-1">
                    {/* Grid wrapper */}
                    <div className="relative border-2 border-slate-400 h-80 grid grid-cols-3 grid-rows-3 bg-slate-50 overflow-hidden shadow-inner">
                      
                      {/* Cell I (Alto EFE, Fuerte EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'I' ? 'bg-emerald-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-emerald-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-emerald-800">Celda I</span>
                        <span className="font-sans text-[9px] font-bold text-emerald-950 uppercase leading-none">Crecer y Construir</span>
                      </div>

                      {/* Cell II (Alto EFE, Promedio EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'II' ? 'bg-emerald-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-emerald-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-emerald-800">Celda II</span>
                        <span className="font-sans text-[9px] font-bold text-emerald-950 uppercase leading-none">Crecer y Construir</span>
                      </div>

                      {/* Cell III (Alto EFE, Débil EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'III' ? 'bg-amber-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-amber-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-amber-800">Celda III</span>
                        <span className="font-sans text-[9px] font-bold text-amber-950 uppercase leading-none">Mantener y Sostener</span>
                      </div>

                      {/* Cell IV (Medio EFE, Fuerte EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'IV' ? 'bg-emerald-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-emerald-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-emerald-800">Celda IV</span>
                        <span className="font-sans text-[9px] font-bold text-emerald-950 uppercase leading-none">Crecer y Construir</span>
                      </div>

                      {/* Cell V (Medio EFE, Promedio EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'V' ? 'bg-amber-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-amber-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-amber-800">Celda V</span>
                        <span className="font-sans text-[9px] font-bold text-amber-950 uppercase leading-none">Mantener y Sostener</span>
                      </div>

                      {/* Cell VI (Medio EFE, Débil EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'VI' ? 'bg-rose-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-rose-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-rose-800">Celda VI</span>
                        <span className="font-sans text-[9px] font-bold text-rose-950 uppercase leading-none">Cosechar o Desinvertir</span>
                      </div>

                      {/* Cell VII (Bajo EFE, Fuerte EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'VII' ? 'bg-amber-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-amber-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-amber-800">Celda VII</span>
                        <span className="font-sans text-[9px] font-bold text-amber-950 uppercase leading-none">Mantener y Sostener</span>
                      </div>

                      {/* Cell VIII (Bajo EFE, Promedio EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'VIII' ? 'bg-rose-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-rose-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-rose-800">Celda VIII</span>
                        <span className="font-sans text-[9px] font-bold text-rose-950 uppercase leading-none">Cosechar o Desinvertir</span>
                      </div>

                      {/* Cell IX (Bajo EFE, Débil EFI) */}
                      <div className={`p-2.5 border border-slate-200/50 flex flex-col justify-between transition-all ${
                        ieResult.cell === 'IX' ? 'bg-rose-100/70 border-4 border-blue-600 shadow-lg z-10' : 'bg-rose-50/20'
                      }`}>
                        <span className="font-mono text-[10px] font-extrabold text-rose-800">Celda IX</span>
                        <span className="font-sans text-[9px] font-bold text-rose-950 uppercase leading-none">Cosechar o Desinvertir</span>
                      </div>

                      {/* Dynamic placement marker overlay based on actual coordinates */}
                      {(() => {
                        // Coordinates: X = EFI (1.0 - 4.0), Y = EFE (1.0 - 4.0). SVG/HTML values range from 0% to 100%
                        // For X: 1.0 is 100% (right), 4.0 is 0% (left) in classical IE. Or typical: Fuerte is left, Débil is right.
                        // Let's map X (EFI): Fuerte (3 to 4) is first column, Promedio (2 to 3) is second, Débil (1 to 2) is third.
                        // So X percent: 4.0 -> 0%, 1.0 -> 100%. xPct = (4.0 - EFI) / 3.0 * 100%
                        // For Y (EFE): Alto (3 to 4) is first row, Medio (2 to 3) is second row, Bajo (1 to 2) is third row.
                        // So Y percent: 4.0 -> 0%, 1.0 -> 100%. yPct = (4.0 - EFE) / 3.0 * 100%
                        const xPct = Math.min(Math.max(((4.0 - efiWeightedTotal) / 3.0) * 100, 5), 95);
                        const yPct = Math.min(Math.max(((4.0 - efeWeightedTotal) / 3.0) * 100, 5), 95);
                        return (
                          <div 
                            className="absolute h-8 w-8 -ml-4 -mt-4 flex items-center justify-center transition-all duration-500 z-30"
                            style={{ left: `${xPct}%`, top: `${yPct}%` }}
                          >
                            <span className="absolute h-6 w-6 rounded-full bg-blue-600/30 animate-ping" />
                            <div className="h-4 w-4 rounded-full bg-blue-700 border-2 border-white shadow-md flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>
                            <span className="absolute mt-7 bg-slate-900 text-white font-mono text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                              VoltEcuador ({efiWeightedTotal.toFixed(1)}, {efeWeightedTotal.toFixed(1)})
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom-side EFI value markers */}
                    <div className="flex text-center mt-2 text-[9px] font-bold font-mono text-slate-500">
                      <div className="w-1/3">FUERTE (3.0 - 4.0)</div>
                      <div className="w-1/3">PROMEDIO (2.0 - 2.99)</div>
                      <div className="w-1/3">DÉBIL (1.0 - 1.99)</div>
                    </div>
                    <div className="text-center mt-1 font-mono text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      EJE HORIZONTAL: MATRIZ EFI (CAPACIDAD INTERNA)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Recommendations & Region Interpretation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/55 pb-2">
                    <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase">Posición de Portafolio</span>
                    <span className="font-mono text-xs font-black text-indigo-700">Celda {ieResult.cell}</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-base text-slate-800 capitalize">Estrategia: {ieResult.region}</h4>
                    <p className="font-sans text-xs text-slate-600 mt-1.5 leading-relaxed">
                      La empresa se encuentra posicionada en la región de <strong className="text-slate-800">"{ieResult.region}"</strong>. Esto indica que se deben priorizar acciones alineadas a la posición competitiva interna frente al entorno regulatorio y competitivo.
                    </p>
                  </div>
                </div>

                {ieResult.cell === 'V' && (() => {
                  const ieAnalysisVal = strategicAnalysis.ieAnalysisText ?? 'La Compañía de VoltEcuador es un jugador chico con competidores, sin embargo se posiciona en un mercado con crecimiento, con nuevas opciones de gestión en inventarios, restauración, servicio postventa y nuevas herramientas tecnológicas en evolución, además del aporte y el sentido de apoyo de leyes gubernamentales. Su enfoque debe ser en resistir y gestionar recursos existentes y financiamiento controlado de los productos.';
                  const ieStrategyVal = strategicAnalysis.ieStrategyText ?? 'Invertir en la producción de áreas con valor en el mercado y en crecimiento, eliminar obstáculos de crecimiento, administración o producción como sistemas mal llevados, equipos no aptos, trabajos sin aportes, y redirigir el financiamiento con nuevos objetivos, estrategias defensivas selectivas de recursos financieros y tiempo para salud empresarial actual.';

                  return (
                    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 space-y-4">
                      {/* Análisis Transcrito Block */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[10px] text-amber-700 font-bold block uppercase tracking-wide">Análisis Transcrito</span>
                          {!isEditingIeAnalysis && (
                            <button
                              onClick={() => {
                                setIeAnalysisEditVal(ieAnalysisVal);
                                setIsEditingIeAnalysis(true);
                              }}
                              className="text-[10px] text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 transition-colors"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Editar</span>
                            </button>
                          )}
                        </div>

                        {isEditingIeAnalysis ? (
                          <div className="space-y-2">
                            <textarea
                              value={ieAnalysisEditVal}
                              onChange={(e) => setIeAnalysisEditVal(e.target.value)}
                              className="w-full bg-white border border-amber-300 rounded-xl p-3 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y min-h-[100px]"
                              placeholder="Escribe el análisis transcrito..."
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditingIeAnalysis(false)}
                                className="bg-amber-100/50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                              >
                                <X className="h-3 w-3" />
                                <span>Cancelar</span>
                              </button>
                              <button
                                onClick={() => {
                                  triggerUpdate({
                                    ...strategicAnalysis,
                                    ieAnalysisText: ieAnalysisEditVal.trim()
                                  });
                                  setIsEditingIeAnalysis(false);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                <span>Guardar</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="font-sans text-[11px] text-slate-700 leading-relaxed italic">
                            «{ieAnalysisVal}»
                          </p>
                        )}
                      </div>

                      {/* Estrategia Específica Block */}
                      <div className="border-t border-amber-200/30 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[10px] text-amber-700 font-bold block uppercase tracking-wide">Estrategia Específica</span>
                          {!isEditingIeStrategy && (
                            <button
                              onClick={() => {
                                setIeStrategyEditVal(ieStrategyVal);
                                setIsEditingIeStrategy(true);
                              }}
                              className="text-[10px] text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 transition-colors"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Editar</span>
                            </button>
                          )}
                        </div>

                        {isEditingIeStrategy ? (
                          <div className="space-y-2">
                            <textarea
                              value={ieStrategyEditVal}
                              onChange={(e) => setIeStrategyEditVal(e.target.value)}
                              className="w-full bg-white border border-amber-300 rounded-xl p-3 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y min-h-[100px]"
                              placeholder="Escribe la estrategia específica..."
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditingIeStrategy(false)}
                                className="bg-amber-100/50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                              >
                                <X className="h-3 w-3" />
                                <span>Cancelar</span>
                              </button>
                              <button
                                onClick={() => {
                                  triggerUpdate({
                                    ...strategicAnalysis,
                                    ieStrategyText: ieStrategyEditVal.trim()
                                  });
                                  setIsEditingIeStrategy(false);
                                }}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                              >
                                <Check className="h-3 w-3" />
                                <span>Guardar</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="font-sans text-[11px] text-slate-700 leading-relaxed italic mt-1">
                            «{ieStrategyVal}»
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="font-sans text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block">Lineamientos de Acción Recomendados</span>
                  <ul className="space-y-2.5">
                    {ieResult.region === 'Crecer y construir' && [
                      'Penetración de mercado agresiva mediante campañas publicitarias masivas para Volt City.',
                      'Desarrollo de nuevos canales de distribución y venta de renting corporativo.',
                      'Integración hacia atrás para asegurar insumos críticos de baterías de litio.'
                    ].map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs font-sans text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                    {ieResult.region === 'Mantener y sostener' && [
                      'Campañas de marketing enfocadas en fidelizar la cartera actual de VoltEcuador.',
                      'Mejorar la eficiencia de talleres de soporte postventa para retener clientes.',
                      'Lanzar optimizaciones de producto o accesorios para rentabilizar la base instalada.'
                    ].map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs font-sans text-slate-600">
                        <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                    {ieResult.region === 'Cosechar o desinvertir' && [
                      'Lanzar promociones agresivas y liquidaciones de inventario inmovilizado en bodegas.',
                      'Recortar gastos fijos de almacenamiento y contraer el presupuesto de mercadeo no rentable.',
                      'Enfocarse exclusivamente en las líneas de producto de alta rotación (ej. scooters urbanos).'
                    ].map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs font-sans text-slate-600">
                        <Check className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PEYEA (SPACE) PANEL */}
      {activeSubTab === 'peyea' && (
        <div className="space-y-6">
          {!isAllAligned && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="font-sans font-bold text-sm text-amber-800">Alerta de Desalineación Estratégica</span>
              </div>
              <p className="font-sans text-xs text-slate-700 leading-relaxed">
                Se ha detectado una discrepancia en las conclusiones estratégicas de las matrices de posicionamiento. Esto ocurre cuando el estado de los factores internos/externos, las unidades registradas o las fuerzas financieras no apuntan a la misma dirección estratégica general:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz IE:</strong> Recomienda <span className="font-semibold text-amber-800">"{ieResult.region}"</span> (Celda {ieResult.cell})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz McKinsey:</strong> Recomienda <span className="font-semibold text-amber-800">"{mckRegion}"</span> (Atractivo Promedio: {avgMckAttr.toFixed(2)}, Competitividad Promedio: {avgMckStrength.toFixed(2)})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz PEYEA:</strong> Recomienda postura <span className="font-semibold text-amber-800">"{peyeaResult.position}"</span> (Equivalente a "{peyeaEquivalentRegion}")
                </li>
              </ul>
              <p className="font-sans text-[10px] text-slate-500 italic pt-1 border-t border-amber-200/50">
                Sugerencia: Revise las calificaciones, ponderaciones de los factores FODA (que alimentan EFI/EFE/IE) o ajuste los datos de las Unidades de Negocio en McKinsey para lograr coherencia metodológica.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs for Peyea */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">
                Evaluación de Dimensiones PEYEA
              </h3>
              <p className="font-sans text-[11px] text-slate-500 mt-1 leading-snug">
                Puntúe las variables: Fuerza Financiera (FF) e Industria (FI) de 1 a 6 (positivo). Ventaja Competitiva (VC) y Estabilidad (EE) de -6 a -1 (negativo).
              </p>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {(['FF', 'VC', 'FI', 'EE'] as const).map(dim => {
                const dimFactors = strategicAnalysis.peyeaFactors.filter(f => f.dimension === dim);
                const titleMap = { FF: 'Fuerza Financiera (FF)', VC: 'Ventaja Competitiva (VC)', FI: 'Fuerza de la Industria (FI)', EE: 'Estabilidad del Entorno (EE)' };
                const bgMap = { FF: 'bg-emerald-50/55 border-emerald-100', VC: 'bg-rose-50/55 border-rose-100', FI: 'bg-blue-50/55 border-blue-100', EE: 'bg-amber-50/55 border-amber-100' };
                return (
                  <div key={dim} className={`p-3.5 border rounded-xl space-y-2.5 ${bgMap[dim]}`}>
                    <span className="font-sans text-xs font-bold text-slate-800">{titleMap[dim]}</span>
                    <div className="space-y-3">
                      {dimFactors.map(f => (
                        <div key={f.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-sans">
                            <span className="text-slate-600 pr-2">{f.name}</span>
                            <span className="font-mono font-bold text-slate-950">{f.score > 0 ? `+${f.score}` : f.score}</span>
                          </div>
                          <input
                            type="range"
                            min={dim === 'VC' || dim === 'EE' ? -6 : 1}
                            max={dim === 'VC' || dim === 'EE' ? -1 : 6}
                            step="1"
                            value={f.score}
                            onChange={(e) => handleUpdatePeyeaScore(f.id, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graphical Visualization of PEYEA Matrix & Vectors */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
              <h3 className="font-sans font-bold text-base text-slate-800 mb-4 self-start">Gráfico Vectorial PEYEA (SPACE)</h3>
              
              {/* Animated/Interlocking Coordinate Vector plane drawn using native SVG */}
              <div className="relative w-full max-w-sm aspect-square bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Grid quadrants */}
                  <rect x="0" y="0" width="100" height="100" fill="#fef3c7" fillOpacity="0.25" /> {/* Conservadora */}
                  <rect x="100" y="0" width="100" height="100" fill="#d1fae5" fillOpacity="0.25" /> {/* Agresiva */}
                  <rect x="0" y="100" width="100" height="100" fill="#fee2e2" fillOpacity="0.25" /> {/* Defensiva */}
                  <rect x="100" y="100" width="100" height="100" fill="#dbeafe" fillOpacity="0.25" /> {/* Competitiva */}

                  {/* Axis lines */}
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Grid divisions ticks */}
                  {[20, 40, 60, 80, 120, 140, 160, 180].map(tick => (
                    <React.Fragment key={tick}>
                      <line x1={tick} y1="97" x2={tick} y2="103" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="97" y1={tick} x2="103" y2={tick} stroke="#cbd5e1" strokeWidth="1" />
                    </React.Fragment>
                  ))}

                  {/* Quadrant text labels */}
                  <text x="145" y="30" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AGRESIVO</text>
                  <text x="25" y="30" fill="#d97706" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CONSERVADOR</text>
                  <text x="145" y="175" fill="#2563eb" fontSize="8" fontWeight="bold" fontFamily="sans-serif">COMPETITIVO</text>
                  <text x="25" y="175" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DEFENSIVO</text>

                  {/* Dimensions Labels on axis ends */}
                  <text x="104" y="15" fill="#64748b" fontSize="6" fontWeight="bold" fontFamily="monospace">FF (+{peyeaResult.ffAvg.toFixed(1)})</text>
                  <text x="104" y="192" fill="#64748b" fontSize="6" fontWeight="bold" fontFamily="monospace">EE ({peyeaResult.eeAvg.toFixed(1)})</text>
                  <text x="156" y="96" fill="#64748b" fontSize="6" fontWeight="bold" fontFamily="monospace">FI (+{peyeaResult.fiAvg.toFixed(1)})</text>
                  <text x="5" y="96" fill="#64748b" fontSize="6" fontWeight="bold" fontFamily="monospace">VC ({peyeaResult.vcAvg.toFixed(1)})</text>

                  {/* Actual Coords mapping */}
                  {/* Standard SVG coords: center is (100, 100). Max scale +/- 6 is mapped to +/- 80 pixels */}
                  {(() => {
                    const mappedX = 100 + (peyeaResult.x / 6) * 80;
                    const mappedY = 100 - (peyeaResult.y / 6) * 80; // inverted Y in SVG coordinates
                    return (
                      <>
                        {/* Shaded Area of the vector */}
                        <polygon points={`100,100 ${mappedX},100 ${mappedX},${mappedY} 100,${mappedY}`} fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2" />
                        
                        {/* Directional Vector line */}
                        <line x1="100" y1="100" x2={mappedX} y2={mappedY} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
                        
                        {/* Vector coordinate endpoint dot */}
                        <circle cx={mappedX} cy={mappedY} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                      </>
                    );
                  })()}

                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Dynamic Coordinate readouts and recommendations */}
              <div className="w-full mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-[10px] text-slate-400 font-extrabold uppercase">POSICIONAMIENTO PEYEA</p>
                  <h4 className="font-sans font-bold text-lg text-slate-800">{peyeaResult.position}</h4>
                  <p className="font-sans text-xs text-slate-500 mt-1">
                    Dirección del Vector: Coordenadas X: <span className="font-semibold font-mono">{peyeaResult.x}</span>, Y: <span className="font-semibold font-mono">{peyeaResult.y}</span>
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-100 max-w-sm">
                  <span className="font-sans text-[10px] font-bold uppercase block tracking-wider">Plan de Acción Sugerido</span>
                  <p className="font-sans text-[11px] mt-0.5 leading-snug">
                    {peyeaResult.position === 'Agresiva' && 'Aprovechar la fortaleza para expandirse agresivamente, lanzar nuevos productos y penetrar mercado.'}
                    {peyeaResult.position === 'Competitiva' && 'Sostener alianzas clave, buscar eficiencias operativas y mejorar control de distribución.'}
                    {peyeaResult.position === 'Conservadora' && 'Consolidar productos rentables, mejorar la liquidez y evitar endeudamiento innecesario.'}
                    {peyeaResult.position === 'Defensiva' && 'Desinvertir stock inmovilizado con promociones agresivas, contraer costos de almacenamiento.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* 5. MCKINSEY GE PANEL */}
      {activeSubTab === 'mckinsey' && (
        <div className="space-y-6">
          {!isAllAligned && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="font-sans font-bold text-sm text-amber-800">Alerta de Desalineación Estratégica</span>
              </div>
              <p className="font-sans text-xs text-slate-700 leading-relaxed">
                Se ha detectado una discrepancia en las conclusiones estratégicas de las matrices de posicionamiento. Esto ocurre cuando el estado de los factores internos/externos, las unidades registradas o las fuerzas financieras no apuntan a la misma dirección estratégica general:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz IE:</strong> Recomienda <span className="font-semibold text-amber-800">"{ieResult.region}"</span> (Celda {ieResult.cell})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz McKinsey:</strong> Recomienda <span className="font-semibold text-amber-800">"{mckRegion}"</span> (Atractivo Promedio: {avgMckAttr.toFixed(2)}, Competitividad Promedio: {avgMckStrength.toFixed(2)})
                </li>
                <li className="font-sans text-[11px] text-slate-600">
                  <strong className="text-slate-700">Matriz PEYEA:</strong> Recomienda postura <span className="font-semibold text-amber-800">"{peyeaResult.position}"</span> (Equivalente a "{peyeaEquivalentRegion}")
                </li>
              </ul>
              <p className="font-sans text-[10px] text-slate-500 italic pt-1 border-t border-amber-200/50">
                Sugerencia: Revise las calificaciones, ponderaciones de los factores FODA (que alimentan EFI/EFE/IE) o ajuste los datos de las Unidades de Negocio en McKinsey para lograr coherencia metodológica.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Business Units for McKinsey */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs h-fit">
              <h3 className="font-sans font-bold text-sm text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                {editingMckinsey ? 'Editar Unidad Estratégica' : 'Registrar Unidad de Negocio'}
              </h3>
              <form onSubmit={handleAddOrEditMckinseyUnit} className="space-y-4">
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre de la Unidad / Línea de Producto</label>
                  <input
                    type="text"
                    value={mckName}
                    onChange={(e) => setMckName(e.target.value)}
                    placeholder="Ej. Línea Autos Livianos Volt City..."
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 font-sans text-xs text-slate-800 transition-all outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Atractivo Industria (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={mckAttr}
                      onChange={(e) => setMckAttr(parseFloat(e.target.value) || 3.0)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Fuerza Competitiva (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={mckStrength}
                      onChange={(e) => setMckStrength(parseFloat(e.target.value) || 3.0)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Participación de Mercado % (Tamaño Burbuja)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={mckShare}
                    onChange={(e) => setMckShare(parseInt(e.target.value) || 25)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                  />
                </div>
                <div className="flex space-x-2 pt-1">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>{editingMckinsey ? 'Guardar Unidad' : 'Agregar Unidad'}</span>
                  </button>
                  {editingMckinsey && (
                    <button type="button" onClick={() => { setEditingMckinsey(null); setMckName(''); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2.5 rounded-xl font-sans text-xs font-semibold">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* McKinsey 9-Quadrant Graphic Visualization */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
                <h3 className="font-sans font-bold text-base text-slate-800 mb-4 self-start">Gráfico de Burbujas McKinsey GE (9 Cuadrantes)</h3>
                
                <div className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Horizontal 3 segments for Strength (Alta, Media, Baja mapped from 5 down to 1) */}
                    {/* Vertical 3 segments for Attractiveness (Alta, Media, Baja mapped from 5 down to 1) */}
                    {/* Grid colors: Green zone (invertir/crecer), Yellow zone (mantener/seleccionar), Red zone (cosechar/desinvertir) */}
                    
                    {/* Quadrant backgrounds */}
                    {/* ROW 1 (Alta Atractivo 5 to 3.6) */}
                    <rect x="0" y="0" width="133" height="100" fill="#d1fae5" fillOpacity="0.3" /> {/* Alto-Alto */}
                    <rect x="133" y="0" width="134" height="100" fill="#d1fae5" fillOpacity="0.2" /> {/* Alto-Medio */}
                    <rect x="267" y="0" width="133" height="100" fill="#fef3c7" fillOpacity="0.3" /> {/* Alto-Bajo */}

                    {/* ROW 2 (Medio Atractivo 3.6 to 2.5) */}
                    <rect x="0" y="100" width="133" height="100" fill="#d1fae5" fillOpacity="0.2" /> {/* Medio-Alto */}
                    <rect x="133" y="100" width="134" height="100" fill="#fef3c7" fillOpacity="0.3" /> {/* Medio-Medio */}
                    <rect x="267" y="100" width="133" height="100" fill="#fee2e2" fillOpacity="0.2" /> {/* Medio-Bajo */}

                    {/* ROW 3 (Bajo Atractivo 2.5 to 1) */}
                    <rect x="0" y="200" width="133" height="100" fill="#fef3c7" fillOpacity="0.3" /> {/* Bajo-Alto */}
                    <rect x="133" y="200" width="134" height="100" fill="#fee2e2" fillOpacity="0.2" /> {/* Bajo-Medio */}
                    <rect x="267" y="200" width="133" height="100" fill="#fee2e2" fillOpacity="0.4" /> {/* Bajo-Bajo */}

                    {/* Borders grid */}
                    <line x1="133" y1="0" x2="133" y2="300" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" />
                    <line x1="267" y1="0" x2="267" y2="300" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" />
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2" />

                    {/* Axis Labels */}
                    <text x="5" y="55" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace">ATRACTIVO INDUST. ALTO</text>
                    <text x="5" y="155" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace">ATRACTIVO INDUST. MEDIO</text>
                    <text x="5" y="255" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace">ATRACTIVO INDUST. BAJO</text>

                    <text x="50" y="295" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">FUERTE</text>
                    <text x="200" y="295" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">MEDIA</text>
                    <text x="330" y="295" fill="#475569" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">DÉBIL</text>

                    {/* Render units as bubble elements */}
                    {strategicAnalysis.mckinseyUnits.map(unit => {
                      // Map range 1-5 to pixel coords
                      // Strength scale: 5 is Left (0 px) down to 1 which is Right (400 px)
                      // Attractiveness scale: 5 is Top (0 px) down to 1 which is Bottom (300 px)
                      const xPos = 400 - ((unit.competitiveStrength - 1) / 4) * 400;
                      const yPos = 300 - ((unit.industryAttractiveness - 1) / 4) * 300;
                      
                      // Radius based on marketShare (max 100% -> radius 30px)
                      const rad = Math.max(10, Math.min(30, (unit.marketShare / 100) * 30 + 8));
                      
                      return (
                        <g key={unit.id} className="group cursor-pointer">
                          <circle cx={xPos} cy={yPos} r={rad} fill="#3b82f6" fillOpacity="0.6" stroke="#1d4ed8" strokeWidth="2" />
                          <text x={xPos} y={yPos + 2} fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                            {unit.name.substring(0, 10)}...
                          </text>
                          {/* Bubble tooltip display */}
                          <title>{`${unit.name}\nAtractivo: ${unit.industryAttractiveness}\nFuerza: ${unit.competitiveStrength}\nParticipación: ${unit.marketShare}%`}</title>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Units List */}
                <div className="w-full mt-4 space-y-2">
                  <span className="font-sans text-[10px] font-bold text-slate-500 uppercase">Unidades Estratégicas Registradas</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {strategicAnalysis.mckinseyUnits.map(u => {
                      const classification = getMcKinseyClassification(u.industryAttractiveness, u.competitiveStrength);
                      return (
                        <div key={u.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between group">
                          <div className="space-y-1">
                            <p className="font-sans font-bold text-xs text-slate-800">{u.name}</p>
                            <p className="font-sans text-[10px] text-slate-500">
                              Atractivo: {u.industryAttractiveness} | Fuerza: {u.competitiveStrength} | Share: {u.marketShare}%
                            </p>
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold border ${classification.color}`}>
                              {classification.text}
                            </span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingMckinsey(u); setMckName(u.name); setMckAttr(u.industryAttractiveness); setMckStrength(u.competitiveStrength); setMckShare(u.marketShare); }} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteMckinseyUnit(u.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Transcribed Analysis Box */}
            {(() => {
              const ieAnalysisVal = strategicAnalysis.ieAnalysisText ?? 'La Compañía de VoltEcuador es un jugador chico con competidores, sin embargo se posiciona en un mercado con crecimiento, con nuevas opciones de gestión en inventarios, restauración, servicio postventa y nuevas herramientas tecnológicas en evolución, además del aporte y el sentido de apoyo de leyes gubernamentales. Su enfoque debe ser en resistir y gestionar recursos existentes y financiamiento controlado de los productos.';
              const ieStrategyVal = strategicAnalysis.ieStrategyText ?? 'Invertir en la producción de áreas con valor en el mercado y en crecimiento, eliminar obstáculos de crecimiento, administración o producción como sistemas mal llevados, equipos no aptos, trabajos sin aportes, y redirigir el financiamiento con nuevos objetivos, estrategias defensivas selectivas de recursos financieros y tiempo para salud empresarial actual.';

              return (
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200/50 space-y-4 mt-4">
                  {/* Analysis Segment */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-blue-700 font-bold block uppercase tracking-wide">Análisis y Conclusión Estratégica</span>
                      {!isEditingIeAnalysis && (
                        <button
                          type="button"
                          onClick={() => {
                            setIeAnalysisEditVal(ieAnalysisVal);
                            setIsEditingIeAnalysis(true);
                          }}
                          className="text-[10px] text-blue-800 hover:text-blue-950 font-bold flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Editar</span>
                        </button>
                      )}
                    </div>

                    {isEditingIeAnalysis ? (
                      <div className="space-y-2">
                        <textarea
                          value={ieAnalysisEditVal}
                          onChange={(e) => setIeAnalysisEditVal(e.target.value)}
                          className="w-full bg-white border border-blue-300 rounded-xl p-3 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px]"
                          placeholder="Escribe el análisis y conclusión estratégica..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingIeAnalysis(false)}
                            className="bg-blue-100/50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                          >
                            <X className="h-3 w-3" />
                            <span>Cancelar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerUpdate({
                                ...strategicAnalysis,
                                ieAnalysisText: ieAnalysisEditVal.trim()
                              });
                              setIsEditingIeAnalysis(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            <span>Guardar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-sans text-xs text-slate-700 leading-relaxed italic">
                        «De acuerdo con los datos tabulados y la ubicación en el gráfico de la Matriz de McKinsey (Atractividad: {avgMckAttr.toFixed(2)}, Posición Competitiva: {avgMckStrength.toFixed(2)}), el producto/negocio se sitúa en un cuadrante de perfil {avgMckAttr >= 3.6 ? 'alto' : avgMckAttr >= 2.5 ? 'medio' : 'bajo'}, lo que justifica el siguiente análisis:
                        <br />
                        <span className="block mt-1.5 text-slate-800 font-medium not-italic">{ieAnalysisVal}</span>»
                      </p>
                    )}
                  </div>

                  {/* Strategy Segment */}
                  <div className="border-t border-blue-200/30 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-blue-700 font-bold block uppercase tracking-wide">Estrategia Específica (Sincronizada con Portafolio IE)</span>
                      {!isEditingIeStrategy && (
                        <button
                          type="button"
                          onClick={() => {
                            setIeStrategyEditVal(ieStrategyVal);
                            setIsEditingIeStrategy(true);
                          }}
                          className="text-[10px] text-blue-800 hover:text-blue-950 font-bold flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Editar</span>
                        </button>
                      )}
                    </div>

                    {isEditingIeStrategy ? (
                      <div className="space-y-2">
                        <textarea
                          value={ieStrategyEditVal}
                          onChange={(e) => setIeStrategyEditVal(e.target.value)}
                          className="w-full bg-white border border-blue-300 rounded-xl p-3 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px]"
                          placeholder="Escribe la estrategia de portafolio..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingIeStrategy(false)}
                            className="bg-blue-100/50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                          >
                            <X className="h-3 w-3" />
                            <span>Cancelar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerUpdate({
                                ...strategicAnalysis,
                                ieStrategyText: ieStrategyEditVal.trim()
                              });
                              setIsEditingIeStrategy(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors"
                          >
                            <Check className="h-3 w-3" />
                            <span>Guardar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-sans text-xs text-slate-700 leading-relaxed italic">
                        «{ieStrategyVal}»
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 6. ATTRACTIVENESS - COMPETITIVENESS PANEL */}
      {activeSubTab === 'atractivo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs h-fit">
              <h3 className="font-sans font-bold text-sm text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
                {editingCompetitiveness ? 'Editar Producto / Marca' : 'Evaluar Producto o Marca'}
              </h3>
              <form onSubmit={handleAddOrEditCompetitivenessUnit} className="space-y-4">
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre del Producto / SBU</label>
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder="Ej. Volt Cargo (Delivery)..."
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3 font-sans text-xs text-slate-800 transition-all outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Atractivo del Mercado (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={compAttr}
                    onChange={(e) => setCompAttr(parseFloat(e.target.value) || 3.0)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Competitividad del Producto (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={compStrength}
                    onChange={(e) => setCompStrength(parseFloat(e.target.value) || 3.0)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-2.5 font-mono text-xs text-slate-800 outline-hidden"
                  />
                </div>
                <div className="flex space-x-2 pt-1">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>{editingCompetitiveness ? 'Guardar Cambios' : 'Registrar Producto'}</span>
                  </button>
                  {editingCompetitiveness && (
                    <button type="button" onClick={() => { setEditingCompetitiveness(null); setCompName(''); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2.5 rounded-xl font-sans text-xs font-semibold">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Strategic Map visual */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="font-sans font-bold text-base text-slate-800 mb-4">Mapa Estratégico Atractivo - Competitividad</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {strategicAnalysis.competitivenessUnits.map(unit => {
                    const rec = getCompetitivenessRec(unit.marketAttractiveness, unit.businessCompetitiveness);
                    return (
                      <div key={unit.id} className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-3 group hover:border-blue-400 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-sans font-bold text-xs text-slate-800">{unit.name}</h4>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingCompetitiveness(unit); setCompName(unit.name); setCompAttr(unit.marketAttractiveness); setCompStrength(unit.businessCompetitiveness); }} className="text-slate-400 hover:text-blue-600"><Edit3 className="h-3 w-3" /></button>
                              <button onClick={() => handleDeleteCompetitivenessUnit(unit.id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 text-[10px] text-slate-500 mt-1.5 font-mono">
                            <span>Atractivo: <strong className="text-slate-700">{unit.marketAttractiveness}</strong></span>
                            <span>Competitividad: <strong className="text-slate-700">{unit.businessCompetitiveness}</strong></span>
                          </div>
                        </div>
                        <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 text-blue-800 text-[10px] font-medium leading-snug">
                          Recomendación: {rec}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. GRAND STRATEGY PANEL */}
      {activeSubTab === 'gran-estrategia' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="font-sans font-bold text-lg text-slate-800 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <span>Matriz de la Gran Estrategia (Grand Strategy)</span>
              </h2>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Clasificación de posicionamiento competitivo frente al crecimiento del sector de mercado de VoltEcuador.
              </p>
            </div>

            {/* Selection Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-150">
              <div className="space-y-3">
                <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">1. Posición Competitiva de VoltEcuador</label>
                <div className="flex bg-slate-200 p-1 rounded-xl">
                  <button
                    onClick={() => handleToggleGrandStrategy('pos', 'fuerte')}
                    className={`flex-1 py-2 rounded-lg font-sans text-xs font-bold transition-all ${
                      strategicAnalysis.grandStrategy.competitivePosition === 'fuerte' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Fuerte Posición Competitiva
                  </button>
                  <button
                    onClick={() => handleToggleGrandStrategy('pos', 'debil')}
                    className={`flex-1 py-2 rounded-lg font-sans text-xs font-bold transition-all ${
                      strategicAnalysis.grandStrategy.competitivePosition === 'debil' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Débil Posición Competitiva
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">2. Crecimiento del Mercado en Ecuador</label>
                <div className="flex bg-slate-200 p-1 rounded-xl">
                  <button
                    onClick={() => handleToggleGrandStrategy('growth', 'rapido')}
                    className={`flex-1 py-2 rounded-lg font-sans text-xs font-bold transition-all ${
                      strategicAnalysis.grandStrategy.marketGrowth === 'rapido' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Rápido Crecimiento del Sector (Micromovilidad)
                  </button>
                  <button
                    onClick={() => handleToggleGrandStrategy('growth', 'lento')}
                    className={`flex-1 py-2 rounded-lg font-sans text-xs font-bold transition-all ${
                      strategicAnalysis.grandStrategy.marketGrowth === 'lento' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lento Crecimiento del Sector (Ventas de Combustión)
                  </button>
                </div>
              </div>
            </div>

            {/* McKinsey Synchronization & Custom Override Space */}
            <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-blue-700 font-bold block uppercase tracking-wide">
                    Sincronización con Matriz McKinsey
                  </span>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Por defecto, el cuadrante se calcula dinámicamente según la celda de tus Unidades de McKinsey. Puedes mantener el cálculo automático o seleccionar manualmente un cuadrante personalizado.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                    strategicAnalysis.grandStrategy.customQuadrantId === undefined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 animate-pulse ${
                      strategicAnalysis.grandStrategy.customQuadrantId === undefined ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                    {strategicAnalysis.grandStrategy.customQuadrantId === undefined ? 'Vínculo McKinsey Activo' : 'Personalizado / Guardado'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Modo de Selección de Estrategia
                  </label>
                  <select
                    value={strategicAnalysis.grandStrategy.customQuadrantId === undefined ? 'auto' : 'manual'}
                    onChange={(e) => {
                      const mode = e.target.value;
                      if (mode === 'auto') {
                        const updated = {
                          ...strategicAnalysis.grandStrategy,
                        };
                        delete updated.customQuadrantId;
                        triggerUpdate({ ...strategicAnalysis, grandStrategy: updated });
                        setSuccessToast('Sincronización automática de McKinsey activada correctamente');
                        setTimeout(() => setSuccessToast(null), 3000);
                      } else {
                        const computedId = grandStratResult.computedId ?? 1;
                        const updated = {
                          ...strategicAnalysis.grandStrategy,
                          customQuadrantId: computedId
                        };
                        triggerUpdate({ ...strategicAnalysis, grandStrategy: updated });
                        setSuccessToast('Modo de selección manual activado');
                        setTimeout(() => setSuccessToast(null), 3000);
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 font-sans text-xs text-slate-800 outline-hidden focus:border-blue-500 transition-all"
                  >
                    <option value="auto">Automático (Vínculo McKinsey)</option>
                    <option value="manual">Manual (Personalizar Celda)</option>
                  </select>
                </div>

                {strategicAnalysis.grandStrategy.customQuadrantId !== undefined && (
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Seleccionar Nuevo Cuadrante de Estrategia
                    </label>
                    <select
                      value={strategicAnalysis.grandStrategy.customQuadrantId}
                      onChange={(e) => {
                        const newId = parseInt(e.target.value);
                        let pos: 'fuerte' | 'debil' = 'fuerte';
                        let growth: 'rapido' | 'lento' = 'rapido';
                        if (newId === 1) { pos = 'fuerte'; growth = 'rapido'; }
                        else if (newId === 2) { pos = 'debil'; growth = 'rapido'; }
                        else if (newId === 3) { pos = 'debil'; growth = 'lento'; }
                        else if (newId === 4) { pos = 'fuerte'; growth = 'lento'; }

                        const updated = {
                          ...strategicAnalysis.grandStrategy,
                          customQuadrantId: newId,
                          competitivePosition: pos,
                          marketGrowth: growth
                        };
                        triggerUpdate({ ...strategicAnalysis, grandStrategy: updated });
                        setSuccessToast('Cuadrante personalizado guardado con éxito');
                        setTimeout(() => setSuccessToast(null), 3000);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-sans text-xs text-slate-800 outline-hidden focus:border-blue-500 transition-all"
                    >
                      <option value={1}>Cuadrante I: Zona Alta (Invertir / Crecer)</option>
                      <option value={2}>Cuadrante II: Celda de (Selectividad / Reevaluación)</option>
                      <option value={3}>Cuadrante III: Zona Baja (Cosechar / Desinvestir)</option>
                      <option value={4}>Cuadrante IV: Celda de (Cosechar con Táctica / Retener y Mantener)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Grid showing active Quadrant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* 2x2 grid representing quadrants */}
              <div className="aspect-square w-full max-w-sm border border-slate-300 rounded-2xl grid grid-cols-2 overflow-hidden shadow-inner">
                {/* Cuadrante II */}
                <div className={`p-4 flex flex-col items-center justify-center text-center border-r border-b border-slate-200 transition-all ${
                  grandStratResult.id === 2 ? 'bg-blue-600 text-white shadow-lg z-10 scale-102' : 'bg-slate-50 text-slate-400'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider mb-1">Cuadrante II</span>
                  <span className="font-sans text-[11px] leading-snug">Débil / Rápido Crecimiento</span>
                  {grandStratResult.id === 2 && <span className="mt-2 bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">ACTIVO</span>}
                </div>
                {/* Cuadrante I */}
                <div className={`p-4 flex flex-col items-center justify-center text-center border-b border-slate-200 transition-all ${
                  grandStratResult.id === 1 ? 'bg-blue-600 text-white shadow-lg z-10 scale-102' : 'bg-slate-50 text-slate-400'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider mb-1">Cuadrante I</span>
                  <span className="font-sans text-[11px] leading-snug">Fuerte / Rápido Crecimiento</span>
                  {grandStratResult.id === 1 && <span className="mt-2 bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">ACTIVO</span>}
                </div>
                {/* Cuadrante III */}
                <div className={`p-4 flex flex-col items-center justify-center text-center border-r border-slate-200 transition-all ${
                  grandStratResult.id === 3 ? 'bg-blue-600 text-white shadow-lg z-10 scale-102' : 'bg-slate-50 text-slate-400'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider mb-1">Cuadrante III</span>
                  <span className="font-sans text-[11px] leading-snug">Débil / Lento Crecimiento</span>
                  {grandStratResult.id === 3 && <span className="mt-2 bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">ACTIVO</span>}
                </div>
                {/* Cuadrante IV */}
                <div className={`p-4 flex flex-col items-center justify-center text-center transition-all ${
                  grandStratResult.id === 4 ? 'bg-blue-600 text-white shadow-lg z-10 scale-102' : 'bg-slate-50 text-slate-400'
                }`}>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider mb-1">Cuadrante IV</span>
                  <span className="font-sans text-[11px] leading-snug">Fuerte / Lento Crecimiento</span>
                  {grandStratResult.id === 4 && <span className="mt-2 bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">ACTIVO</span>}
                </div>
              </div>

              {/* Recommendations and descriptions */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-sans text-[10px] text-blue-600 font-extrabold uppercase tracking-wide">RESULTADO DE CLASIFICACIÓN</span>
                  <h4 className="font-sans font-bold text-xl text-slate-800">{grandStratResult.text}</h4>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">{grandStratResult.desc}</p>
                </div>
                {(() => {
                  const mckConclusion = (() => {
                    switch (grandStratResult.id) {
                      case 1:
                        return {
                          title: 'Conclusión de la Gran Estrategia',
                          subtitle: 'Zona Alta de "Invertir / Crecer" (McKinsey)',
                          desc: '«La coincidencia estratégica con la Zona Alta de "Invertir / Crecer" en la matriz McKinsey confirma que VoltEcuador goza de una posición óptima. La alta atractividad de la micromovilidad eléctrica combinada con una competitividad sólida exige una inyección prioritaria de recursos, penetración agresiva del mercado y expansión de la gama de vehículos para consolidar el liderazgo sectorial.»'
                        };
                      case 2:
                        return {
                          title: 'Conclusión de la Gran Estrategia',
                          subtitle: 'Celda de "Selectividad / Reevaluación" (McKinsey)',
                          desc: '«Vinculado con la Celda de "Selectividad / Reevaluación" de la matriz McKinsey, se identifica que el rápido crecimiento del mercado de micromovilidad contrasta con una posición competitiva interna que aún debe madurar. El diagnóstico recomienda reevaluar selectivamente el enfoque comercial, priorizar los nichos de mayor margen operativo y fortalecer las capacidades técnicas antes de intentar una expansión a gran escala.»'
                        };
                      case 3:
                        return {
                          title: 'Conclusión de la Gran Estrategia',
                          subtitle: 'Zona Baja de "Cosechar / Desinvestir" (McKinsey)',
                          desc: '«De acuerdo con la relación directa con la Zona Baja de "Cosechar / Desinvestir" en McKinsey, se confirma que VoltEcuador enfrenta un cuadrante de crecimiento lento y baja fuerza competitiva. El atrincheramiento es metodológicamente imperativo: cambios drásticos para evitar caídas mayores, reducción de costos de ensamblaje, liquidación del stock congelado en bodegas y reasignación cuidadosa de recursos hacia áreas de rentabilidad garantizada.»'
                        };
                      case 4:
                      default:
                        return {
                          title: 'Conclusión de la Gran Estrategia',
                          subtitle: 'Celda de "Cosechar con Táctica / Retener y Mantener" (McKinsey)',
                          desc: '«Asociado a la Celda de "Cosechar con Táctica / Retener y Mantener" de la matriz McKinsey, VoltEcuador se encuentra en un mercado maduro de lento crecimiento, pero con una sólida posición competitiva. Se diagnostica la necesidad de maximizar flujos de caja mediante una cosecha táctica inteligente, mantener y retener la cartera de clientes de flotas mediante soporte técnico de talleres premium, y buscar alianzas estratégicas para asegurar la estabilidad.»'
                        };
                    }
                  })();

                  const bgClass = 'bg-blue-50/60 border-blue-200/60 text-blue-900';
                  const titleColor = 'text-blue-800';
                  const subColor = 'text-blue-600';

                  return (
                    <div className={`p-4 rounded-xl border ${bgClass}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <span className={`font-sans text-[11px] font-bold block uppercase tracking-wide ${titleColor}`}>
                          {mckConclusion.title}
                        </span>
                        <span className="font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full inline-block self-start bg-blue-100/80 text-blue-800">
                          {mckConclusion.subtitle}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-slate-700 leading-relaxed italic">
                        {mckConclusion.desc}
                      </p>
                    </div>
                  );
                })()}
                <div className="space-y-2">
                  <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Estrategias Recomendadas</span>
                  <div className="flex flex-wrap gap-2">
                    {grandStratResult.recs.map(rec => (
                      <span key={rec} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 text-xs font-sans font-semibold">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. INTEGRAL STRATEGIC DIAGNOSIS */}
      {activeSubTab === 'diagnostico' && (() => {
        // Dynamic SWOT factors for diagnosis
        const dynamicStrengths = [...strategicAnalysis.swotFactors]
          .filter(f => f.type === 'fortaleza')
          .sort((a, b) => (b.weight * b.rating) - (a.weight * a.rating))
          .slice(0, 3);

        const dynamicWeaknesses = [...strategicAnalysis.swotFactors]
          .filter(f => f.type === 'debilidad')
          .sort((a, b) => (b.weight * b.rating) - (a.weight * a.rating))
          .slice(0, 3);

        const dynamicOpportunities = [...strategicAnalysis.swotFactors]
          .filter(f => f.type === 'oportunidad')
          .sort((a, b) => (b.weight * b.rating) - (a.weight * a.rating))
          .slice(0, 3);

        const dynamicThreats = [...strategicAnalysis.swotFactors]
          .filter(f => f.type === 'amenaza')
          .sort((a, b) => (b.weight * b.rating) - (a.weight * a.rating))
          .slice(0, 3);

        // Dynamic Recommendations based on Matrix Results
        const marketingRec = peyeaResult.position === 'Agresiva' || peyeaResult.position === 'Competitiva'
          ? 'Invertir en marketing digital de alto impacto, expansión de canales y campañas agresivas de posicionamiento para capitalizar la fuerte ventaja competitiva y penetrar mercado.'
          : peyeaResult.position === 'Conservadora'
            ? 'Enfocar campañas en nichos de alta rentabilidad, fidelización de clientes actuales, optimización de presupuestos promocionales y potenciar la marca Volt de forma selectiva.'
            : 'Estrategia de supervivencia: campañas de liquidación de stock inmovilizado con promociones directas, ofertas agrupadas y mínima inversión publicitaria fija.';

        const investmentRec = ieResult.region === 'Crecer y construir'
          ? 'Inyección de capital prioritaria para el desarrollo de nuevos productos, expansión de sucursales físicas/digitales y adquisición de tecnologías limpias de punta.'
          : ieResult.region === 'Mantener y sostener'
            ? 'Inversión prudente y selectiva enfocada en la modernización de inventarios, mejora de los procesos postventa y optimización operativa de talleres.'
            : 'Desinversión o cosecha: maximizar flujos de caja reduciendo inventario congelado, minimizar gastos de mantenimiento en bodegas y transferir recursos a líneas fuertes.';

        const strategicRec = grandStratResult.id === 1
          ? 'Mantener el rumbo de rápido crecimiento apoyándose en la penetración de mercado. Evaluar adquisiciones estratégicas locales y consolidar el liderazgo de flotas.'
          : grandStratResult.id === 2 || grandStratResult.id === 4
            ? 'Corregir con urgencia las debilidades operativas internas para no perder la inercia del mercado, o diversificar la oferta hacia nichos conexos de energía limpia.'
            : 'Reorganización y reestructuración radical. Recortar costes fijos de forma drástica, fusionar operaciones redundantes de bodega y renegociar con proveedores internacionales.';

        // Indicators
        const competitivenessLevel = efiWeightedTotal >= 3.0 ? 'Fuerte / Alta' : efiWeightedTotal >= 2.5 ? 'Promedio' : 'Débil / Vulnerable';
        const growthPotential = ieResult.region === 'Crecer y construir' ? 'Elevado / Expansivo' : ieResult.region === 'Mantener y sostener' ? 'Moderado / Estable' : 'Limitado / Cosecha';
        const businessRisk = efeWeightedTotal >= 3.0 ? 'Bajo / Favorable' : efeWeightedTotal >= 2.5 ? 'Medio / Controlado' : 'Alto / Vulnerable';

        // Radar chart 8 dimensions dataset
        const radarData = [
          { subject: 'Capacidad Interna (EFI)', valor: Math.round(efiNorm), fullMark: 100 },
          { subject: 'Atractivo Externo (EFE)', valor: Math.round(efeNorm), fullMark: 100 },
          { subject: 'Fuerza Financiera (PEYEA)', valor: Math.round((peyeaResult.ffAvg / 6) * 100), fullMark: 100 },
          { subject: 'Fuerza Sector (PEYEA)', valor: Math.round((peyeaResult.fiAvg / 6) * 100), fullMark: 100 },
          { subject: 'Ventaja Competitiva', valor: Math.round(((6 + peyeaResult.vcAvg) / 5) * 100), fullMark: 100 },
          { subject: 'Estabilidad Entorno', valor: Math.round(((6 + peyeaResult.eeAvg) / 5) * 100), fullMark: 100 },
          { subject: 'Portafolio (McKinsey)', valor: Math.round(mckNorm), fullMark: 100 },
          { subject: 'Atractivo Competitivo', valor: Math.round(compNorm), fullMark: 100 },
        ];

        return (
          <div className="space-y-6">
            {/* Main Header / Card Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="font-sans font-bold text-lg text-slate-800 mb-1 flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-600 animate-pulse" />
                <span>Diagnóstico Estratégico Integral</span>
              </h2>
              <p className="font-sans text-xs text-slate-500 mb-6 pb-3 border-b border-slate-100">
                Consolidación en tiempo real de todos los modelos de negocio y matrices operativas para la toma de decisiones estratégicas.
              </p>

              {/* Business Indicators grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Score Index Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-150 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>
                  <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ÍNDICE ESTRATÉGICO GLOBAL</span>
                  <div className="relative my-3 h-20 w-20 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="34" 
                        stroke="#2563eb" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 34} 
                        strokeDashoffset={2 * Math.PI * 34 * (1 - strategicScore / 100)} 
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-mono text-2xl font-black text-slate-800">{strategicScore}%</span>
                  </div>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${scoreMeta.textCol} ${scoreMeta.border} bg-white shadow-2xs`}>
                    {scoreMeta.text}
                  </span>
                </div>

                {/* Competitividad Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-150 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-500"></div>
                  <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">NIVEL DE COMPETITIVIDAD</span>
                  <div className="my-2">
                    <h4 className={`font-sans font-extrabold text-lg text-indigo-700 leading-snug`}>{competitivenessLevel}</h4>
                    <p className="font-sans text-[11px] text-slate-500 mt-1">Sustentado en el desempeño operativo interno del negocio de VoltEcuador.</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono border-t border-slate-100 pt-2 text-slate-600">
                    <span>EFI Score:</span>
                    <strong className="text-slate-800">{efiWeightedTotal.toFixed(2)} / 4.00</strong>
                  </div>
                </div>

                {/* Potencial de Crecimiento Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-150 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500"></div>
                  <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">POTENCIAL DE CRECIMIENTO</span>
                  <div className="my-2">
                    <h4 className="font-sans font-extrabold text-lg text-emerald-700 leading-snug">{growthPotential}</h4>
                    <p className="font-sans text-[11px] text-slate-500 mt-1">Determinado por la ubicación de cartera en la Matriz Interna-Externa.</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono border-t border-slate-100 pt-2 text-slate-600">
                    <span>Región IE:</span>
                    <strong className="text-slate-800">{ieResult.region}</strong>
                  </div>
                </div>

                {/* Riesgo de Negocio Card */}
                <div className="bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-150 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-500"></div>
                  <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">RIESGO DE NEGOCIO</span>
                  <div className="my-2">
                    <h4 className="font-sans font-extrabold text-lg text-rose-700 leading-snug">{businessRisk}</h4>
                    <p className="font-sans text-[11px] text-slate-500 mt-1">Sensibilidad a variables externas y estabilidad del entorno nacional.</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono border-t border-slate-100 pt-2 text-slate-600">
                    <span>EFE Score:</span>
                    <strong className="text-slate-800">{efeWeightedTotal.toFixed(2)} / 4.00</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart Visual Block */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Radar Chart Display */}
              <div className="lg:col-span-2 flex flex-col items-center">
                <h3 className="font-sans font-bold text-sm text-slate-800 mb-3 self-start">Perfil de Desempeño Estratégico Unificado</h3>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter', fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <Radar name="Desempeño" dataKey="valor" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.25} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Cumplimiento']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Analysis of Radar Profile */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-4">
                <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ANÁLISIS DE PERFIL UNIFICADO</span>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  El gráfico de radar unifica el rendimiento de <strong className="text-slate-800">8 dimensiones estratégicas clave</strong> de la empresa.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2.5">
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5"></div>
                    <p className="font-sans text-[11px] text-slate-600 leading-normal">
                      <strong className="text-slate-700">Equilibrio Operativo:</strong> {Math.abs(efiNorm - efeNorm) < 15 ? 'Existe alineación entre la preparación interna y las oportunidades del mercado.' : 'Hay desequilibrio; la capacidad interna no está coordinada con los desafíos ambientales externos.'}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5"></div>
                    <p className="font-sans text-[11px] text-slate-600 leading-normal">
                      <strong className="text-slate-700">Dimensión Crítica:</strong> La estabilidad del entorno ({radarData[5].valor}%) y la rotación del portafolio representan las áreas que exigen mayor atención inmediata.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mt-4">
                  <span className="font-sans text-[10px] text-blue-700 font-bold block uppercase tracking-wide">POSTURA RECOMENDADA</span>
                  <p className="font-sans text-[11px] text-slate-600 mt-1 leading-snug">
                    {ieResult.region === 'Crecer y construir' ? 'Postura ofensiva y de inversión enfocada en ganar cuota de mercado.' : ieResult.region === 'Mantener y sostener' ? 'Postura selectiva de especialización y optimización de costes fijos.' : 'Postura de defensa o desinversión, liquidando activos o stock de bajo movimiento.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Critical Factors from SWOT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Fortalezas Críticas */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">FORTALEZAS CRÍTICAS (EFI)</span>
                {dynamicStrengths.length > 0 ? (
                  <div className="space-y-2.5">
                    {dynamicStrengths.map(f => (
                      <div key={f.id} className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60 text-xs">
                        <p className="font-sans font-bold text-slate-800 leading-snug">{f.text}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                          <span>Peso: {f.weight}</span>
                          <span className="text-emerald-700 font-semibold">Calificación: {f.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-400 italic">No hay factores registrados.</p>
                )}
              </div>

              {/* Debilidades Prioritarias */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">DEBILIDADES PRIORITARIAS (EFI)</span>
                {dynamicWeaknesses.length > 0 ? (
                  <div className="space-y-2.5">
                    {dynamicWeaknesses.map(f => (
                      <div key={f.id} className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100/60 text-xs">
                        <p className="font-sans font-bold text-slate-800 leading-snug">{f.text}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                          <span>Peso: {f.weight}</span>
                          <span className="text-rose-700 font-semibold">Calificación: {f.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-400 italic">No hay factores registrados.</p>
                )}
              </div>

              {/* Oportunidades Estratégicas */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">OPORTUNIDADES (EFE)</span>
                {dynamicOpportunities.length > 0 ? (
                  <div className="space-y-2.5">
                    {dynamicOpportunities.map(f => (
                      <div key={f.id} className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100/60 text-xs">
                        <p className="font-sans font-bold text-slate-800 leading-snug">{f.text}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                          <span>Peso: {f.weight}</span>
                          <span className="text-blue-700 font-semibold">Calificación: {f.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-400 italic">No hay factores registrados.</p>
                )}
              </div>

              {/* Amenazas de Alto Impacto */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <span className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">AMENAZAS CRÍTICAS (EFE)</span>
                {dynamicThreats.length > 0 ? (
                  <div className="space-y-2.5">
                    {dynamicThreats.map(f => (
                      <div key={f.id} className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100/60 text-xs">
                        <p className="font-sans font-bold text-slate-800 leading-snug">{f.text}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                          <span>Peso: {f.weight}</span>
                          <span className="text-amber-700 font-semibold">Calificación: {f.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-slate-400 italic">No hay factores registrados.</p>
                )}
              </div>
            </div>

            {/* Strategic Recommendations Block */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">
                  Plan de Acción Estratégico Consolidado
                </h3>
                <p className="font-sans text-xs text-slate-500 mt-1">Recomendaciones de alto valor alineadas con el posicionamiento global de las matrices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Marketing */}
                <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 flex flex-col justify-between space-y-4 shadow-3xs">
                  <div className="space-y-2">
                    <span className="font-sans text-[10px] text-indigo-700 font-extrabold block uppercase tracking-wide">RECOMENDACIÓN DE MARKETING</span>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">{marketingRec}</p>
                  </div>
                  <div className="bg-indigo-100/50 text-indigo-800 px-3 py-2 rounded-xl text-[10px] font-sans font-semibold border border-indigo-200/50">
                    Módulo de Marketing Directo Sincronizado
                  </div>
                </div>

                {/* Investment */}
                <div className="p-4 bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl border border-emerald-100 flex flex-col justify-between space-y-4 shadow-3xs">
                  <div className="space-y-2">
                    <span className="font-sans text-[10px] text-emerald-700 font-extrabold block uppercase tracking-wide">RECOMENDACIÓN DE INVERSIÓN</span>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">{investmentRec}</p>
                  </div>
                  <div className="bg-emerald-100/50 text-emerald-800 px-3 py-2 rounded-xl text-[10px] font-sans font-semibold border border-emerald-200/50">
                    Presupuesto y Rotación de Activos
                  </div>
                </div>

                {/* Strategic Planning */}
                <div className="p-4 bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-blue-100 flex flex-col justify-between space-y-4 shadow-3xs">
                  <div className="space-y-2">
                    <span className="font-sans text-[10px] text-blue-700 font-extrabold block uppercase tracking-wide">PLANEACIÓN ESTRATÉGICA</span>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">{strategicRec}</p>
                  </div>
                  <div className="bg-blue-100/50 text-blue-800 px-3 py-2 rounded-xl text-[10px] font-sans font-semibold border border-blue-200/50">
                    Control de Hitos Corporativos
                  </div>
                </div>
              </div>
            </div>

            {/* Active Campaign Creators (Direct Integration) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-800 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span>Integración Estratégica Activa: Generar Objetivos y Tácticas en el Dashboard</span>
                </h3>
                <p className="font-sans text-xs text-slate-500 mt-1">
                  Conecte automáticamente los resultados de las matrices con su Plan de Marketing agregando objetivos específicos, tácticas y KPIs directamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Opción 1: Objetivo de Liquidación */}
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-150 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-indigo-700">
                      <Target className="h-5 w-5 shrink-0" />
                      <span className="font-sans text-xs font-bold uppercase tracking-wide">OBJETIVO ASOCIADO</span>
                    </div>
                    <h4 className="font-sans font-bold text-sm text-slate-800 leading-snug">
                      Liquidar inventario de autos livianos en un 35% en 6 meses
                    </h4>
                    <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                      Derivado del FODA / EFI. Diseñado para mitigar la debilidad de stock congelado y los altos costos financieros de bodega de repuestos Volt.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleCreateActiveIntegration(
                        'obj',
                        'Liquidar inventario de autos livianos en un 35% en un plazo de 6 meses',
                        'Mitigar la debilidad crítica de activos congelados en bodegas de VoltEcuador y mejorar flujo de caja inmediato.',
                        35
                      );
                      setSuccessToast('¡Objetivo Específico agregado con éxito en su Plan de Marketing!');
                      setTimeout(() => setSuccessToast(null), 4000);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold font-sans text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Vincular como Objetivo</span>
                  </button>
                </div>

                {/* Opción 2: Actividad de Venta empaquetada */}
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-150 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <Calendar className="h-5 w-5 shrink-0" />
                      <span className="font-sans text-xs font-bold uppercase tracking-wide">ACTIVIDAD TÁCTICA</span>
                    </div>
                    <h4 className="font-sans font-bold text-sm text-slate-800 leading-snug">
                      Campaña Corporativa de Micro-leasing Sostenible
                    </h4>
                    <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                      Derivado de PEYEA y McKinsey. Diseña una campaña dirigida a flotas comerciales verdes para incentivar la venta del stock remanente de Volt City.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleCreateActiveIntegration(
                        'act',
                        'Campaña Corporativa de Micro-leasing Sostenible con Garantía Extendida',
                        'Incentivar la venta del stock inmovilizado mediante un programa de leasing preferencial con soporte de taller incluido.',
                        4500
                      );
                      setSuccessToast('¡Actividad agregada con éxito a su Gestión de Actividades!');
                      setTimeout(() => setSuccessToast(null), 4000);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-sans text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Vincular como Actividad</span>
                  </button>
                </div>

                {/* Opción 3: KPI de Rotación */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-150 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <TrendingUp className="h-5 w-5 shrink-0" />
                      <span className="font-sans text-xs font-bold uppercase tracking-wide">MÉTRICA DE CONTROL / KPI</span>
                    </div>
                    <h4 className="font-sans font-bold text-sm text-slate-800 leading-snug">
                      Tasa de Rotación de Inventario (Autos en Bodega)
                    </h4>
                    <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                      Métrica clave para monitorear el progreso del saneamiento financiero. Permite controlar la velocidad de recuperación de activos inmovilizados.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleCreateActiveIntegration(
                        'kpi',
                        'Tasa de Rotación de Inventario de Autos',
                        'Monitorear la liquidación semanal del stock inmovilizado en bodega para la recuperación del capital financiero.',
                        60,
                        'Autos liquidados / Stock inicial'
                      );
                      setSuccessToast('¡KPI de Rotación de Inventario agregado con éxito a su Control de KPIs!');
                      setTimeout(() => setSuccessToast(null), 4000);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Vincular como KPI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-emerald-500/30 animate-fade-in">
          <Check className="h-5 w-5 bg-emerald-500/50 rounded-full p-0.5" />
          <span className="font-sans text-xs font-bold">{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:text-emerald-100 font-bold text-xs pl-2">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
