import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const authHeader = req.get('Authorization')

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }

    // Allow both "Bearer <token>" and raw <token>
    const token = authHeader.startsWith('Bearer ') ?
        authHeader.split(' ')[1] :
        authHeader

    if (!token) {
        return res.status(400).json({ message: 'Invalid token format' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" })
        }

        req.userId = decoded.id
        next()
    })
}

export default authMiddleware