// REST API SERVER
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { api } = require("./app");
const { onRequest } = require("firebase-functions/v2/https");

const app = require("./app");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log(`DB connection successful 😁`);
});
if (process.env.NODE_ENV === "production") {
  exports.api = onRequest(api);
} else {
  const restPort = process.env.REST_PORT || 5000;
  const restServer = app.listen(restPort, () => {
    console.log(`App is running on port ${restPort}...`);
  });
}

// WEB SOCKET SERVER
// const { wsServer } = require('./socket');

// const wsPort = process.env.WS_PORT || 5001;
// wsServer.listen(wsPort, () => {
//   console.log(`Websocket server running on port ${wsPort}...`);
// });
