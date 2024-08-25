const db = require('../db/db');

// Add School API
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

// List Schools API
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    try {
        const [schools] = await db.query('SELECT * FROM schools');

        // Calculate distance and sort by proximity
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(latitude, longitude, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json(schoolsWithDistance);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = angle => (Math.PI / 180) * angle;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
