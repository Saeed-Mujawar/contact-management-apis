const express = require("express");
const router = express.Router();
const {getContact,
    createContact,
    updateContact,
    getContacts,
    deleteContact,
searchContacts,
getContactCount,
bulkDeleteContacts} = require("../controllers/contactController.js");

const validateToken = require("../middleware/validateTokenHandler.js");


router.use(validateToken);

router.route("/").get(getContacts).post(createContact);

router.route("/search").get(searchContacts);

router.route("/count").get(getContactCount);

router.route("/bulk-delete").delete(bulkDeleteContacts);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router