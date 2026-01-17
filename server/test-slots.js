const API_URL = 'http://localhost:5000/api/slots';

async function testGetSlots() {
    try {
        console.log('Fetching slots...');
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch slots: ${response.statusText}`);
        }

        const slots = await response.json();
        console.log(`✅ Successfully fetched ${slots.length} slots.`);

        if (slots.length > 0) {
            const firstSlot = slots[0];
            console.log('Sample Slot:', {
                date: firstSlot.date,
                time: `${firstSlot.startTime} - ${firstSlot.endTime}`,
                zone: firstSlot.zone
            });
        }

    } catch (error) {
        console.error('❌ Error testing slots API:', error.message);
    }
}

testGetSlots();
