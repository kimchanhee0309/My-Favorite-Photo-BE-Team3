import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { swaggerServe, swaggerSetup } from "./config/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api-docs", swaggerServe, swaggerSetup);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
