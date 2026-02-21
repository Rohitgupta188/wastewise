import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRequest extends Document {
  donation: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  quantityRequested: number;
  message?: string;
  status: 'open' | 'accepted' | 'rejected' ;
}

const RequestSchema = new Schema<IRequest>({
  donation: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantityRequested: { type: Number, required: true },
  message: String,
  status: { type: String, enum: ['open', 'accepted', 'rejected'], default: 'open' },
}, { timestamps: true });

export default (mongoose.models.Request as Model<IRequest>) ||
  mongoose.model<IRequest>('Request', RequestSchema);