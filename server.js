const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");

const { MongoClient } = require("mongodb");

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {

    res.send("Hello World");

});

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {

    try {

        await client.connect();

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {

            console.log(`Server running on port ${PORT}`);

        });

    } catch (error) {

            console.error("MongoDB connection failed:", error);

            process.exit(1);

        }
    }

startServer();