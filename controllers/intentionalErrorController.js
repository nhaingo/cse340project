const intentionalErrorController = {}

// controllers/intentionalErrorController.js
intentionalErrorController.causeError = (req, res, next) => {
    try {
        // Simulating an error by throwing an exception
        throw new Error('Intentional error triggered!');
    } catch (err) {
        // Pass the error to the error-handling middleware
        next(err);
    }
};

module.exports = intentionalErrorController;
