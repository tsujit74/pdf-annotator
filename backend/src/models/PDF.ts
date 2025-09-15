import mongoose, { Document, Schema } from "mongoose";

export interface IPDF extends Document {
  uuid: string;
  filename: string;
  path: string;
  userId: mongoose.Types.ObjectId;
}

const pdfSchema: Schema = new Schema<IPDF>({
  uuid: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IPDF>("PDF", pdfSchema);
