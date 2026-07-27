import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

import { notFoundMiddleware } from "./common/middleware/notFound.middleware.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import { swaggerServe, swaggerSetup } from "./config/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerServe, swaggerSetup);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
