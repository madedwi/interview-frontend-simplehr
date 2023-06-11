export type JabatanType = {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export type JabatanHttpResponse = {
  data: JabatanType[]
}

export type JabatansHttpResponse = {
  total: number;
  per_page: number;
  current_page: number;
  data: JabatanType[];
}

export type JabatanHttpPostRequest = {
  data: JabatanType[]
}