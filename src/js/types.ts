export type Coordinate = {
  x: number;
  y: number;
};
export type Card = {
  id: string;
  source: string;
  nw: string;
  ne: string;
  sw: string;
  se: string;
  goal_info: string;
};

export interface StringTranslation {
  [key: string]: string;
}

export type ClusterData = {
  [key: string]: Coordinate[][];
};
