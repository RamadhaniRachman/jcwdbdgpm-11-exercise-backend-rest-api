import express from "express";
import inventoryRouter from "./routes/inventory.router.js";

const app = express();

app.use(express.json());

app.use("/inventory", inventoryRouter);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
