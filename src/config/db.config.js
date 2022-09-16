const { connect, connection } = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.DATABASE_URL;

const startDb = async () => {
    try {
        
        await connect(mongoURI);
        
        const db = connection;
        
        db.on("error", (err) => console.log(err));
        
        db.once("connected", () => console.log("connected"));
        
    } catch (e) {
        console.log(e);
        return;
    }
};

module.exports = startDb;
