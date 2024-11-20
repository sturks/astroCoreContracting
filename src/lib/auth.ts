import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'core-contracting-jwt-secret-2024';
const ADMIN_PASSWORD_HASH = '$2a$10$.s2qkJEP3v.glJThIeRIxOXm9lKKyX/sOCNIGIvCVSVPq5shf1M2K';

export async function isAuthenticated(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1] ||
                request.cookies.get('auth_token')?.value;
  
  if (!token) return false;
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function authenticate(password: string) {
  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  return jwt.sign({}, JWT_SECRET, { expiresIn: '24h' });
}