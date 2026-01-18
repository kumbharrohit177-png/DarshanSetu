const verifyTrends = async () => {
    try {
        console.log('1. Attempting Login...');
        const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'secret_admin_code'
            })
        });

        if (loginRes.ok) {
            const loginData = await loginRes.json();
            if (loginData.token) {
                console.log('Login Successful!');
                const token = loginData.token;

                console.log('2. Fetching Trends Data...');
                const trendsRes = await fetch('http://127.0.0.1:5000/api/analytics/trends', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (trendsRes.ok) {
                    const trendsData = await trendsRes.json();
                    if (Array.isArray(trendsData) && trendsData.length > 0) {
                        console.log('Trends Data Fetched Successfully!');
                        console.log(`Received ${trendsData.length} data points.`);
                        console.log('Sample Data:', trendsData[0]);
                    } else {
                        console.error('Failed to fetch trends data or data is empty.');
                        process.exit(1);
                    }
                } else {
                    console.error('Trends fetch failed with status:', trendsRes.status);
                    const errorText = await trendsRes.text();
                    console.error('Response:', errorText);
                    process.exit(1);
                }

            } else {
                console.error('Login failed to return token.');
                process.exit(1);
            }
        } else {
            console.error('Login failed with status:', loginRes.status);
            const errorText = await loginRes.text();
            console.error('Response:', errorText);
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification Failed:', error.message);
        process.exit(1);
    }
};

verifyTrends();
