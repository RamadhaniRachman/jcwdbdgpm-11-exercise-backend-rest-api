import express from "express";
import type { Request, Response } from "express";

import fs from "fs/promises";
import path from "path";

const dataPath = path.join(__dirname, "../data/inventory.json");

type Inventory = {
  id: number;
  name: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

/* ----------------------------- READ JSON DATA ----------------------------- */
async function readData(): Promise<Inventory[]> {
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
}

/* ----------------------------- WRITE JSON DATA ---------------------------- */
async function writeData(data: Inventory[]) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

/* --------------------------------- CREATE --------------------------------- */
export async function createInventory(req: Request, res: Response) {
  const { name, description, category, stock } = req.body as any;

  const inventories = await readData();

  const newId =
    inventories.length > 0 ? inventories[inventories.length - 1]!.id + 1 : 1;

  const newItem: Inventory = {
    id: newId,
    name,
    description,
    category,
    stock,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
  };

  inventories.push(newItem);

  await writeData(inventories);

  res.status(201).json({
    message: "Inventory created successfullt",
    data: newItem,
  });
}
/* --------------------------------- GET ALL -------------------------------- */
