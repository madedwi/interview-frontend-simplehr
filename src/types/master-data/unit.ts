export type UnitType = {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export type UnitHttpResponse = {
  data: UnitType[]
}

export type UnitsHttpResponse = {
  total: number;
  per_page: number;
  current_page: number;
  data: UnitType[];
}

export type UnitHttpPostRequest = {
  data: UnitType[]
}