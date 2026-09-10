const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const contacts = await db.collection("contacts").find().toArray();

        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve contacts" });
    }
});

router.get("/contact", async (req, res) => {
    try {
        const id = req.query.id;
        const db = req.app.locals.db;

        const contact = await db.collection("contacts").findOne({
            _id: new ObjectId(id)
        });

        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve contact" });
    }
});

module.exports = router;