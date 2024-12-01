import mongoose, { Document, Model, Schema } from "mongoose"

export interface IGame extends Document {
  id: string
  t1: string
  t2: string
  winner: 1 | 2
}

const gameSchema: Schema<IGame> = new mongoose.Schema<IGame>({
  id: { type: String, required: true, unique: true },
  t1: { type: String, required: true },
  t2: { type: String, required: true },
  winner: { type: Number, required: true, min: 1, max: 2 },
}, { timestamps: true })

export const Game: Model<IGame> = mongoose.model<IGame>('Game', gameSchema)