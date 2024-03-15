const express = require('express')
const router = express.Router();
const user = require("../controllers/logic");
const jwtMiddleware = require("../middleware/jwtMiddleware");

// User Register
router.post("/users/register", user.register);

// Login
router.post("/user/login", user.login);

//display user details
router.get("/user",jwtMiddleware,user.displayUser)

// Edit Profile
router.put("/user/edit-profile/:id", jwtMiddleware, user.editProfile);

//add client
router.post('/invoices/client', jwtMiddleware, user.addClient);

//edit client
router.put('/invoices/client/:id',jwtMiddleware, user.editClient)

//display all client
router.get('/invoices/clients',jwtMiddleware,user.userClients)

//display single client
router.get('/invoices/client/:id',jwtMiddleware, user.getOneClient);

//delete client
router.delete('/invoices/client/:id', jwtMiddleware, user.deleteClient);


// create item 
router.post('/item/add/:id', jwtMiddleware, user.createItem);

// Add Invoice 
router.post('/invoices/add/:id', jwtMiddleware, user.createInvoice);

//display all invoices
router.get('/user/invoices',jwtMiddleware,user.allInvoices)

//DISPLAY THREE Invoices
router.get('/user/limited-invoices',jwtMiddleware,user.threeInvoices)

//single invoice
router.get('/invoice/:id',jwtMiddleware,user.getOneInvoice) 

//delete invoice
router.delete('/invoices/:id', jwtMiddleware, user.deleteInvoice);

module.exports = router;
