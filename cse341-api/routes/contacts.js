const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
     /*
      #swagger.description = 'Retrieve all contacts from the database.'
      #swagger.responses[200] = {
        description: 'Contacts retrieved successfully.'
      }
      #swagger.responses[500] = {
        description: 'Failed to retrieve contacts.'
      }
    */
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
        /*
      #swagger.description = 'Retrieve a single contact by ID.'
      #swagger.parameters['id'] = {
        in: 'query',
        description: 'The MongoDB ID of the contact to retrieve.',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Contact retrieved successfully.'
      }
      #swagger.responses[500] = {
        description: 'Failed to retrieve contact.'
      }
    */
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

router.post("/", async (req, res) => {
        /*
      #swagger.description = 'Create a new contact.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Contact information for the new contact.',
        required: true,
        schema: {
          firstName: 'Mary',
          lastName: 'Johnson',
          email: 'mary@example.com',
          favoriteColor: 'Purple',
          birthday: '2000-08-15'
        }
      }
      #swagger.responses[201] = {
        description: 'Contact created successfully.'
      }
      #swagger.responses[400] = {
        description: 'All contact fields are required.'
      }
      #swagger.responses[500] = {
        description: 'Failed to create contact.'
      }
    */
    try {
        const db = req.app.locals.db;
        const contact = req.body;
        if (!contact.firstName ||
            !contact.lastName ||
            !contact.email ||
            !contact.favoriteColor ||
            !contact.birthday) {
            return res.status(400).json({
                error: "All contact fields are required"
        });
}

        const result = await db.collection("contacts").insertOne(contact);

        res.status(201).json({
            message: "Contact created successfully",
            contactId: result.insertedId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create contact" });
    }
});

router.put("/:id", async (req, res) => {
        /*
      #swagger.description = 'Update an existing contact by ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'The MongoDB ID of the contact to update.',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated contact information.',
        required: true,
        schema: {
          firstName: 'Mary',
          lastName: 'Johnson',
          email: 'mary.updated@example.com',
          favoriteColor: 'Blue',
          birthday: '2000-08-15'
        }
      }
      #swagger.responses[200] = {
        description: 'Contact updated successfully.'
      }
      #swagger.responses[500] = {
        description: 'Failed to update contact.'
      }
    */
    try {
        const db = req.app.locals.db;
        const id = req.params.id;
        const contact = req.body;

        const result = await db.collection("contacts").updateOne(
            { _id: new ObjectId(id) },
            { $set: contact }
        );

        res.status(200).json({
            message: "Contact updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update contact" });
    }
});

router.delete("/:id", async (req, res) => {
        /*
      #swagger.description = 'Delete a contact by ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'The MongoDB ID of the contact to delete.',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Contact deleted successfully.'
      }
      #swagger.responses[500] = {
        description: 'Failed to delete contact.'
      }
    */
    try {
        const db = req.app.locals.db;
        const id = req.params.id;

        const result = await db.collection("contacts").deleteOne({
            _id: new ObjectId(id)
        });

        res.status(200).json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete contact"
        });
    }
});

module.exports = router;