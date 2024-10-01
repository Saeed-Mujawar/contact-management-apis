const express = require("express");
const router = express.Router();
const {
    getContact,
    createContact,
    updateContact,
    getContacts,
    deleteContact,
    searchContacts,
    getContactCount,
    bulkDeleteContacts
} = require("../controllers/contactController.js");

const validateToken = require("../middleware/validateTokenHandler.js");

// Use token validation middleware for all routes
router.use(validateToken);

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management operations
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Retrieve all contacts
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: A list of contacts
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 */
router.route("/").get(getContacts).post(createContact);

/**
 * @swagger
 * /api/contacts/search:
 *   get:
 *     tags: [Contacts]
 *     summary: Search for contacts
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Search term
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contacts matching search term
 *       401:
 *         description: Unauthorized
 */
router.route("/search").get(searchContacts);

/**
 * @swagger
 * /api/contacts/count:
 *   get:
 *     tags: [Contacts]
 *     summary: Get the total count of contacts
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Total number of contacts
 *       401:
 *         description: Unauthorized
 */
router.route("/count").get(getContactCount);

/**
 * @swagger
 * /api/contacts/bulk-delete:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete multiple contacts
 *     security:          
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Contacts deleted successfully
 *       400:
 *         description: Validation error
 */
router.route("/bulk-delete").delete(bulkDeleteContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Retrieve a contact by ID
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     tags: [Contacts]
 *     summary: Update a contact by ID
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete a contact by ID
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 */
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
