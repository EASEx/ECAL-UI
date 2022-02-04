import { Data } from "dataclass";
import { DataSnapshot } from "acebase";

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

export interface Metric {
  celldata: CellData[];
  lastmousemoveTime: number;
  lastkeypressTime: number;
  windowURL: string;
  timestamp: number;
}

class MetricNode implements Metric {
  celldata: CellData[];
  lastmousemoveTime: number;
  lastkeypressTime: number;
  windowURL: string;
  timestamp: number;

  constructor(object: Metric) {
    this.lastmousemoveTime = object.lastmousemoveTime;
    this.lastkeypressTime = object.lastkeypressTime;
    this.windowURL = object.windowURL;
    this.timestamp = object.timestamp;
    this.celldata = object.celldata;
  }

  static deserialize(snap: DataSnapshot) {
    let obj = snap.val();
    return new MetricNode(obj);
  }

  serialize() {
    return {
      lastmousemoveTime: this.lastmousemoveTime,
      lastkeypressTime: this.lastkeypressTime,
      windowURL: this.windowURL,
      timestamp: this.timestamp,
      celldata: this.celldata,
    };
  }
}

export default MetricNode;
