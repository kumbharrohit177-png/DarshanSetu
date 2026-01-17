// Used built-in fetch

const API_URL = 'http://localhost:5000/api';

async function testBooking() {
    const uniqueId = Date.now();
    const userEmail = `pilgrim${uniqueId}@example.com`;
    const userPass = 'password123';

    try {
        console.log('1. Registering User...');
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Pilgrim',
                email: userEmail,
                password: userPass,
                phone: '9876543210',
                role: 'pilgrim',
                age: 25,
                gender: 'male'
            })
        });
        const user = await regRes.json();
        if (!regRes.ok) throw new Error(JSON.stringify(user));
        console.log('   User Token:', user.token ? 'Received' : 'Missing');

        console.log('\n2. Fetching Slots...');
        const slotsRes = await fetch(`${API_URL}/slots`);
        const slots = await slotsRes.json();
        if (slots.length === 0) throw new Error('No slots available. Seed slots first.');

        const targetSlot = slots[0];
        console.log(`   Target Slot ID: ${targetSlot._id} (${targetSlot.startTime})`);

        console.log('\n3. Creating Booking...');
        const bookRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                slotId: targetSlot._id,
                members: [
                    { name: 'Family Member 1', age: 30, gender: 'female' }
                ]
            })
        });
        const booking = await bookRes.json();
        if (!bookRes.ok) throw new Error(JSON.stringify(booking));

        console.log('   ✅ Booking Successful:', booking._id);
        console.log('   Status:', booking.status);

    } catch (error) {
        console.error('❌ Booking Test Failed:', error.message);
    }
}

testBooking();
