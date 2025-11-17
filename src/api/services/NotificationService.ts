import type { Notification } from "../../types/Notification";

// Mock notifications - en el futuro vendrán de una API real
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Nueva orden de trabajo creada",
    description: "Orden #1245 - Campo Los Álamos: Aplicación de fertilizante",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    icon: "📋",
    action: {
      label: "Ver orden",
    },
  },
  {
    id: "2",
    type: "market",
    title: "Precio de soja en alza",
    description:
      "La soja alcanzó $465/tn. Considera vender en las próximas 48hs",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: false,
    icon: "📈",
    action: {
      label: "Detalles",
    },
  },
  {
    id: "3",
    type: "order",
    title: "Orden próxima a vencer",
    description: "Orden #1242 - Cosecha de maíz: Vence en 3 horas",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: false,
    icon: "⏰",
    action: {
      label: "Detalles",
    },
  },
  {
    id: "4",
    type: "market",
    title: "Maíz con tendencia bajista",
    description: "El maíz cerró a $245/tn. Se esperan más caídas esta semana",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
    read: false,
    icon: "📉",
    action: {
      label: "Análisis",
    },
  },
  {
    id: "5",
    type: "news",
    title: "Nuevas regulaciones en fitosanitarios",
    description:
      "El SENASA ha actualizado los requisitos para importación de agroquímicos",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    read: false,
    icon: "📰",
    action: {
      label: "Leer",
    },
  },
  {
    id: "6",
    type: "alert",
    title: "Alerta de clima: Tormenta próxima",
    description: "Se pronostican lluvias de 45mm para mañana a las 14:00hs",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 horas atrás
    read: false,
    icon: "⛈️",
    action: {
      label: "Detalles",
    },
  },
];

// Simular una llamada a API con delay
export const getNotifications = async (): Promise<Notification[]> => {
  // Simular delay de 1 segundo
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockNotifications;
};
