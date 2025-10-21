import type Field from "./FieldType";

export interface ClientType {
  id: number;
  name: string;
  field: Field[];
}
