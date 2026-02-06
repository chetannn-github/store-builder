import express from "express";
import storeRoutes from "./routes/store.routes.js";
import "dotenv/config"

const app = express();
app.use(express.json());

app.use("/stores", storeRoutes);


export default app;