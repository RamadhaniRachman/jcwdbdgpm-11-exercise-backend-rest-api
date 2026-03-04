import express from "express";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

  if (!name || !description || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (stock < 0) {
    return res.status(400).json({ message: "Stock cannot be negative" });
  }
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

/* ---------------------------- get all invetory ---------------------------- */

export const getAllInventory = async (req: Request, res: Response) => {
  const { search, category } = req.query;

  let inventories = await readData();

  inventories = inventories.filter((item) => item.deletedAt === null);

  if (search) {
    const keyword = (search as string).toLowerCase();

    inventories = inventories.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    );

    if (category) {
      inventories = inventories.filter((item) => item.category === category);
    }
  }

  res.json(inventories);
};

/* -------------------------- get inventory masing2 ------------------------- */
export const getInventoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  // ubah ke number dlu karena pas pertama kali dapetnya dalam bentuk string
  const inventories = await readData();

  const item = inventories.find(
    (item) => item.id === id && item.deletedAt === null,
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
};

/* --------------------------------- update --------------------------------- */

export const updateInventory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const inventories = await readData();

  const index = inventories.findIndex(
    (item) => item.id === id && item.deletedAt === null,
  );

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const updateItem = {
    ...inventories[index],
    ...req.body,
    updatedAt: new Date().toISOString,
  };

  inventories[index] = updateItem;

  writeData(inventories);

  res.json(updateItem);
};

/* --------------------------------- delete --------------------------------- */

export const deleteInventory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const inventories = await readData();

  const index = inventories.findIndex(
    (item) => item.id === id && item.deletedAt === null,
  );

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  inventories[index]!.deletedAt = new Date().toISOString();

  writeData(inventories);

  res.json({ message: "Item soft deleted" });
};
