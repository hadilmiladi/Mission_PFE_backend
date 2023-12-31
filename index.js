// packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const logger = require("morgan");
// ** routes
const EmployeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const login = require("./routes/LoginRouter");
const mission = require("./routes/missionRoutes");
const rankRoutes = require("./routes/rank-routes");


const invoiceRoutes = require('./routes/invoiceRoutes');
const globalinvoiceRoutes =require('./routes/globalinvoiceRoutes')
const mailing=require('./routes/mailingRoutes')

dotenv.config();
// app setup
const app = express();
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.use("/employee", EmployeeRoutes);
app.use("/client", clientRoutes);
app.use("/Login", login);
app.use("/mission", mission);
app.use("/rank", rankRoutes);

app.use("/invoice",invoiceRoutes)
app.use("/globalinvoice",globalinvoiceRoutes);
app.use("/mailing",mailing)
// connect
port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
