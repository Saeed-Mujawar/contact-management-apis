const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts =await Contact.find({user_id: req.user.id});
    if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: "No contacts found." });
    }
    res.status(200).json({
        message: "Contacts retrieved successfully!",
        contacts
    });
});

//@desc Create all contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const {name, email, phone} = req.body;

    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mansatory !")
    }
    const existingContact = await Contact.findOne({
        $or: [{ email }, { phone }],
        user_id: req.user.id
    });
    
    if (existingContact) {
        return res.status(400).json({ message: "Contact with this email or phone already exists." });
    }

    const contact = await Contact.create({name, email, phone, user_id: req.user.id});
    res.status(201).json({
        message: "Contact created successfully!",
        contact: {
            id: contact._id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone
        }
    });
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied. You do not own this contact." });
    }

    res.status(200).json({
        message: "Contact retrieved successfully!",
        contact
    });
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
        return res.status(400).json({ message: "At least one field (name, email, or phone) must be provided for update." });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.user_id.toString() !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to update this contact." });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json({
        message: "Contact updated successfully!",
        contact: updatedContact
    });
});

//@desc Delete contact
//@route GET /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Coontact not found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Deleted contact with id: ${req.params.id}` });
});

//@desc Search contacts
//@route GET /api/contacts/search
//@access private
const searchContacts = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.query;
    
    const searchQuery = {
        user_id: req.user.id,
        $or: []
    };

    if (name) {
        searchQuery.$or.push({ name: { $regex: name, $options: 'i' } });
    }
    if (email) {
        searchQuery.$or.push({ email: { $regex: email, $options: 'i' } });
    }
    if (phone) {
        searchQuery.$or.push({ phone: { $regex: phone, $options: 'i' } });
    }

    if (searchQuery.$or.length === 0) {
        return res.status(400).json({ message: 'Please provide a search term' });
    }

    const contacts = await Contact.find(searchQuery);
    res.status(200).json(contacts);
});


//@desc Get total count of user contacts
//@route GET /api/contacts/count
//@access private
const getContactCount = asyncHandler(async (req, res) => {
    const count = await Contact.countDocuments({ user_id: req.user.id });
    res.status(200).json({ total: count });
});

//@desc Bulk delete contacts
//@route DELETE /api/contacts/bulk-delete
//@access private
const bulkDeleteContacts = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400);
        throw new Error("No contacts provided for deletion");
    }
    const deleted = await Contact.deleteMany({
        _id: { $in: ids },
        user_id: req.user.id
    });
    res.status(200).json({ message: `Deleted ${deleted.deletedCount} contacts` });
});

module.exports = {
    getContact,
    createContact,
    updateContact,
    getContacts,
    deleteContact,
    searchContacts,
    getContactCount,
    bulkDeleteContacts,
}