import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not set in env → using fallback (insecure for production)');
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(
  userId: string,
  role: string,
  receiverType?: string
): string {
  return jwt.sign(
    { userId, role, receiverType },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      receiverType?: string;
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await User.findById(payload.userId).select('-password').lean();
  return user;
}