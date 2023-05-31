import mongoose from "mongoose"

const mongoDBConnection = () => {

    const connected = mongoose.connect(process.env.MONGO_URI)

    if (connected) {
        console.log("DB Connected Successfully")
        return connected
    }
}

export default mongoDBConnection;