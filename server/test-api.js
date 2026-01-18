const http = require('http');

http.get('http://localhost:5000/api/temples', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const temples = JSON.parse(data);
            console.log(`Fetched ${temples.length} temples from API`);
            const kashi = temples.find(t => t.name.includes('Kashi'));
            if (kashi) {
                console.log('Kashi Data:', {
                    name: kashi.name,
                    deity: kashi.deity,
                    architecture: kashi.architecture,
                    openingHours: kashi.openingHours
                });
            }
        } catch (e) {
            console.error(e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
