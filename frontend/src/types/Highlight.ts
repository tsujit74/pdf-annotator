export interface Highlight {
  _id?: string; 
  pdfUuid: string;
  page: number;
  text: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
