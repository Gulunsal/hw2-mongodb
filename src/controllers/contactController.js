const Contact = require('../models/contact');
const cloudinary = require('../config/cloudinary');

const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createContact = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    // İletinin diğer verilerini burada işle
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: result.secure_url
    });
    await newContact.save();
    res.status(201).json({ message: "Contact created successfully", contact: newContact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

// Diğer controller fonksiyonları...

module.exports = {
  getContactById,
  createContact,
  // Diğer fonksiyonlar
}; 