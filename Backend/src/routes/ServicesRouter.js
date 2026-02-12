import express from "express";
import Service from "../models/services.model.js";
import Branch from "../models/branch.model.js";
import { validateService } from "../middlewares/ServiceValidation.js";

const router = express.Router();

/* ============================================
   CREATE SERVICE - Admin Only
   ============================================ */
router.post("/", validateService, async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;

    // 1. Verify session exists and user is admin
    if (!ownerId || role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    // 2. Verify the branch belongs to this owner
    const branch = await Branch.findOne({
      _id: req.body.branchId,
      ownerId: ownerId,
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found or you don't have access to it.",
      });
    }

    // 3. Create the service
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

/* ============================================
   GET ALL SERVICES
   - Admin: Gets services for all their branches
   - Receptionist: Gets services for their branch only
   ============================================ */
router.get("/", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const staffBranchId = req.session.branchId; // For receptionist

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    let services;

    if (role === "admin") {
      // Admin: Get all branches they own, then get services for those branches
      const branches = await Branch.find({ ownerId }).select("_id");
      const branchIds = branches.map((b) => b._id);

      // Optional: Filter by category or specific branch from query params
      const { branchId, category } = req.query;

      let query = { branchId: { $in: branchIds } };

      if (branchId) {
        query.branchId = branchId;
      }
      if (category && category !== "all") {
        query.category = category;
      }

      services = await Service.find(query).populate("branchId", "name city");
    } else if (role === "receptionist") {
      // Receptionist: Only their branch's services
      const { category } = req.query;

      let query = { branchId: staffBranchId };

      if (category && category !== "all") {
        query.category = category;
      }

      services = await Service.find(query).populate("branchId", "name city");
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Invalid role.",
      });
    }

    res.json({
      success: true,
      services,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

/* ============================================
   UPDATE SERVICE
   - Admin: Can update any service in their branches
   - Receptionist: Can only toggle status (handled separately)
   ============================================ */
router.put("/:id", validateService, async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const serviceId = req.params.id;

    // Only admin can fully update services
    if (!ownerId || role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Verify the service's branch belongs to this owner
    const branch = await Branch.findOne({
      _id: service.branchId,
      ownerId: ownerId,
    });

    if (!branch) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this service.",
      });
    }

    // If branchId is being changed, verify the new branch also belongs to owner
    if (
      req.body.branchId &&
      req.body.branchId !== service.branchId.toString()
    ) {
      const newBranch = await Branch.findOne({
        _id: req.body.branchId,
        ownerId: ownerId,
      });

      if (!newBranch) {
        return res.status(404).json({
          success: false,
          message: "New branch not found or you don't have access to it.",
        });
      }
    }

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      req.body,
      { new: true, runValidators: true },
    ).populate("branchId", "name city");

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

/* ============================================
   TOGGLE SERVICE STATUS
   - Admin: Can toggle any service in their branches
   - Receptionist: Can toggle services in their branch
   ============================================ */
router.patch("/:id/status", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const staffBranchId = req.session.branchId;
    const serviceId = req.params.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Authorization check based on role
    if (role === "admin") {
      // Admin: Verify the service's branch belongs to them
      const branch = await Branch.findOne({
        _id: service.branchId,
        ownerId: ownerId,
      });

      if (!branch) {
        return res.status(403).json({
          success: false,
          message: "You don't have access to this service.",
        });
      }
    } else if (role === "receptionist") {
      // Receptionist: Can only toggle services in their branch
      if (service.branchId.toString() !== staffBranchId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only modify services in your branch.",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Invalid role.",
      });
    }

    // Toggle the status
    service.status = service.status === "active" ? "inactive" : "active";
    await service.save();

    res.json({
      success: true,
      message: "Service status updated successfully",
      service,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

/* ============================================
   DELETE SERVICE - Admin Only
   ============================================ */
router.delete("/:id", async (req, res) => {
  try {
    const ownerId = req.session.ownerId;
    const role = req.session.role;
    const serviceId = req.params.id;

    // Only admin can delete services
    if (!ownerId || role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Verify the service's branch belongs to this owner
    const branch = await Branch.findOne({
      _id: service.branchId,
      ownerId: ownerId,
    });

    if (!branch) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this service.",
      });
    }

    // Delete the service
    await Service.findByIdAndDelete(serviceId);

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

export default router;
