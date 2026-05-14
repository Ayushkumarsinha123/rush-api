import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (payload: { id: string; email: string }) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '1d', 
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
};