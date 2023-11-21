import { config } from "dotenv";
import express from "express";
import cors from "cors";
import zoom from "./routes/zoom.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/zoom", zoom);

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
