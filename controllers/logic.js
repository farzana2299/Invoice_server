const { User, Invoice, Client, Item } = require("../models/collection");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        } else {
            const newUser = await User.create({
                username: username,
                email: email,
                password: password,
                first_name: "",
                last_name: "",
                address: "",
                city: "",
                country: "",
                postal_code: "",
                about_me: "",
            });

            return res
                .status(200)
                .json({ message: `${username} registered successfully` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const currentUser = await User.findOne({ username });
        //   console.log(currentUser.password);

        if (currentUser) {
            if (password === currentUser.password) {
                const token = jwt.sign({ _id: currentUser._id }, "superkey123");
                res.status(200).json({ user: currentUser, token });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.displayUser = async (req, res) => {
    const userId = req.payload;
    try {
        const regUser = await User.findOne({ _id: userId });
        if (regUser) {
            return res.status(200).json(regUser);
        } else {
            return res.status(404).json({ message: "No such user data" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.editProfile = async (req, res) => {

    const {
        // username,
        first_name,
        last_name,
        email,
        address,
        city,
        country,
        postal_code,
        password,
    } = req.body;

    const userId = req.payload;

    try {
        const selectedUser = await User.findById({ _id: userId });

        if (!selectedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // selectedUser.username = username || selectedUser.username;
        selectedUser.first_name = first_name || selectedUser.first_name;
        selectedUser.last_name = last_name || selectedUser.last_name;
        selectedUser.email = email || selectedUser.email;
        selectedUser.address = address || selectedUser.address;
        selectedUser.city = city || selectedUser.city;
        selectedUser.country = country || selectedUser.country;
        selectedUser.postal_code = postal_code || selectedUser.postal_code;
        selectedUser.password = password || selectedUser.password;

        await selectedUser.save();
        res.status(200).json(selectedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//create client
exports.addClient = async (req, res, next) => {
    const uid = req.payload;
    const { name, email, address, phoneNumber, vatNumber, city, country, post_code } = req.body;

    if (!uid) {
        return res.status(400).json({ message: "User ID required" });
    }

    try {
        const user = await User.findOne({ _id: uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!name || !email || !address || !phoneNumber || !vatNumber || !city || !country || !post_code) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const client = await Client.create({
            uid,
            name,
            email,
            address,
            phoneNumber,
            vatNumber,
            city,
            country,
            post_code
        });

        return res.status(201).json({
            message: "Client added successfully",
            status: true,
            statusCode: 201,
            client
        });
    } catch (error) {
        return next(error);
    }
};

//edit client
exports.editClient = async (req, res) => {
    const { name, email, address, phoneNumber, vatNumber, city, country, post_code } = req.body;
    const { id } = req.params;
    // console.log("id", id);

    try {
        const existingClient = await Client.findById(id);

        if (existingClient) {
            existingClient.name = name;
            existingClient.email = email;
            existingClient.phoneNumber = phoneNumber;
            existingClient.address = address;
            existingClient.vatNumber = vatNumber;
            existingClient.city = city;
            existingClient.country = country;
            existingClient.post_code = post_code;

            await existingClient.save();

            return res.status(200).json({ message: 'Client details updated', client: existingClient });
        } else {
            return res.status(404).json({ message: 'Client not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//display all clients
exports.userClients = async (req, res) => {
    const userId = req.payload;

    try {
        const allUserClients = await Client.find({ uid: userId });
        if (allUserClients && allUserClients.length > 0) {
            return res.status(200).json(allUserClients);
        } else {
            return res.status(404).json({ message: "User has not created any clients" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//display single client
exports.getOneClient = (req, res) => {
    const { id } = req.params
    // console.log(id);
    Client.findOne({ _id: id }).then(data => {
        if (data) {
            res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            })
        } else {
            res.status(404).json({
                message: "No data",
                status: false,
                statusCode: 404
            })
        }
    })
}

//delete client
exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    // console.log("id", id);

    try {
        const deletedClient = await Client.findByIdAndDelete(id);

        if (deletedClient) {
            return res.status(200).json({ message: 'Client deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//add items
exports.createItem = async (req, res) => {
    try {
        const {
            itemName,
            description,
            unit,
            quantity,
            unitPrice,
            taxPercentage,
            discountPercentage,
            discount,
            tax,
            subTotal,
            total
        } = req.body;

        // console.log(req.body);

        if (!itemName || !description || !unit || !quantity || !unitPrice ||
            !taxPercentage || !discount || !tax || !discountPercentage || !subTotal || !total) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let new_subTotal = quantity * unitPrice;
        let new_tax = new_subTotal * (taxPercentage / 100);
        let new_discount = new_subTotal * (discountPercentage / 100);
        let new_total = (new_subTotal + tax) - discount;

        const { id } = req.params;

        // console.log("client id", id);

        const clientData = await Client.findById(id);

        if (!clientData) {
            return res.status(404).json({ message: "No client found with the provided ID" });
        }

        const existingItem = await Item.findOne({ itemName, clientId: id });

        if (existingItem) {
            return res.status(409).json({ message: "This item already exists for the client" });
        }

        const newItem = new Item({
            itemName,
            description,
            unit,
            quantity,
            unitPrice,
            taxPercentage,
            discountPercentage,
            subTotal: new_subTotal,
            tax: new_tax,
            discount: new_discount,
            total: new_total

        });

        // console.log(newItem);

        await newItem.save();

        return res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.createInvoice = async (req, res) => {
    const { invoiceNumber, currency, invoiceDate, dueDate, paymentStatus, paymentMethod, tot_tax,
        tot_discount, tot_subTotal, tot_total, items, clientDetails } = req.body;

    if (!invoiceNumber || !invoiceDate || !dueDate || !paymentMethod || !paymentStatus ||
        !tot_tax || !tot_discount || !tot_subTotal || !items || !currency || !tot_total
        || !clientDetails || !clientDetails.name || !clientDetails.email) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { id: clientId} = req.params;
        // console.log(clientId);
        const clientData = await Client.findById(clientId);
        if (!clientData) {
            return res.status(404).json({ message: "No client found with the provided ID" });
        }

        const existingInv = await Invoice.findOne({ invoiceNumber });
        if (existingInv) {
            return res.status(409).json({ message: "This invoice number already exists" });
        }

        const newInvoice = new Invoice({
            invoiceNumber,
            currency,
            invoiceDate,
            dueDate,
            paymentStatus,
            paymentMethod,
            tot_tax,
            tot_discount,
            tot_subTotal,
            tot_total,
            items,
            clientDetails
        });

        await newInvoice.save();
        return res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

//display all invoices
exports.allInvoices = async (req, res) => {
    const userId = req.payload;
// console.log("user id",userId);
    try {
        const data = await Invoice.find({ "clientDetails.uid": userId });

        if (data.length > 0) {
            return res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            });
        } else {
            return res.status(404).json({ message: "No invoices found for the user" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get three invoices 
exports.threeInvoices = async (req, res) => {
    const userId = req.payload; 
    try {
        const data = await Invoice.find({ "clientDetails.uid": userId }).limit(3);

        if (data.length > 0) {
            return res.status(200).json({
                message: data,
                status: true,
                statusCode: 200
            });
        } else {
            return res.status(404).json({ message: "No invoices found for the user" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOneInvoice = async (req, res) => {
    const { id } = req.params;
// console.log("client id",id);
    try {
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        return res.status(200).json({  invoice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {

        const deletedInvoice = await Invoice.findByIdAndDelete({ _id: id });

        if (deletedInvoice) {

            return res.status(200).json({ message: 'Invoice deleted successfully' });
        } else {

            return res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};