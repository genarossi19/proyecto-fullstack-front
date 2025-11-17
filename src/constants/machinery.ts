export const MACHINERY_TYPES = [
  "TRACTOR",
  "COSECHADORA",
  "FUMIGADORA",
  "SEMBRADORA",
  "CAMION",
  "AVION",
  "OTRO",
] as const;

export const MACHINERY_STATUS = [
  "Disponible",
  "En Uso",
  "Mantenimiento",
  "Fuera de Servicio",
] as const;

export type MachineryTypeOption = (typeof MACHINERY_TYPES)[number];
export type MachineryStatusOption = (typeof MACHINERY_STATUS)[number];
