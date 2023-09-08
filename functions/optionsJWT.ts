import * as jwt from 'jsonwebtoken';

interface JWTPayload {
    id: number;
    name: string;
    email?: string;
    user_type?: string;
}

async function generateJWT(payload: JWTPayload) {
    return await jwt.sign(payload, process.env.JSON_SECRET_KEY);
}

async function verifyJWT(token: string) {
    return await jwt.verify(token, process.env.JSON_SECRET_KEY);
}

export default {
    verifyJWT,
    generateJWT
}