interface CellData {
  index: number;
  input: string;
  output: string;
  isExecuted: boolean;
  info: {
    status: string;
    timestamp: number;
    user_tz: number;
    elapsed: number;
    user: {
      displayName: string;
      photoUrl: string;
      userId: string;
    };
    execution_count: number;
  };
  hasError: boolean;
  busy: boolean;
}

export interface Metrics {
  celldata: CellData[];
  lastmousemoveTime: number;
  lastkeypressTime: number;
  windowURL: string;
  timestamp: number;
}
