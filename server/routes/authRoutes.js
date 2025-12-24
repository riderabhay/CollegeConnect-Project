import express from 'express';
const router = express.Router();

const dummyController = (req, res) => {
    const { email, password } = req.body;
    
    // Simple logic for testing
    if (email === "test@gmail.com" && password === "123456") {
        return res.status(200).json({
            message: "Login successful!",
            username: "Abhay Nishad",
            userId: "u-12345",
            token: "dummy-jwt-token-123"
        });
    }
    
    return res.status(401).json({ message: "Invalid email or password." });
};

router.post('/register', (req, res) => {
    res.status(201).json({ 
        message: "Registration successful!", 
        username: req.body.username, 
        userId: "u-new" 
    });
});

router.post('/login', dummyController);

export default router;