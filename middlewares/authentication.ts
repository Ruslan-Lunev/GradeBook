import { Request, Response, NextFunction } from 'express';
import { security } from '../settings';
import * as jwt from 'jsonwebtoken';

/**
 * Middleware function to verify JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    var token = req.cookies['token']
    //const token = req.header('Authorization').split(' ')[1]
    //const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        //return res.status(401).json({ message: 'Unauthorized' });
        throw new Error('Unauthorized')
    }

    try {
        const user = jwt.verify(token, security.jwtSecret);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Unauthorized')
        //return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};