import { Client } from "../models/Client.js";
import { Appointment } from "../models/Appointment.js";

// Helper to generate a consistent gradient based on name/id (mocking for now)
const getGradient = (id) => {
    const gradients = [
        "from-rose-500 to-pink-500",
        "from-purple-500 to-pink-500",
        "from-blue-500 to-cyan-500",
        "from-green-500 to-emerald-500",
        "from-orange-500 to-amber-500",
    ];
    // Simple hash-like selection
    const index = id.toString().charCodeAt(id.toString().length - 1) % gradients.length;
    return gradients[index];
};

export const createClient = async (req, res) => {
    try {
        const { name, email, phone, location } = req.body;

        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: "Client with this email already exists" });
        }

        const newClient = new Client({ name, email, phone, location });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: "Error creating client", error: error.message });
    }
};

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });

        // Calculate stats for each client (visits, spent)
        // This could be optimized with aggregation, but doing it in code for simplicity first
        const clientsWithStats = await Promise.all(clients.map(async (client) => {
            const appointments = await Appointment.find({ email: client.email });

            const visits = appointments.length;
            // Assuming we have a 'price' field eventually, or just mocking revenue for now.
            // Since Appointment model currently doesn't have price, let's mock it or use 0
            // For now, let's assume a standard appointment is $50
            const totalSpent = visits * 50;

            return {
                id: client._id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                location: client.location,
                status: visits > 0 ? "active" : "inactive", // Logic can be improved
                visits: visits,
                spent: `$${totalSpent}`,
                avatar: client.avatar || client.name.charAt(0).toUpperCase(),
                gradient: getGradient(client._id),
                createdAt: client.createdAt
            };
        }));

        res.status(200).json(clientsWithStats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching clients", error: error.message });
    }
};

// Internal function to find or create client during appointment booking
export const findOrCreateClient = async (clientData) => {
    let client = await Client.findOne({
        $or: [{ email: clientData.email }, { phone: clientData.phone }]
    });

    if (!client) {
        client = new Client({
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            location: "Online", // Default location for online bookings
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

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { name, email, phone, location },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: "Error updating client", error: error.message });
    }
};

// Delete client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client", error: error.message });
    }
};
