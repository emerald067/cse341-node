require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Contacts API",
        description: "API for managing contacts"
    },
    host: process.env.SWAGGER_HOST || "localhost:8080",
    basePath: "/contacts",
    schemes: [process.env.SWAGGER_SCHEME || "http"]
};

const outputFile = "./swagger.json";

const endpointsFiles = ["./routes/contacts.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);