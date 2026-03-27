const path = require("path");
const dotenv = require("dotenv");

// Load workspace-level env first, then allow server/.env to override when present.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
};

module.exports = env;
