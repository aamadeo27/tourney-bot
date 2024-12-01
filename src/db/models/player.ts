import mongoose, { Document, Model, Schema } from "mongoose"

export interface IPlayer extends Document {
  id: string
  tz: string
}

const schema: Schema<IPlayer> = new mongoose.Schema<IPlayer>({
  id: { type: String, required: true, unique: true },
  tz: { type: String, required: true },
}, { timestamps: true })

export const Player: Model<IPlayer> = mongoose.model<IPlayer>('Player', schema)