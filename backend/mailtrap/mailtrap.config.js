const path = require('path');
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    endpoint: ENDPOINT,
    token: TOKEN,
  })
);

const sender = {
  address: "mailtrap@demomailtrap.com",
  name: "Aviral",
};

module.exports = { transport, sender };
