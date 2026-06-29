import { MarketingPlanState } from '../types';

export const INITIAL_MARKETING_PLAN: MarketingPlanState = {
  generalObjective: {
    id: 'gen-1',
    name: 'Recuperación de la inversión financiera de los activos en stock y bodega un 50% por la baja rotación de inventario',
    description: 'Mediante la desinversión en un lapso de tiempo de 12 meses, con una estrategia de enfoque defensivo que lleve a cabo una comunicación informativa de la factibilidad financiera de la micromovilidad en automóviles livianos eléctricos, así mismo, contratos de garantía de un año servicio mantenimiento por arreglos, creando una barrera de cambio positiva sobre la relación con el cliente.',
    strategy: 'Enfoque defensivo mediante comunicación informativa de la factibilidad financiera de la micromovilidad eléctrica, contratos de garantía extendida de un año y mantenimiento programado.',
    responsible: 'Katherine Cabrera (Directora de Planificación Estratégica)',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'En progreso'
  },
  specificObjectives: [
    {
      id: 'obj-1',
      name: 'Crear un flujo de caja alto, recuperando la inversión de activos',
      strategicReason: 'Frenar egresos operativos y optimizar recursos congelados en la línea de producción.',
      responsible: 'Gerente de Operaciones',
      priority: 'Alta',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      progress: 50
    },
    {
      id: 'obj-2',
      name: 'Cubre las deudas de la empresa y que no afecten la recuperación',
      strategicReason: 'Mejorar la liquidez y solvencia general evaluando inventario vendido y activo líquido.',
      responsible: 'Gerente Financiero',
      priority: 'Alta',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'En progreso',
      progress: 25
    },
    {
      id: 'obj-3',
      name: 'Extraer la mayor ganancia de la venta de los activos guardados',
      strategicReason: 'Generar liquidez rápida mediante promociones agresivas y estructuración de ofertas.',
      responsible: 'Gerente Comercial',
      priority: 'Media',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      progress: 75
    },
    {
      id: 'obj-4',
      name: 'Rebajar la incertidumbre de compradores, con información sobre inversión positiva',
      strategicReason: 'Educar al mercado sobre la micromovilidad eléctrica para incentivar y acelerar la decisión de compra.',
      responsible: 'Gerente de Marketing Digital',
      priority: 'Media',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'Completado',
      progress: 100
    },
    {
      id: 'obj-5',
      name: 'Aumentar la disponibilidad de compra con beneficio real para el cliente',
      strategicReason: 'Desarrollar contratos exclusivos que brinden tranquilidad y valor real posventa.',
      responsible: 'Gerente Comercial',
      priority: 'Alta',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      progress: 75
    },
    {
      id: 'obj-6',
      name: 'Evaluación para la mejora de los servicios y crear relación con el cliente',
      strategicReason: 'Monitorear la satisfacción y resolver quejas en tiempo récord para fomentar relaciones duraderas.',
      responsible: 'Jefe de Servicio Postventa',
      priority: 'Alta',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'En progreso',
      progress: 50
    }
  ],
  activities: [
    {
      id: 'act-1',
      specificObjectiveId: 'obj-1',
      name: 'Detener producción y ensamblaje, frenando las importaciones',
      description: 'Coordinación con el gerente de logística y abastecimiento para detener flujos de importación y ensamble.',
      responsible: 'Gerente de Operaciones',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      priority: 'Alta',
      budgetAssigned: 5000,
      budgetUsed: 2500,
      progress: 50,
      attachments: []
    },
    {
      id: 'act-2',
      specificObjectiveId: 'obj-2',
      name: 'Evaluar inventario vendido y activo líquido',
      description: 'Análisis minucioso del balance de activos líquidos y valorización del inventario vendido.',
      responsible: 'Gerente Financiero',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'En progreso',
      priority: 'Alta',
      budgetAssigned: 1400,
      budgetUsed: 350,
      progress: 25,
      attachments: []
    },
    {
      id: 'act-3',
      specificObjectiveId: 'obj-3',
      name: 'Diseñar promociones y descuentos que faciliten la liquidez',
      description: 'Desarrollo de campañas de descuento para liquidar existencias y dinamizar el flujo de caja corporativo.',
      responsible: 'Gerente Comercial',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      priority: 'Media',
      budgetAssigned: 5000,
      budgetUsed: 3750,
      progress: 75,
      attachments: []
    },
    {
      id: 'act-4',
      specificObjectiveId: 'obj-4',
      name: 'Diseñar un modelo dinámico de comunicación informativa',
      description: 'Implementación de pauta digital y educación sobre factibilidad financiera en micromovilidad eléctrica.',
      responsible: 'Gerente de Marketing Digital',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'Completado',
      priority: 'Media',
      budgetAssigned: 1400,
      budgetUsed: 1400,
      progress: 100,
      attachments: []
    },
    {
      id: 'act-5',
      specificObjectiveId: 'obj-5',
      name: 'Diseño de contratos exclusivos por compra con servicios de garantía',
      description: 'Formulación y firma de contratos de servicios prepagados por 1 año con mantenimiento garantizado.',
      responsible: 'Gerente Comercial',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      status: 'En progreso',
      priority: 'Alta',
      budgetAssigned: 5000,
      budgetUsed: 3750,
      progress: 75,
      attachments: []
    },
    {
      id: 'act-6',
      specificObjectiveId: 'obj-6',
      name: 'Seguimiento de asistencias, quejas, reseñas y servicio de cada cliente',
      description: 'Resolución de solicitudes y quejas en menos de 48 horas para incrementar el Net Promoter Score.',
      responsible: 'Jefe de Servicio Postventa',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'En progreso',
      priority: 'Alta',
      budgetAssigned: 5000,
      budgetUsed: 2500,
      progress: 50,
      attachments: []
    }
  ],
  kpis: [
    {
      id: 'kpi-1',
      name: 'Rotación del inventario',
      description: 'Monitoreo de los días promedio necesarios para renovar las existencias en stock.',
      formula: 'Días transcurridos',
      unit: 'Días',
      target: 55,
      currentValue: 97,
      history: [
        { period: 'Ene 2026', value: 120 },
        { period: 'Feb 2026', value: 115 },
        { period: 'Mar 2026', value: 110 },
        { period: 'Abr 2026', value: 105 },
        { period: 'May 2026', value: 100 },
        { period: 'Jun 2026', value: 97 }
      ]
    },
    {
      id: 'kpi-2',
      name: 'Aumento de la prueba ácida',
      description: 'Capacidad de solvencia inmediata descontando los inventarios de bodega.',
      formula: 'Ratio de liquidez',
      unit: 'Ratio',
      target: 1.0,
      currentValue: 0.85,
      history: [
        { period: 'Ene 2026', value: 0.60 },
        { period: 'Feb 2026', value: 0.65 },
        { period: 'Mar 2026', value: 0.70 },
        { period: 'Abr 2026', value: 0.75 },
        { period: 'May 2026', value: 0.80 },
        { period: 'Jun 2026', value: 0.85 }
      ]
    },
    {
      id: 'kpi-3',
      name: 'Extraer del inventario al flujo de caja',
      description: 'Medición de la liquidez inyectada directamente proveniente de la venta de stock.',
      formula: 'USD recaudados',
      unit: 'USD',
      target: 575000,
      currentValue: 431250,
      history: [
        { period: 'Ene 2026', value: 50000 },
        { period: 'Feb 2026', value: 120000 },
        { period: 'Mar 2026', value: 200000 },
        { period: 'Abr 2026', value: 280000 },
        { period: 'May 2026', value: 360000 },
        { period: 'Jun 2026', value: 431250 }
      ]
    },
    {
      id: 'kpi-4',
      name: 'Tasa de porcentaje de ventas digitales',
      description: 'Porcentaje de ventas concretadas por medios digitales mediante educación de inversión.',
      formula: 'Ventas digitales / Ventas totales',
      unit: '%',
      target: 100,
      currentValue: 100,
      history: [
        { period: 'Ene 2026', value: 40 },
        { period: 'Feb 2026', value: 60 },
        { period: 'Mar 2026', value: 80 },
        { period: 'Abr 2026', value: 90 },
        { period: 'May 2026', value: 100 },
        { period: 'Jun 2026', value: 100 }
      ]
    },
    {
      id: 'kpi-5',
      name: 'Clientes con contratos de servicio prepagado por 1 año',
      description: 'Porcentaje de clientes activos con mantenimiento garantizado prepagado.',
      formula: 'Clientes afiliados / Clientes totales',
      unit: '%',
      target: 75,
      currentValue: 56,
      history: [
        { period: 'Ene 2026', value: 15 },
        { period: 'Feb 2026', value: 25 },
        { period: 'Mar 2026', value: 35 },
        { period: 'Abr 2026', value: 45 },
        { period: 'May 2026', value: 50 },
        { period: 'Jun 2026', value: 56 }
      ]
    },
    {
      id: 'kpi-6',
      name: 'Satisfacción del cliente con el servicio postventa',
      description: 'Nivel promedio de satisfacción de clientes encuestados postventa.',
      formula: 'Encuestas aprobadas',
      unit: '%',
      target: 90,
      currentValue: 88,
      history: [
        { period: 'Ene 2026', value: 80 },
        { period: 'Feb 2026', value: 82 },
        { period: 'Mar 2026', value: 84 },
        { period: 'Abr 2026', value: 85 },
        { period: 'May 2026', value: 87 },
        { period: 'Jun 2026', value: 88 }
      ]
    }
  ],
  budgetTotalAnnual: 22800,
  alerts: [
    {
      id: 'alt-1',
      title: 'Control de Producción Estable',
      message: 'La actividad "Detener producción y ensamblaje, frenando las importaciones" se encuentra al 50% de progreso con un presupuesto controlado de $2,500.',
      type: 'success',
      date: '2026-06-28',
      read: false,
      category: 'general'
    },
    {
      id: 'alt-2',
      title: 'Ajuste de Campaña Digital',
      message: 'Se alcanzó el 100% de la Tasa de porcentaje de ventas digitales por educación gracias al modelo de comunicación informativa.',
      type: 'success',
      date: '2026-06-28',
      read: false,
      category: 'general'
    }
  ]
};
