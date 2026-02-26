const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
require("./jobs/recurringSevaJob")
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const sevaCatalogRoutes = require("./routes/sevaCatalogRoutes")
app.use("/api/sevas", sevaCatalogRoutes)
const receiptRoutes = require("./routes/receiptRoutes")
app.use("/api/receipts", receiptRoutes)
const devoteeRoutes = require("./routes/devoteeRoutes")
app.use("/api/devotees", devoteeRoutes)
const recurringSevaRoutes = require("./routes/recurringSevaRoutes")
app.use("/api/recurring-sevas", recurringSevaRoutes)
const sevaExecutionRoutes = require("./routes/sevaExecutionRoutes")
app.use("/api/executions", sevaExecutionRoutes)