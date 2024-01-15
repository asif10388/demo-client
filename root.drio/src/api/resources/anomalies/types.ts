type Anomalies = {
  value: any;
  iqr: number;
  name: string;
  field: string;
  timestamp: number;
  anomaly_type: "comparison" | "iqr";
  datatype: string | number | boolean;
  new_datatype: string | number | boolean;
  event_type: "anomaly" | "datatype_mismatch" | "added_new_field";
};

export type Anomaly = {
  data_source_id: string;
  anomalies: Anomalies[];
};