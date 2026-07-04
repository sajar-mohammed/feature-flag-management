
const BASE_URL = 'http://localhost:5001/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('superadmin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export interface LoginResponse {
  success: boolean;
  token: string;
}

export async function loginSuperAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/super-admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }

  return data as LoginResponse;
}


export interface Organization {
  _id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationsResponse {
  success: boolean;
  data: Organization[];
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch(`${BASE_URL}/organization`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch organizations');
  }

  return data.data as Organization[];
}

export interface CreateOrganizationPayload {
  name: string;
  code: string;
}

export async function createOrganization(
  payload: CreateOrganizationPayload
): Promise<Organization> {
  const res = await fetch(`${BASE_URL}/organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create organization');
  }

  return data.data as Organization;
}
