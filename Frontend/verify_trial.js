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
    const ownerEmail = `trial_${timestamp}@test.com`;
    const ownerPassword = "password123";

    try {
        console.log(`1. Registering new Owner (${ownerEmail})...`);
        const regRes = await client.post('/auth/register', {
            name: "Trial Owner",
            email: ownerEmail,
            phone: `88${timestamp.toString().slice(-8)}`,
            password: ownerPassword,
            confirmPassword: ownerPassword,
            agreeTerms: true
        });

        // 2. Check Trial Date from Registration Response or Profile
        console.log("   Registration success. Checking profile for trial date...");
        const profileRes = await client.get('/api/profile');
        const trialEnd = profileRes.data.profile.subscription?.trialEndsAt;
        console.log("   Trial Ends At (Fresh):", trialEnd);

        if (!trialEnd) {
            console.error("❌ FAILURE: No trialEndsAt found in profile.");
            process.exit(1);
        }

        const date = new Date(trialEnd);
        const now = new Date();
        const diffDays = (date - now) / (1000 * 60 * 60 * 24);
        console.log(`   Days remaining: ${diffDays.toFixed(1)}`);

        if (diffDays > 13 && diffDays <= 14.1) {
            console.log("✅ SUCCESS: Trial set for ~14 days.");
        } else {
            console.error("❌ FAILURE: Trial date incorrect.");
        }

        // 3. Mock Expiry (Manual DB update would be needed here, or we can just verify the frontend logic handles logic correctly)
        // Since we can't easily access DB directly from this script without a specialized route or DB connection,
        // we'll rely on the manual verification step to test the actual "Locked" screen appearance.
        // But we have verified the backend IS setting the date and exposing it.

    } catch (err) {
        console.error("Script Error:", err.message);
        if (err.response) console.error("Response:", JSON.stringify(err.response.data));
    }
}

run();
