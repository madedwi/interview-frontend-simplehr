import { JabatanType } from "./master-data/jabatan";
import { UnitType } from "./master-data/unit";

export type KaryawanType = {
  id?: number;
  name: string;
  email: string;
  unit_id: number;
  join_date: Date;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  unit?: UnitType,
  jabatan?: JabatanType[]
}

export type KaryawanHttpResponse = {
  data: KaryawanType[]
}

export type KaryawansHttpResponse = {
  total: number;
  per_page: number;
  current_page: number;
  data: KaryawanType[];
}

export type KaryawanHttpPostRequest = {
  data: KaryawanType[]
}