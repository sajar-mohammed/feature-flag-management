// API utilities for User application — targets backend port 5001

const BASE_URL = 'http://localhost:5001/api';

export interface FeatureCheckResponse {
  success: boolean;
  enabled: boolean;
  message?: string;
}

export async function checkFeature(
  organizationCode: string,
  featureKey: string
): Promise<FeatureCheckResponse> {
  const res = await fetch(`${BASE_URL}/feature-check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      organizationCode: organizationCode.trim().toUpperCase(),
      featureKey: featureKey.trim().toLowerCase(),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to check feature status');
  }

  return data as FeatureCheckResponse;
}
