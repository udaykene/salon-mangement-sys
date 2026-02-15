import express from "express";
import {
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import {
  CreateClientValidation,
  UpdateClientValidation,
} from "../middlewares/clientValidation.js";

const router = express.Router();

router.post("/", CreateClientValidation, createClient);
router.get("/", getAllClients);
router.put("/:id", UpdateClientValidation, updateClient);
router.delete("/:id", deleteClient);

export default router;