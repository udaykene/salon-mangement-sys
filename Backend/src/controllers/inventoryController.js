import Inventory from "../models/inventory.model.js";
import Branch from "../models/branch.model.js";

export const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      sku,
      quantity,
      minStock,
      price,
      supplier,
      expiryDate,
      branchId,
    } = req.body;

    const newItem = new Inventory({
      name,
      category,
      sku,
      quantity,
      minStock,
      price,
      supplier,
      expiryDate,
      branchId,
    });

    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBranchInventory = async (req, res) => {
  try {
    const { branchId } = req.params;
    const items = await Inventory.find({ branchId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInventory = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      return res
        .status(400)
        .json({ success: false, message: "ownerId is required" });
    }

    // Admins oversight: Fetch all branches for this owner
    const branches = await Branch.find({ ownerId });
    const branchIds = branches.map((b) => b._id);

    const items = await Inventory.find({ branchId: { $in: branchIds } })
      .populate("branchId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Use findOne and save to trigger the pre-save middleware for status update
    const item = await Inventory.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    Object.keys(updates).forEach((key) => {
      item[key] = updates[key];
    });

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
