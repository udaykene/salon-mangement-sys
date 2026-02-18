import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({
    baseURL: 'http://localhost:3000',
    jar,
    withCredentials: true
}));

async function run() {
    const timestamp = Date.now();
    // Use existing credentials
    const ownerEmail = `curl_${timestamp}@test.com`;
    // const ownerEmail = "curl2@test.com"; // Legacy
    const ownerPassword = "password123";

    try {
        console.log(`1. Registering new Owner (${ownerEmail})...`);
        await client.post('/auth/register', { // Register instead of Login to get new limits
            name: "Test Owner",
            email: ownerEmail,
            phone: `99${timestamp.toString().slice(-8)}`,
            password: ownerPassword,
            confirmPassword: ownerPassword,
            agreeTerms: true
        });

        console.log("2. Cleaning up existing branches...");
        try {
            const myBranches = await client.get('/api/branches/my-branches');
            for (const b of myBranches.data) {
                console.log(`   Deleting branch ${b._id}...`);
                await client.delete(`/api/branches/${b._id}`);
            }
        } catch (e) { console.log("   Cleanup warning:", e.message); }

        console.log("3. Creating Branch A...");
        const branchARes = await client.post('/api/branches', {
            name: `Branch A ${timestamp}`,
            address: "123 Test St",
            city: "Test City",
            state: "Test State",
            zipCode: "12345",
            phone: `123${timestamp.toString().slice(-7)}`,
            email: `branchA_${timestamp}@test.com`,
            openingTime: "09:00",
            closingTime: "17:00",
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            isActive: true
        });
        if (!branchARes.data || !branchARes.data._id) {
            console.error("Failed to create Branch A:", branchARes.data);
            return;
        }
        const branchAId = branchARes.data._id;
        console.log("   Branch A ID:", branchAId);

        console.log("4. Creating Branch B...");
        const branchBRes = await client.post('/api/branches', {
            name: `Branch B ${timestamp}`,
            address: "456 Other St",
            city: "Other City",
            state: "Other State",
            zipCode: "67890",
            phone: `456${timestamp.toString().slice(-7)}`,
            email: `branchB_${timestamp}@test.com`,
            openingTime: "09:00",
            closingTime: "17:00",
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            isActive: true
        });
        if (!branchBRes.data || !branchBRes.data._id) {
            console.error("Failed to create Branch B:", branchBRes.data);
            return;
        }
        const branchBId = branchBRes.data._id;
        console.log("   Branch B ID:", branchBId);

        console.log("5. Creating Staff in Branch A...");
        // Receptionist A (We will login as this user)
        const phoneA1 = `97${timestamp.toString().slice(-8)}`;
        const staffA1Res = await client.post('/api/staff', {
            name: "Receptionist A",
            phone: phoneA1,
            branchId: branchAId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Receptionist",
            roleTitle: "Receptionist",
            specialization: "Front Desk"
        });
        const staffA1Id = staffA1Res.data._id;
        console.log(`   Staff A1 (Receptionist) ID: ${staffA1Id}, Phone: ${phoneA1}`);

        // Barber A
        const staffA2Res = await client.post('/api/staff', {
            name: "Barber A",
            phone: `96${timestamp.toString().slice(-8)}`,
            branchId: branchAId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Barber",
            roleTitle: "Barber",
            specialization: "Cutting"
        });
        console.log(`   Staff A2 (Barber) ID: ${staffA2Res.data._id}`);

        console.log("6. Creating Staff in Branch B (Should be invisible to Receptionist A)...");
        // Stylist B
        const staffB1Res = await client.post('/api/staff', {
            name: "Stylist B",
            phone: `95${timestamp.toString().slice(-8)}`,
            branchId: branchBId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Stylist",
            roleTitle: "Stylist",
            specialization: "Styling"
        });
        console.log(`   Staff B1 (Stylist) ID: ${staffB1Res.data._id}`);

        console.log("7. Logging out Owner...");
        await client.post('/auth/logout');

        console.log(`8. Logging in as Receptionist A (Phone: ${phoneA1})...`);
        await client.post('/auth/login/staff', {
            phone: phoneA1
        });

        console.log("9. Checking Availability as Receptionist A...");
        // Call /availability. The backend now uses req.session.staffId to find the branch.
        const availRes = await client.get(`/api/staff/availability?date=${new Date().toISOString().split('T')[0]}&time=10:00 AM`);

        console.log("\n--- VISIBLE STAFF ---");
        const visibleNames = availRes.data.map(s => `${s.name} (${s.roleTitle || s.role})`);
        console.log(visibleNames);
        console.log("---------------------\n");

        const seesA1 = visibleNames.some(n => n.includes("Receptionist A"));
        const seesA2 = visibleNames.some(n => n.includes("Barber A"));
        const seesB1 = visibleNames.some(n => n.includes("Stylist B"));

        // Expected: seesA1 (Self), seesA2 (Barber A).
        // Expected: DOES NOT see seesB1 (Stylist B) because of strict isolation.
        if (seesA1 && seesA2 && !seesB1) {
            console.log("✅ SUCCESS: Receptionist A sees ONLY Branch A staff. Isolation working as requested.");
        } else {
            console.error("❌ FAILURE: Isolation check failed.");
            if (seesB1) console.error(" - Receptionist A CAN see Branch B staff (Should NOT).");
            if (!seesA1 || !seesA2) console.error(" - Receptionist A CANNOT see own branch staff.");
            process.exit(1);
        }

    } catch (err) {
        console.error("Script Error:", err.message);
        if (err.response) console.error("Response:", JSON.stringify(err.response.data));
    }
}

run();
