const BASE_URL = 'http://127.0.0.1:5000/api';

async function verifyMedicalFlow() {
    const randomId = Math.floor(Math.random() * 9999);

    // 1. Register Medical Staff (Securely)
    const medicalUser = {
        name: `Dr. Verify ${randomId}`,
        email: `doctor${randomId}@hospital.com`,
        password: 'password123',
        role: 'medical',
        phone: '108108108',
        secretCode: 'TEMPLE_SECURE_2024'
    };

    try {
        console.log('1. Registering Medical User...');
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicalUser)
        });

        if (!regRes.ok) {
            const err = await regRes.text();
            throw new Error(`Registration failed: ${err}`);
        }

        const userData = await regRes.json();
        console.log('   Success! Registered:', userData.email);
        const token = userData.token;

        // 2. Fetch Medical Incidents
        console.log('2. Fetching Encrypted Medical Incidents...');
        const incRes = await fetch(`${BASE_URL}/incidents?type=medical`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!incRes.ok) throw new Error(`Fetch failed: ${incRes.status}`);

        const incidents = await incRes.json();
        console.log(`   Success! Found ${incidents.length} medical incidents.`);
        console.log('MEDICAL FLOW VERIFIED ✅');

    } catch (error) {
        console.error('VERIFICATION FAILED ❌:', error.message);
    }
}

verifyMedicalFlow();
