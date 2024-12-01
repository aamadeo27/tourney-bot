import mongoose from "mongoose"
import { requireEnv } from "utils"

const uri = requireEnv('DATABASE_URL')

export const connectDB = async () => {
  try {
    await mongoose.connect(uri)
    console.log('DB Successfully Connected')
  } catch(error) {
    console.error('Error connecting to the database:\n', error)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log('DB Successfully Disconnected')
  } catch(error) {
    console.error('Error disconnecting from the database:\n', error)
  }
}