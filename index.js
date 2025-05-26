import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import mainRouter from "./routes/server.route.js";
import cors from "cors"

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working");
});

app.use("/api", mainRouter);
app.all("*", (req, res) => {
  return res.status(404).send("API route not found");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
