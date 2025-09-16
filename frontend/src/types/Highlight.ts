export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Highlight {
  _id?: string | null;   
  pdfUuid: string;
  page: number;
  text: string;
  position?: Position;  
  timestamp?: string;
}
