const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    message: "Backend API is running",
    status: "ok",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
