const BASE_URL = 'http://127.0.0.1:5000/api/auth';

async function debugRegister() {
    const randomId = Math.floor(Math.random() * 9999);
    const body = {
        name: `Debug Admin ${randomId}`,
        email: `debug${randomId}@test.com`,
        password: 'password123',
        role: 'admin',
        phone: '5555555555',
        secretCode: 'TEMPLE_SECURE_2024'
    };

    console.log('Sending Body:', JSON.stringify(body, null, 2));

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response Text:', text);
    } catch (err) {
        console.error('FETCH ERROR:', err.message);
        if (err.cause) console.error('Cause:', err.cause);
    }
}

debugRegister();
