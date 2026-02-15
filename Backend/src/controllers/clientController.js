import { Client } from "../models/client.model.js";
import { Appointment } from "../models/Appointment.js";

// Helper to generate a consistent gradient based on name/id
const getGradient = (id) => {
  const gradients = [
    "from-rose-500 to-pink-500",
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-amber-500",
  ];
  const index =
    id.toString().charCodeAt(id.toString().length - 1) % gradients.length;
  return gradients[index];
};

export const createClient = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    let { branchId } = req.body;

    // Authorization: If role === 'receptionist', force branchId to req.session.branchId
    if (req.session.role === "receptionist") {
      branchId = req.session.branchId;

      if (!branchId) {
        return res.status(403).json({
          message: "Branch assignment missing. Please contact administrator.",
        });
      }
    } else if (req.session.role === "admin") {
      // Admin must provide branchId
      if (!branchId) {
        return res.status(400).json({
          message: "Branch selection is required",
        });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if client with this email already exists in this branch
    const existingClient = await Client.findOne({ email, branchId });
    if (existingClient) {
      return res.status(400).json({
        message: "Client with this email already exists in this branch",
      });
    }

    const newClient = new Client({
      name,
      email,
      phone,
      location: location || "Unknown",
      branchId,
    });
    await newClient.save();

    // Return formatted response
    const clientResponse = {
      id: newClient._id,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      location: newClient.location,
      visits: newClient.totalVisits,
      spent: `$${newClient.totalSpent}`,
      avatar: newClient.avatar,
      gradient: getGradient(newClient._id),
      createdAt: newClient.createdAt,
      branchId: newClient.branchId,
    };

    res.status(201).json(clientResponse);
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ message: "Error creating client", error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    let filter = {};

    // Filter by branchId based on role
    if (req.session.role === "admin") {
      // Admin: allow optional branchId query param
      const { branchId } = req.query;
      if (branchId) {
        filter.branchId = branchId;
      }
      // If no branchId provided, show all clients across all branches
    } else if (req.session.role === "receptionist") {
      // Receptionist: strictly filter by their assigned branch
      if (!req.session.branchId) {
        return res.status(403).json({
          message: "Branch assignment missing. Please contact administrator.",
        });
      }
      filter.branchId = req.session.branchId;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 });

    // Calculate stats for each client (visits, spent)
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const appointments = await Appointment.find({ email: client.email });

        const visits = appointments.length;
        // Using stored totalSpent or calculating from appointments
        const totalSpent = client.totalSpent || visits * 50;

        return {
          id: client._id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          location: client.location,
          visits: visits,
          spent: `$${totalSpent}`,
          avatar: client.avatar,
          gradient: getGradient(client._id),
          createdAt: client.createdAt,
          branchId: client.branchId,
        };
      }),
    );

    res.status(200).json(clientsWithStats);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

// Internal function to find or create client during appointment booking
export const findOrCreateClient = async (clientData) => {
  // Ensure we search within the specific branch if provided
  const query = {
    $or: [{ email: clientData.email }, { phone: clientData.phone }],
  };

  if (clientData.branchId) {
    query.branchId = clientData.branchId;
  }

  let client = await Client.findOne(query);

  if (!client) {
    client = new Client({
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      location: clientData.location || "Online",
      branchId: clientData.branchId, // Ensure branchId is provided
    });
    await client.save();
  }
  return client;
};

// Update client details
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, location } = req.body;
    let { branchId } = req.body;

    // Find the existing client first
    const existingClient = await Client.findById(id);
    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Authorization: If role === 'receptionist'
    if (req.session.role === "receptionist") {
      // Ensure client belongs to their branch
      if (existingClient.branchId.toString() !== req.session.branchId) {
        return res.status(403).json({
          message: "You can only edit clients from your branch",
        });
      }

      // Prevent changing branchId
      if (branchId && branchId !== req.session.branchId) {
        return res.status(403).json({
          message: "You cannot change the branch assignment",
        });
      }

      // Force branchId to stay the same
      branchId = req.session.branchId;
    } else if (req.session.role === "admin") {
      // Admin can change branchId if provided, otherwise keep existing
      if (!branchId) {
        branchId = existingClient.branchId;
      }
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check for email conflicts in the same branch (if email is being changed)
    if (email && email !== existingClient.email) {
      const emailConflict = await Client.findOne({
        email,
        branchId,
        _id: { $ne: id },
      });
      if (emailConflict) {
        return res.status(400).json({
          message: "Client with this email already exists in this branch",
        });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { name, email, phone, location, branchId },
      { new: true, runValidators: true },
    );

    // Return formatted response
    const clientResponse = {
      id: updatedClient._id,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
      location: updatedClient.location,
      visits: updatedClient.totalVisits,
      spent: `$${updatedClient.totalSpent}`,
      avatar: updatedClient.avatar,
      gradient: getGradient(updatedClient._id),
      branchId: updatedClient.branchId,
    };

    res.json(clientResponse);
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ message: "Error updating client", error: error.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization: Restrict to role === 'admin'
    if (req.session.role !== "admin") {
      return res.status(403).json({
        message: "Only administrators can delete clients",
      });
    }

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res
      .status(500)
      .json({ message: "Error deleting client", error: error.message });
  }
};
