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
        const timestamp = Date.now();
        const ownerEmail = `owner_${timestamp}@test.com`;
        const ownerPassword = 'password123';

        console.log("1. Registering Owner...");
        // COPIED EXACTLY FROM verify_availability.js
        const payload = {
            name: "Test Owner",
            email: ownerEmail,
            password: ownerPassword,
            confirmPassword: ownerPassword,
            phone: `99${timestamp.toString().slice(-8)}`, // 10 digit phone
            agreeTerms: true
        };

        try {
            await client.post('/auth/register', payload);
        } catch (err) {
            console.error("Owner Registration Failed.");
            if (err.response) {
                console.error("Status:", err.response.status);
                console.error("Data:", JSON.stringify(err.response.data));
            }
            throw err;
        }

        console.log("2. Creating Branch A...");
        const branchARes = await client.post('/api/branches', {
            branchName: `Branch A ${timestamp}`,
            location: "Loc A",
            openingTime: "09:00",
            closingTime: "17:00",
            managerName: "Manager A",
            managerPhone: `98${timestamp.toString().slice(-8)}`,
            managerEmail: `managerA_${timestamp}@test.com`,
            managerPassword: ownerPassword
        });
        const branchAId = branchARes.data.branch._id;

        console.log("3. Creating Branch B...");
        const branchBRes = await client.post('/api/branches', {
            branchName: `Branch B ${timestamp}`,
            location: "Loc B",
            openingTime: "09:00",
            closingTime: "17:00",
            managerName: "Manager B",
            managerPhone: `97${timestamp.toString().slice(-8)}`,
            managerEmail: `managerB_${timestamp}@test.com`,
            managerPassword: ownerPassword
        });
        const branchBId = branchBRes.data.branch._id;

        console.log("4. Creating Staff A (in Branch A)...");
        const staffARes = await client.post('/api/staff', {
            name: "Staff A",
            phone: `96${timestamp.toString().slice(-8)}`,
            branchId: branchAId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Receptionist",
            status: "active"
        });
        const staffAId = staffARes.data._id;
        const staffAPhone = `96${timestamp.toString().slice(-8)}`;

        console.log("5. Creating Staff B (in Branch B)...");
        await client.post('/api/staff', {
            name: "Staff B",
            phone: `95${timestamp.toString().slice(-8)}`,
            branchId: branchBId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            workingHours: { start: "09:00", end: "17:00" },
            role: "Hair Stylist",
            status: "active"
        });

        console.log("6. Logging out Owner...");
        await client.post('/auth/logout');

        console.log("7. Logging in as Staff A (Receptionist Branch A)...");
        await client.post('/auth/login/staff', { phone: staffAPhone });

        console.log("8. Fetching Profile to get Branch ID...");
        const profileRes = await client.get('/api/profile');
        const myBranchId = profileRes.data.profile.branchId;
        console.log("   My Branch ID from profile:", myBranchId);

        if (myBranchId !== branchAId) {
            console.error("   ❌ Mismatch! Expected:", branchAId, "Got:", myBranchId);
        } else {
            console.log("   ✅ Branch ID matches.");
        }

        console.log("9. Fetching Availability with Branch ID...");
        const availRes = await client.get(`/api/staff/availability?branchId=${myBranchId}`);

        console.log("   Staff Found:", availRes.data.length);
        availRes.data.forEach(s => console.log(`   - ${s.name} (Branch: ${s.branchId})`));

        const foundStaffB = availRes.data.some(s => s.branchId === branchBId);
        if (foundStaffB) {
            console.error("   ❌ FAILED: Found staff from Branch B!");
        } else {
            console.log("   ✅ SUCCESS: Only verified branch staff found.");
        }

    } catch (err) {
        console.error("Global Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", JSON.stringify(err.response.data));
        }
    }
}

run();
