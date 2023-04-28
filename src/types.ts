export type Image = {
  id: string;
  file_url: string;
  order: number;
};

export type Cols = number;

export type Margin = number;

/**
 * id: key of item
 * value: order of item
 */
export type Positions = {
  [id: string]: number;
};
