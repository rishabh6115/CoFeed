import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./misc/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoutes);

await db();

const port = process.env.port || 5001;

app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
