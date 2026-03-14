export interface BarMapItem {
  axis: string;
  client: string;
  direction: string;
  key: string;
  offset: string;
  scroll: string;
  scrollSize: string;
  size: string;
}
export interface BarMap {
  horizontal: BarMapItem;
  vertical: BarMapItem;
}

export interface ScrollbarType {
  wrap: ElRef;
}
