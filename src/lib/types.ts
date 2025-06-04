// lib/types.ts
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

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

export interface ICandidat {
  _id: Types.ObjectId;
  personalInfo: IPersonalInfo;
  alternanceSearch: IAlternanceSearch;
  cvUrl?: string;
  videoUrl?: string;
  status: 'En attente' | 'Validé' | 'Refusé';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  plan: 'Gratuit' | 'Standard' | 'Premium';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface IEmployer {
  _id: Types.ObjectId;
  companyName: string;
  email: string;
  password: string;
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