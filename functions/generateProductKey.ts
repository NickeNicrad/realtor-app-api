import * as bcrypt from 'bcryptjs'

interface Payload {
    email: string;
    user_type: string;
}

function generateProductKey(payload: Payload) {
    const key = `${payload.email}-${payload.user_type}`;

    return bcrypt.hash(key, 12);
}

export default generateProductKey