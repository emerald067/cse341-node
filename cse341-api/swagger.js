const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Contacts API",
        description: "API for managing contacts"
    },
    host: "localhost:8080",
    basePath: "/contacts"
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/contacts.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);