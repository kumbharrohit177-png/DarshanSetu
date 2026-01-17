// Built-in fetch used in Node 18+

const BASE_URL = 'http://localhost:5000/api/auth';

async function testSecureRegister() {
    const randomId = Math.floor(Math.random() * 1000);
    const adminUser = {
        name: `Secure Admin ${randomId}`,
        email: `admin${randomId}@temple.com`,
        password: 'password123',
        role: 'admin',
        phone: '1234567890',
        secretCode: 'TEMPLE_SECURE_2024' // The correct code
    };

    try {
        console.log('Attempting to register with secret code:', adminUser.secretCode);
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminUser)
        });

        const rawText = await response.text();
        console.log('Response Status:', response.status);
        // console.log('Raw Body:', rawText); // Uncomment to see full HTML if needed

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.log('Could not parse JSON. Raw text start:', rawText.substring(0, 100));
        }

        if (response.ok) {
            console.log('SUCCESS: Registration worked!', data);
        } else {
            console.log('FAILED: Registration failed with status:', response.status);
            console.log('Error Message:', data.message);
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
}

testSecureRegister();
