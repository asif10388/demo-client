type TableRow = {
  [key: string]: any;
};

type User = {
  id: string;
  email: string;
  state?: string;
  city?: string;
  country?: string;
  login_id?: string;
  last_name: string;
  first_name: string;
  created_at?: string;
  updated_at?: string;
};

type OrganizationUnit = {
  id: string;
  name: string;
  state: string;
  city?: string;
  country: string;
  account_id: string;
  created_at: string;
  updated_at: string;
  ddx_clusters: DDXCluster[];
};

type DDXCluster = {
  id: string;
  name: string;
  token: string;
  twofaurl: string;
  created_at: string;
  updated_at: string;
  ddx_instances: DDXInstance[];

  account_id?: string;
  ou_id?: string;
};

type DDXInstance = {
  id: string;
  name: string;
  ipaddress: string;
  cluster_id: string;
  created_at: string;
  updated_at: string;
  state: "running" | "stopped" | "upgrading" | "failed";

  account_id?: string;
  ou_id?: string;
};
