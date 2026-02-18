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
    try {
        // 1. Register/Login as Owner to get a valid session/data if needed, 
        // OR just login as the existing owner from previous steps if possible.
        // For simplicity, we'll create a new fresh set to guarantee data state.
        const timestamp = Date.now();
        const ownerEmail = `owner_debug_roles_${timestamp}@test.com`;
        const password = 'password123';

        console.log("1. Registering Owner...");
        await client.post('/auth/register', {
            name: "Test Owner",
            email: ownerEmail,
            password,
            confirmPassword: password,
            phone: `99${timestamp.toString().slice(-8)}`,
            agreeTerms: true
        });

        console.log("2. Creating Branch...");
        const branchRes = await client.post('/api/branches', {
            branchName: `Branch ${timestamp}`,
            location: "Loc",
            openingTime: "09:00",
            closingTime: "17:00",
            managerName: "Manager",
            managerPhone: `98${timestamp.toString().slice(-8)}`,
            managerEmail: `manager_${timestamp}@test.com`,
            managerPassword: password
        });
        const branchId = branchRes.data.branch._id;

        console.log("3. Creating 'Barber' Staff...");
        // NOTE: Creating with 'role' which usually maps to roleTitle in some flows, 
        // or we need to see how the POST /api/staff handles it.
        // Staff Model: role (default 'staff'), roleTitle (default 'Receptionist').
        // Let's see what happens when we send 'role'.
        await client.post('/api/staff', {
            name: "Barber John",
            phone: `97${timestamp.toString().slice(-8)}`,
            branchId: branchId,
            workingDays: ["Mon", "Fri"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Barber", // The frontend sends 'role' in the form? Or 'roleTitle'?
            // We need to check the request usually sent by frontend.
            // But let's send 'Barber' and see where it lands.
            status: "active"
        });

        console.log("4. Creating 'Hair Stylist' Staff...");
        await client.post('/api/staff', {
            name: "Stylist Jane",
            phone: `96${timestamp.toString().slice(-8)}`,
            branchId: branchId,
            workingDays: ["Mon", "Fri"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Hair Stylist",
            status: "active"
        });

        console.log("5. Logging in as Receptionist (using Barber John for testing, though typically receptionist logs in)...");
        // Actually, let's create a dedicated receptionist to login
        const recepRes = await client.post('/api/staff', {
            name: "Receptionist Staff",
            phone: `95${timestamp.toString().slice(-8)}`,
            branchId: branchId,
            workingDays: ["Mon", "Fri"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Receptionist",
            status: "active"
        });

        await client.post('/auth/logout');
        await client.post('/auth/login/staff', { phone: `95${timestamp.toString().slice(-8)}` });

        console.log("6. Fetching Availability...");
        const res = await client.get(`/api/staff/availability?branchId=${branchId}`);

        console.log("\n--- STAFF DATA DUMP ---");
        res.data.forEach(s => {
            console.log(`Name: ${s.name}`);
            console.log(`   role: ${s.role}`);
            console.log(`   roleTitle: ${s.roleTitle}`);
            console.log(`   Computed Filter Role would be: ${s.roleTitle || s.role}`);
            console.log("-----------------------");
        });

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error(JSON.stringify(err.response.data));
    }
}

run();
