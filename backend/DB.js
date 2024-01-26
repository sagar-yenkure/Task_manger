// this file is used to connect mongoDB with express server in "index.js" file.
const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const connectToMongo = async () => {
    try {
        await mongoose.connect(url).then(() => console.log(`mongo database is connected!! `))

    } catch (error) {
        console.log(`Error: ${error} `)

    }
}

module.exports = connectToMongo; // exporting connection function in other files.