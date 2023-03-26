export interface Result {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  priority: number;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  data: Data;
  meta: Meta;
  comment: any;
  tags: any[];
  created_on: string;
  modified_on: string;
}

export interface Data {
  name: string;
  port: number;
  priority: number;
  proto: string;
  service: string;
  target: string;
  weight: number;
}

export interface Meta {
  auto_added: boolean;
  managed_by_apps: boolean;
  managed_by_argo_tunnel: boolean;
  source: string;
}

export default interface CloudflareSRVRecordResult {
  result: Result;
  success: boolean;
  errors: any[];
  messages: any[];
}
