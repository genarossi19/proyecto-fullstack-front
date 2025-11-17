import axios from "axios";

export interface DolarQuote {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const DOLAR_API_URL = "https://dolarapi.com/v1/dolares";

export const getDolarQuotes = async (): Promise<DolarQuote[]> => {
  const response = await axios.get<DolarQuote[]>(DOLAR_API_URL);
  return response.data;
};
