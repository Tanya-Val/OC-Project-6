const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extract auth token, split by '', take 1st el of the array - the token
        const token = req.headers.authorization.split(' ')[1];
        // Decode the token and compare 
        const decodedToken = jwt.verify(token, 'DEVEV_RANDOM_SECRET');
        // Get the userId from the decoded token
        const userId = decodedToken.userId;
        req.auth = { userId };

        // Compare the userId from the token with the one from the body
        if (req.body.userId && req.body.userId !== userId) {
            // If not equal, throw error
            throw 'Invalid user ID';
        } else {
            // If equal, move next
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};