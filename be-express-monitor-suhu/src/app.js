import cors from "cors";
import express from "express";
import logger from "morgan";

import { setResponseHeader } from "./middleware/set-headers.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import masterProdukRouters from "./routes/masterProdukRoutes.js"
//import monitorSuhuRouter from "./routes/monitorSuhuRoutes.js";
import masterGudang from "./routes/masterGudang.js"
import jenisGudangRoutes from './routes/jenisGudangRoutes.js';
import stockRoutes from './routes/stockRoutes.js';


const app = express();

const allowedOrigins = ["http://localhost:3000"];
app.use(express.json());
app.use('./api/jenis-gudang', jenisGudangRoutes);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Timestamp",
      "X-Signature",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionSuccessStatus: 200,
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", [setResponseHeader], (req, res) => {
  return res
    .status(200)
    .json(`Welcome to the server! ${new Date().toLocaleString()}`);
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/master-produk", masterProdukRouters);
app.use("/api/nama-gudang",masterGudang);
app.use("/api/golonganstock", jenisGudangRoutes);
//app.use("/api/monitor-suhu", monitorSuhuRouter);
app.use('/api/stock', stockRoutes);
export default app;
