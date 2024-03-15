

const mongoose = require('mongoose'); // Import mongoose

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    first_name: {
        type: String,
        // required:true
    },
    last_name: {
        type: String,
        // required:true
    },
    email: {
        type: String,
        // required:true
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    postal_code: {
        type: String,
    },
    about_me: {
        type: String,
    },
    password:{
        type: String,
        required:true
    }
});

const User = mongoose.model("User", userSchema);

const clientSchema = new mongoose.Schema({
    uid:{
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String, 
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    vatNumber: {
        type: String,
    },
    city: {
        type: String,
    },
   country: {
        type: String,
    },
    post_code: {
        type: String,
    },
});

const Client = mongoose.model("Client", clientSchema);

const itemSchema = new mongoose.Schema({
    itemName:{
        type:String
    },
    description:{
        type:String
    },
    unit:{
        type:String
    },
    quantity:{
        type:Number
    },
    unitPrice:{
        type:Number
    },
    taxPercentage:{
        type:Number
    },
    tax:{
        type:Number
    },
    discountPercentage:{
        type:Number
    },
    discount:{
        type:Number
    },
    total:{
        type:Number
    },
    subTotal:{
        type:Number
    }

});

const Item = mongoose.model("Item", itemSchema);



const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String
    },
    currency: {
        type: String
    },
    invoiceDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    paymentStatus: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    tot_tax: {
        type: Number
    },
    tot_discount: {
        type: Number
    },
    tot_subTotal: {
        type: Number
    },
    tot_total: {
        type: Number 
    },
    items: [itemSchema],
    clientDetails: clientSchema
});
const Invoice = mongoose.model("Invoice", invoiceSchema);




module.exports = { User, Invoice,Client,Item };

