import { StrategicAnalysisState } from '../types';

export const DEFAULT_STRATEGIC_ANALYSIS: StrategicAnalysisState = {
  swotFactors: [
    // Fortalezas (EFI) - Page 7
    {
      id: 'f-1',
      text: 'Ventaja Competitiva en su taller de servicio',
      type: 'fortaleza',
      weight: 0.10,
      rating: 4,
      area: 'Operaciones'
    },
    {
      id: 'f-2',
      text: 'Marca Comercial con presencia significativa',
      type: 'fortaleza',
      weight: 0.10,
      rating: 2,
      area: 'Marketing'
    },
    {
      id: 'f-3',
      text: 'Certificaciones y patentes técnicas',
      type: 'fortaleza',
      weight: 0.20,
      rating: 3,
      area: 'Tecnología'
    },
    {
      id: 'f-4',
      text: 'Equipo y sistema de software en gestión',
      type: 'fortaleza',
      weight: 0.05,
      rating: 2,
      area: 'Tecnología'
    },
    {
      id: 'f-5',
      text: 'Contenido de Know how técnico alto',
      type: 'fortaleza',
      weight: 0.10,
      rating: 3,
      area: 'Tecnología'
    },

    // Debilidades (EFI) - Page 7 & 8
    {
      id: 'd-1',
      text: 'Dependencia a proveedores específicos',
      type: 'debilidad',
      weight: 0.10,
      rating: 2,
      area: 'Operaciones'
    },
    {
      id: 'd-2',
      text: 'Gestión de inventarios deficiente y recursos',
      type: 'debilidad',
      weight: 0.10,
      rating: 2,
      area: 'Finanzas'
    },
    {
      id: 'd-3',
      text: 'Innovación de productos limitados',
      type: 'debilidad',
      weight: 0.03,
      rating: 2,
      area: 'Tecnología'
    },
    {
      id: 'd-4',
      text: 'Bajo margen bruto de ganancia en el 25% en vehículos livianos',
      type: 'debilidad',
      weight: 0.12,
      rating: 2,
      area: 'Finanzas'
    },
    {
      id: 'd-5',
      text: 'Competencia se posiciona con ventajas competitivas mayores',
      type: 'debilidad',
      weight: 0.10,
      rating: 3,
      area: 'Marketing'
    },

    // Oportunidades (EFE) - Page 5 & 6
    {
      id: 'o-1',
      text: 'Incentivos gubernamentales',
      type: 'oportunidad',
      weight: 0.05,
      rating: 4,
      area: 'Otros'
    },
    {
      id: 'o-2',
      text: 'Nuevos marcos normativos para el sector de movilidad eléctrica',
      type: 'oportunidad',
      weight: 0.10,
      rating: 4,
      area: 'Otros'
    },
    {
      id: 'o-3',
      text: 'Tendencias globales ambientales',
      type: 'oportunidad',
      weight: 0.03,
      rating: 4,
      area: 'Otros'
    },
    {
      id: 'o-4',
      text: 'Descontento del mercado con transporte tradicional',
      type: 'oportunidad',
      weight: 0.10,
      rating: 4,
      area: 'Marketing'
    },
    {
      id: 'o-5',
      text: 'Mercado de movilidad eléctrica en crecimiento',
      type: 'oportunidad',
      weight: 0.12,
      rating: 4,
      area: 'Marketing'
    },

    // Amenazas (EFE) - Page 6 & 7
    {
      id: 'a-1',
      text: 'Evolución de las baterías de Litio y fácil conectividad 5G',
      type: 'amenaza',
      weight: 0.05,
      rating: 2,
      area: 'Tecnología'
    },
    {
      id: 'a-2',
      text: 'Eliminación de la exención arancelaria de automóviles eléctricos',
      type: 'amenaza',
      weight: 0.20,
      rating: 2,
      area: 'Finanzas'
    },
    {
      id: 'a-3',
      text: 'Obsolescencia de los productos por tiempo en bodega',
      type: 'amenaza',
      weight: 0.05,
      rating: 2,
      area: 'Operaciones'
    },
    {
      id: 'a-4',
      text: 'Contratos exclusivos y estrictos con alto poder de negociación de proveedores',
      type: 'amenaza',
      weight: 0.10,
      rating: 2,
      area: 'Operaciones'
    },
    {
      id: 'a-5',
      text: 'Mercado competitivo con la movilidad eléctrica',
      type: 'amenaza',
      weight: 0.10,
      rating: 2,
      area: 'Marketing'
    },
    {
      id: 'a-6',
      text: 'Inestabilidad de los ingresos fiscales y la disposición de pago',
      type: 'amenaza',
      weight: 0.05,
      rating: 3,
      area: 'Finanzas'
    },
    {
      id: 'a-7',
      text: 'Movilidad alternativa familiarizada y posicionada (tradicional)',
      type: 'amenaza',
      weight: 0.05,
      rating: 3,
      area: 'Marketing'
    }
  ],
  swotStrategies: [
    {
      id: 's-fo-1',
      type: 'FO',
      title: 'Maximización de Capacidad Técnica en Taller',
      description: 'Aprovechar las certificaciones técnicas y la marca comercial para capitalizar los incentivos gubernamentales y el descontento con el transporte tradicional.'
    },
    {
      id: 's-fa-1',
      type: 'FA',
      title: 'Blindaje Regulatorio y Soluciones Tecnológicas',
      description: 'Utilizar el know-how técnico alto para adaptarse a la evolución de baterías y conectividad 5G, minimizando el impacto de la eliminación de exención arancelaria.'
    },
    {
      id: 's-do-1',
      type: 'DO',
      title: 'Reestructuración de Canales y Gestión Operativa',
      description: 'Optimizar el software de gestión para corregir la deficiente rotación de inventarios ante el crecimiento acelerado de la movilidad eléctrica.'
    },
    {
      id: 's-da-1',
      type: 'DA',
      title: 'Estrategias Defensivas Selectivas de Supervivencia',
      description: 'Frente a contratos estrictos de proveedores y bajo margen, renegociar las cláusulas de exclusividad y disminuir los costos de inventario congelado.'
    }
  ],
  peyeaFactors: [
    // Fuerza Financiera (FF) -> Positive (1 to 6)
    { id: 'p-ff-1', dimension: 'FF', name: 'Retorno de la Inversión (ROI)', score: 3 },
    { id: 'p-ff-2', dimension: 'FF', name: 'Apalancamiento y Liquidez', score: 2 },
    { id: 'p-ff-3', dimension: 'FF', name: 'Capital de Trabajo', score: 3 },
    { id: 'p-ff-4', dimension: 'FF', name: 'Flujo de Caja Neto', score: 2 },
    // Estabilidad del Entorno (EE) -> Negative (-6 to -1)
    { id: 'p-ee-1', dimension: 'EE', name: 'Tasa de Inflación Nacional', score: -3 },
    { id: 'p-ee-2', dimension: 'EE', name: 'Presión de Competidores directos', score: -4 },
    { id: 'p-ee-3', dimension: 'EE', name: 'Barreras de entrada al mercado', score: -2 },
    { id: 'p-ee-4', dimension: 'EE', name: 'Variabilidad de la Demanda', score: -3 },
    // Fuerza de la Industria (FI) -> Positive (1 to 6)
    { id: 'p-fi-1', dimension: 'FI', name: 'Potencial de Crecimiento del Sector', score: 5 },
    { id: 'p-fi-2', dimension: 'FI', name: 'Estabilidad Financiera de la Industria', score: 4 },
    { id: 'p-fi-3', dimension: 'FI', name: 'Facilidad de acceso a tecnología limpia', score: 4 },
    { id: 'p-fi-4', dimension: 'FI', name: 'Aprovechamiento de Recursos', score: 3 },
    // Ventaja Competitiva (VC) -> Negative (-6 to -1)
    { id: 'p-vc-1', dimension: 'VC', name: 'Participación en el Mercado', score: -3 },
    { id: 'p-vc-2', dimension: 'VC', name: 'Calidad de los productos Volt', score: -2 },
    { id: 'p-vc-3', dimension: 'VC', name: 'Lealtad del Cliente', score: -3 },
    { id: 'p-vc-4', dimension: 'VC', name: 'Control sobre canales de distribución', score: -4 }
  ],
  mckinseyUnits: [
    {
      id: 'm-u-1',
      name: 'Portafolio VoltEcuador (Evaluación de Factores)',
      industryAttractiveness: 2.85,
      competitiveStrength: 2.75,
      marketShare: 35
    },
    {
      id: 'm-u-2',
      name: 'Unidad de Negocio (Atractivo - Competitividad)',
      industryAttractiveness: 3.20,
      competitiveStrength: 3.10,
      marketShare: 55
    }
  ],
  competitivenessUnits: [
    {
      id: 'c-u-1',
      name: 'Línea de Vehículos Livianos',
      marketAttractiveness: 3.2,
      businessCompetitiveness: 3.1
    },
    {
      id: 'c-u-2',
      name: 'Línea Soporte & Servicio Postventa',
      marketAttractiveness: 2.85,
      businessCompetitiveness: 2.75
    }
  ],
  grandStrategy: {
    competitivePosition: 'fuerte',
    marketGrowth: 'lento',
    customQuadrantId: 4
  },
  lastUpdated: '2026-07-01',
  history: [
    { date: 'Ene 2026', score: 48 },
    { date: 'Mar 2026', score: 50 },
    { date: 'May 2026', score: 52 },
    { date: 'Jul 2026', score: 55 }
  ],
  ieAnalysisText: 'La Compañía de VoltEcuador es un jugador chico con competidores, sin embargo se posiciona en un mercado con crecimiento, con nuevas opciones de gestión en inventarios, restauración, servicio postventa y nuevas herramientas tecnológicas en evolución, además del aporte y el sentido de apoyo de leyes gubernamentales. Su enfoque debe ser en resistir y gestionar recursos existentes y financiamiento controlado de los productos.',
  ieStrategyText: 'Invertir en la producción de áreas con valor en el mercado y en crecimiento, eliminar obstáculos de crecimiento, administración o producción como sistemas mal llevados, equipos no aptos, trabajos sin aportes, y redirigir el financiamiento con nuevos objetivos, estrategias defensivas selectivas de recursos financieros y tiempo para salud empresarial actual.'
};
