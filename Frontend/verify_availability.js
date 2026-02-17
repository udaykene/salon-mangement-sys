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
        const payload = {
            name: "Test Owner",
            email: ownerEmail,
            password: ownerPassword,
            confirmPassword: ownerPassword,
            phone: `99${timestamp.toString().slice(-8)}`, // 10 digit phone
            agreeTerms: true
        };
        console.log("   Payload:", JSON.stringify(payload));

        try {
            await client.post('/auth/register', payload);
        } catch (regErr) {
            console.error("   Registration Failed:", regErr.message);
            if (regErr.response) {
                console.error("   Response Data:", JSON.stringify(regErr.response.data));
                console.error("   Response Status:", regErr.response.status);
            }
            throw regErr;
        }

        console.log("2. Logging in...");
        await client.post('/auth/login', {
            email: ownerEmail,
            password: ownerPassword
        });

        console.log("3. Creating Branch...");
        const branchRes = await client.post('/api/branches', {
            branchName: `Test Branch ${timestamp}`,
            location: "Test Location",
            openingTime: "09:00",
            closingTime: "17:00",
            managerName: "Test Manager",
            managerPhone: `98${timestamp.toString().slice(-8)}`,
            managerEmail: `manager_${timestamp}@test.com`,
            managerPassword: "password123"
        });
        const branchId = branchRes.data.branch._id;
        console.log("   Branch ID:", branchId);

        console.log("4. Creating Staff...");
        const staffRes = await client.post('/api/staff', {
            name: "Test Staff",
            phone: `97${timestamp.toString().slice(-8)}`,
            branchId: branchId,
            workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            workingHours: { start: "09:00", end: "17:00" },
            specialization: "Haircut"
        });
        const staffId = staffRes.data._id;
        console.log("   Staff ID:", staffId);

        console.log("5. Creating Category...");
        const catRes = await client.post('/api/categories', {
            name: `Test Cat ${timestamp}`,
            branchId: branchId
        });
        const categoryId = catRes.data.category ? catRes.data.category._id : catRes.data._id;
        console.log("   Category ID:", categoryId);

        console.log("6. Creating Service...");
        const serviceRes = await client.post('/api/services', {
            name: `Service_${timestamp}`,
            category: categoryId,
            price: 100,
            duration: "45 min",
            branchId: branchId,
            gender: "Unisex"
        });
        const serviceName = serviceRes.data.name;
        console.log("   Service Name:", serviceName);

        console.log("7. Checking Initial Availability (10:00 AM)...");
        const availRes1 = await client.get(`/api/staff/availability?branchId=${branchId}&date=${new Date().toISOString().split('T')[0]}&time=10:00 AM`);
        const myStaff1 = availRes1.data.find(s => s._id === staffId);
        console.log("   Status:", myStaff1 ? myStaff1.currentStatus : "Staff not found in availability list");

        console.log("8. Booking Appointment at 10:00 AM...");
        await client.post('/api/appointments', {
            customerName: "Test Client",
            email: "client@test.com",
            phone: "1234567890",
            category: "Test Cat",
            service: serviceName,
            staff: staffId,
            date: new Date().toISOString().split('T')[0], // Today
            time: "10:00 AM",
            branchId: branchId
        });
        console.log("   Booking success.");

        console.log("9. Checking Availability after Booking (10:15 AM)...");
        const availRes2 = await client.get(`/api/staff/availability?branchId=${branchId}&date=${new Date().toISOString().split('T')[0]}&time=10:15 AM`);
        const myStaff2 = availRes2.data.find(s => s._id === staffId);
        console.log("   Status (should be busy):", myStaff2 ? myStaff2.currentStatus : "Staff not found"); // Expect busy

        console.log("10. Attempting Overlapping Booking (10:15 AM)...");
        try {
            await client.post('/api/appointments', {
                customerName: "Test Client 2",
                email: "client2@test.com",
                phone: "0987654321",
                category: "Test Cat",
                service: serviceName,
                staff: staffId,
                date: new Date().toISOString().split('T')[0],
                time: "10:15 AM", // Overlaps with 10:00 - 10:45
                branchId: branchId
            });
            console.error("   ❌ Failed: Overlapping booking was ALLOWED!");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log("   ✅ Success: Overlapping booking blocked.", err.response.data.message);
            } else {
                console.error("   ❌ Failed: Unexpected error", err.message);
                if (err.response) {
                    console.error("   Response Data:", JSON.stringify(err.response.data));
                }
            }
        }

    } catch (err) {
        // Global catch block just in case
        // Already handled specific step errors
    }
}

run();
