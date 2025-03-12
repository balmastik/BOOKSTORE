"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customer = void 0;
const customer_1 = require("./customer");
exports.customer = new customer_1.Customer({
    name: 'John Doe',
    balance: 40,
    image: './dist/img/first_customer.jpeg'
});
