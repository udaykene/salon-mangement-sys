import Service from "../models/services.model.js";
import Branch from "../models/branch.model.js";
import Category from "../models/category.model.js";

/**
 * @desc    Create a new service
 * @route   POST /api/services
 */
export const createService = async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const { branchId, category: categoryId } = req.body;

    if (!ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    // 1. Authorization & Branch ownership check
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: branchId, ownerId });
      if (!branch) {
        return res.status(404).json({
          success: false,
          message: "Branch not found or access denied.",
        });
      }
    } else if (role === "receptionist") {
      // Force the branchId to be the one from session
      req.body.branchId = req.session.branchId.toString();
    } else {
      return res.status(403).json({ success: false, message: "Invalid role." });
    }

    // 2. Consistency Check: Ensure Category belongs to the same Branch
    const category = await Category.findById(categoryId);
    if (!category || category.branchId.toString() !== branchId.toString()) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category. Category must belong to the selected branch.",
      });
    }

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get all services
 * @route   GET /api/services
 */
export const getServices = async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const staffBranchId = req.session.branchId;

    if (!ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    let query = {};

    if (role === "admin") {
      const branches = await Branch.find({ ownerId }).select("_id");
      const branchIds = branches.map((b) => b._id);

      const { branchId, category, gender } = req.query;
      query.branchId = branchId ? branchId : { $in: branchIds };

      if (category && category !== "all") query.category = category;
      if (gender && gender !== "all") query.gender = gender;
    } else if (role === "receptionist") {
      const { category, gender } = req.query;
      query.branchId = staffBranchId;
      if (category && category !== "all") query.category = category;
      if (gender && gender !== "all") query.gender = gender;
    } else {
      return res.status(403).json({ success: false, message: "Invalid role." });
    }

    const services = await Service.find(query)
      .populate("branchId", "name city")
      .populate("category", "name");

    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update a service
 * @route   PUT /api/services/:id
 */
export const updateService = async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const serviceId = req.params.id;
    const { branchId, category: categoryId } = req.body;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    // Authorization & Ownership checks
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: service.branchId, ownerId });
      if (!branch) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
      // If moving branch, check new branch ownership
      if (branchId && branchId !== service.branchId.toString()) {
        const newBranch = await Branch.findOne({ _id: branchId, ownerId });
        if (!newBranch) {
          return res.status(404).json({
            success: false,
            message: "New branch not found or access denied.",
          });
        }
      }
    } else if (role === "receptionist") {
      if (service.branchId.toString() !== req.session.branchId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
      if (branchId && branchId !== req.session.branchId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Receptionists cannot change branch.",
        });
      }
    }

    // Consistency Check: Ensure Category belongs to the target Branch
    const targetBranchId = branchId || service.branchId.toString();
    const finalCategoryId = categoryId || service.category.toString();

    if (categoryId || branchId) {
      const category = await Category.findById(finalCategoryId);
      if (!category || category.branchId.toString() !== targetBranchId) {
        return res.status(400).json({
          success: false,
          message: "Invalid category for this branch.",
        });
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("branchId", "name city");

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Toggle service status
 * @route   PATCH /api/services/:id/status
 */
export const toggleServiceStatus = async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const serviceId = req.params.id;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    // Authorization
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: service.branchId, ownerId });
      if (!branch)
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
    } else if (role === "receptionist") {
      if (service.branchId.toString() !== req.session.branchId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
    }

    service.status = service.status === "active" ? "inactive" : "active";
    await service.save();

    res.json({ success: true, message: "Status updated", service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete a service
 * @route   DELETE /api/services/:id
 */
export const deleteService = async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const serviceId = req.params.id;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    // Authorization
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: service.branchId, ownerId });
      if (!branch)
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
    } else if (role === "receptionist") {
      if (service.branchId.toString() !== req.session.branchId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied." });
      }
    }

    await Service.findByIdAndDelete(serviceId);
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
