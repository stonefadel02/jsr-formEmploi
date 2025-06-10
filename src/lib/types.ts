// lib/types.ts
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';
import { User } from "next-auth";

export interface MyUser extends User {
  userType?: string;
}


export interface IPersonalInfo {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface IAlternanceSearch {
  sector?: string;
  location?: string;
  level?: string;
  contracttype?: string;
}

export interface ICandidat extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: 'candidat';
  authProvider: string;
  phone?: string;
  alternanceSearch?: {
    sector?: string;
    location?: string;
    level?: string;
    contracttype?: string;
  };
  cvUrl?: string;
  videoUrl?: string;
  status?: 'En attente' | 'Validé' | 'Refusé';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscription {
  employerId: {
    companyName?: string;
    email?: string;
  } | Types.ObjectId;
  plan: 'Gratuit' | 'Standard' | 'Premium';
  startDate: Date;
  endDate?: Date;
  isTrial: boolean;
  isActive: boolean;
  price: number;
  paymentId?: string;
}


export interface IEmployer {
  _id: Types.ObjectId;
  companyName: string;
  email: string;
  password: string;
  authProvider: string;
  status: 'En attente' | 'Validé' | 'Suspendu' | 'Refusé';
  role: 'employeur' | 'admin';
  subscription: ISubscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthRequest extends NextRequest {
  user?: { id: string; email: string; role: string };
}