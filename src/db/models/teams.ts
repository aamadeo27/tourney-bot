import { hash } from "crypto"
import mongoose, { Document, Model, Schema } from "mongoose"

export interface ITeam extends Document {
  id: string
  p1: string
  p2: string
}

const schema: Schema<ITeam> = new mongoose.Schema<ITeam>({
  id: { type: String, required: true, unique: true },
  p1: { type: String, required: true },
  p2: { type: String, required: true },
}, { timestamps: true })

schema.index({ p1: 1, p2: 1 }, { unique: true })

export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', schema)