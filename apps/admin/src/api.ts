// API utilities for the Admin app — targets backend at port 5001

const BASE_URL = 'http://localhost:5001/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  organizationCode: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function signupAdmin(payload: SignupPayload): Promise<SignupResponse> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Signup failed');
  return data as SignupResponse;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');
  return data as LoginResponse;
}

// ─── Feature Flags ────────────────────────────────────────────────────────────

export interface FeatureFlag {
  _id: string;
  featureKey: string;
  enabled: boolean;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  const res = await fetch(`${BASE_URL}/feature-flags`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch feature flags');
  return data.data as FeatureFlag[];
}

export interface CreateFeatureFlagPayload {
  featureKey: string;
  enabled: boolean;
}

export async function createFeatureFlag(payload: CreateFeatureFlagPayload): Promise<FeatureFlag> {
  const res = await fetch(`${BASE_URL}/feature-flags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create feature flag');
  return data.data as FeatureFlag;
}

export async function toggleFeatureFlag(id: string, enabled: boolean): Promise<FeatureFlag> {
  const res = await fetch(`${BASE_URL}/feature-flags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ enabled }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update feature flag');
  return data.data as FeatureFlag;
}
