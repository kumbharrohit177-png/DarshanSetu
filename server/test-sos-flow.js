const API_URL = 'http://localhost:5000/api';

async function testSOSFlow() {
    try {
        console.log('--- Starting SOS Flow Test (fetch) ---');

        // 1. Register/Login a test user
        const testUser = {
            name: 'SOS Tester',
            email: `sostester${Date.now()}@example.com`,
            password: 'password123',
            role: 'pilgrim',
            phone: '1234567890',
            age: 25,
            gender: 'male'
        };

        console.log('1. Registering test user...');
        let authResponse = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        let authData = await authResponse.json();

        if (!authResponse.ok) {
            console.log('Register failed, trying login... (Reason: ' + JSON.stringify(authData) + ')');
            authResponse = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });
            authData = await authResponse.json();
        }

        if (!authResponse.ok) {
            throw new Error(`Auth failed: ${JSON.stringify(authData)}`);
        }

        const token = authData.token;
        console.log('   User authenticated. Token received.');

        // 2. Report Incident (SOS)
        console.log('2. Sending SOS Incident...');
        const incidentData = {
            type: 'security',
            location: '12.3456, 78.9012', // Mock coordinates
            description: 'TEST SOS Alert from Script'
        };

        const incidentResponse = await fetch(`${API_URL}/incidents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(incidentData)
        });

        const incidentResult = await incidentResponse.json();

        console.log('   SOS Response Status:', incidentResponse.status);
        console.log('   Incident Created:', incidentResult);

        if (incidentResponse.status === 201 && incidentResult.type === 'security') {
            console.log('✅ SOS Flow Test PASSED');
        } else {
            console.log('❌ SOS Flow Test FAILED');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

testSOSFlow();
