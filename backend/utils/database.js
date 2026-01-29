import mongoose from "mongoose";

const database = async() => {
    try {

        mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully")
        
    } catch (error) {
        
    }
}

export default database;