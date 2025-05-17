import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// app.use("/assets", express.static(path.resolve("assets")));
// lembrete: troquei o caminho de cima por que assets tá na raiz, então acho que funciona melhor com o dirname e fileToPath
// Por algum motivo não conseguir fazer com o cógido comentado ali, agora que tá tudo funcionando, vale a pena mais uma tentativa
app.use(
  "/assets",
  express.static(path.resolve(__dirname, "../../assets/images/produtcs"))
);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
export { app };
