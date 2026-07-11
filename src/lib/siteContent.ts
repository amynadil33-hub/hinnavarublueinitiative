import { supabase } from './supabase';

export type SiteContentValue = string | number | boolean | null | SiteContentValue[] | { [key: string]: SiteContentValue };
export type SiteContentMap = Record<string, SiteContentValue>;

type SiteContentRow = {
  key?: string;
  slug?: string;
  title?: string;
  value?: SiteContentValue;
  content?: SiteContentValue;
  content_json?: SiteContentValue;
  body?: SiteContentValue;
  metadata?: SiteContentValue;
};

const parseMaybeJson = (value: SiteContentValue | undefined): SiteContentValue | undefined => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value) as SiteContentValue;
  } catch {
    return value;
  }
};

const normalizeRow = (row: SiteContentRow) => {
  const value = row.content_json ?? row.content ?? row.value ?? row.body ?? row.metadata ?? row.title;
  return parseMaybeJson(value);
};

export async function fetchSiteContent(keys: string[]) {
  try {
    // Some deployments use `slug` instead of `key`. Selecting the rows and
    // filtering client-side avoids querying a column that may not exist.
    const { data, error } = await supabase.from('site_content').select('*');

    if (error) {
      console.warn('Site content is unavailable; using page defaults.', error.message);
      return {};
    }

    const requestedKeys = new Set(keys);

    return ((data || []) as SiteContentRow[]).reduce<SiteContentMap>((acc, row) => {
      const key = row.key || row.slug;
      const value = normalizeRow(row);
      if (key && requestedKeys.has(key) && value !== undefined) acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.warn('Site content could not be loaded; using page defaults.', error);
    return {};
  }
}

export function getSiteText(content: SiteContentMap, key: string, fallback = '') {
  const value = content[key];
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return String(value.text || value.value || value.title || fallback);
  }
  return fallback;
}

export function getSiteObject<T extends Record<string, unknown>>(content: SiteContentMap, key: string, fallback: T): T {
  const value = content[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? ({ ...fallback, ...value } as T) : fallback;
}

export function getSiteArray<T>(content: SiteContentMap, key: string, fallback: T[]): T[] {
  const value = content[key];
  return Array.isArray(value) ? (value as T[]) : fallback;
}
