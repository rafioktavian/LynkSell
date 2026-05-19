import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminDb } from '@/lib/firebase-admin';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password } = result.data;
    const db = getAdminDb();
    const usersRef = db.collection('users');
    const emailCheck = await usersRef.where('email', '==', email).limit(1).get();

    if (!emailCheck.empty) {
      return NextResponse.json({ success: false, error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUserRef = usersRef.doc();
    
    await newUserRef.set({
      id: newUserRef.id,
      name,
      email,
      passwordHash,
      image: null,
      brandName: null,
      brandSlug: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, userId: newUserRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('[LynkSell] Register error:', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
