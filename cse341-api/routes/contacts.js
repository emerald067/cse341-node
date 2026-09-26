const express = require("express");
const Contact = require("../models/contact");

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
    const contacts = await Contact.find();

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
    #swagger.responses[404] = {
      description: 'Contact not found.'
    }
    #swagger.responses[500] = {
      description: 'Failed to retrieve contact.'
    }
  */
  try {
    const id = req.query.id;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve contact"
    });
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
    const contact = req.body;

    // if (!contact.firstName ||
    //     !contact.lastName ||
    //     !contact.email ||
    //     !contact.favoriteColor ||
    //     !contact.birthday) {
    //     return res.status(400).json({
    //         error: "All contact fields are required"
    //     });
    // }

    const newContact = new Contact(contact);
    const savedContact = await newContact.save();

    res.status(201).json({
      message: "Contact created successfully",
      contactId: savedContact._id
    });

  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message
      });
    }

    res.status(500).json({
      error: "Failed to create contact"
    });
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
      #swagger.responses[404] = {
      description: 'Contact not found.'
    }
    #swagger.responses[500] = {
      description: 'Failed to update contact.'
    }
  */
  try {
    const id = req.params.id;
    const contact = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      contact,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update contact"
    });
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
      #swagger.responses[404] = {
        description: 'Contact not found.'
      }
    #swagger.responses[500] = {
      description: 'Failed to delete contact.'
    }
  */
  try {
    const id = req.params.id;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        error: "Contact not found"
      });
    }

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