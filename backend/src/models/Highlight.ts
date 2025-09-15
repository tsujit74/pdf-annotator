import mongoose, { Document, Schema } from "mongoose";

export interface IHighlight extends Document {
  pdfUuid: string;
  userId: mongoose.Types.ObjectId;
  page: number;
  text: string;
  position?: object;
  timestamp: Date;
}

const highlightSchema: Schema = new Schema<IHighlight>({
  pdfUuid: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  page: { type: Number, required: true },
  text: { type: String, required: true },
  position: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IHighlight>("Highlight", highlightSchema);
