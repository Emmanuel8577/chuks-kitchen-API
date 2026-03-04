import mongoose from "mongoose";



export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB is connected ${conn.connection.host}`)
        
    } catch (error) {
        console.log("Error connecting the database", error.message)
        process.exist(1)
    }
}