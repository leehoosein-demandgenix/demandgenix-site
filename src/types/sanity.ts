export interface ThreeColumnBlock {
  _type: 'threeColumnBlock';
  _key: string;
  columns: Array<{
    title: string;
    content: string;
  }>;
}

export interface BlogContent {
  _type: string;
  _key: string;
  [key: string]: any;
}