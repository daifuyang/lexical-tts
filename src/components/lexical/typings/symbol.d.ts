export interface InsertSymbolPayload {
  label?: string;
  value: string;
  type: string;
}

export interface RemoveSymbolPayload {
    key: string; // 所选的节点key
}

export interface SymbolPopupPayload {
    text: string;
    value: string;
  }