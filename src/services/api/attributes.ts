import { AttributesApiResponse } from '../../types/api/attributes.types';

const CONTENT_CONFIG_API_URL = import.meta.env.VITE_CONTENT_CONFIG_API_URL || 'https://content-config-dev.meeta.jp/v1';
const USE_ATTRIBUTES_API = import.meta.env.VITE_USE_ATTRIBUTES_API === 'true';

export async function getAttributes(
  clientId: string,
  group: string = 'grade',
  isActive: boolean = true
): Promise<AttributesApiResponse | null> {
  if (!USE_ATTRIBUTES_API) {
    console.log('Attributes API is disabled');
    return null;
  }

  try {
    const params = new URLSearchParams({
      clientId,
      group,
      isActive: isActive.toString()
    });

    const url = `${CONTENT_CONFIG_API_URL}/attributes?${params}`;
    console.log('Fetching attributes from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Attributes API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Attributes fetched successfully:', data);
    return data as AttributesApiResponse;
  } catch (error) {
    console.error('Failed to fetch attributes:', error);
    return null;
  }
}

export function isAttributesApiEnabled(): boolean {
  return USE_ATTRIBUTES_API;
}
