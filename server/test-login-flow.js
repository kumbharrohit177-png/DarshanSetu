const API_URL = 'http://localhost:5000/api/auth';

const verifyAdminLogin = async () => {
    const adminUser = {
        email: 'admin@example.com',
        password: 'admin123'
    };

    try {
        console.log(`Attempting login for ${adminUser.email}...`);
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminUser)
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
            console.log('Admin Login SUCCESSFUL!');
            console.log('Token received:', loginData.token.substring(0, 20) + '...');
            console.log('User Role:', loginData.role);
        } else {
            console.log('Admin Login FAILED:');
            console.log('Status:', loginRes.status);
            console.log('Response:', loginData);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

verifyAdminLogin();
