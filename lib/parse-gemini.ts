export function parseGeminiJSON<T>(rawText: string, fallback: T): T {
  if (!rawText || typeof rawText !== 'string') return fallback;

  const sanitize = (text: string) => text.trim();

  // 1. JSON murni
  try {
    return JSON.parse(sanitize(rawText)) as T;
  } catch (e) {}

  // 2. ```json fence
  try {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(sanitize(match[1])) as T;
    }
  } catch (e) {}

  // 3. JSON dalam teks panjang
  try {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(sanitize(rawText.slice(start, end + 1))) as T;
    }
  } catch (e) {}

  // 4. Total gagal
  console.warn('[LynkSell] parseGeminiJSON gagal, menggunakan fallback.', rawText.substring(0, 100));
  return fallback;
}

export function parseGeminiJSONArray<T>(rawText: string, fallback: T[]): T[] {
  if (!rawText || typeof rawText !== 'string') return fallback;

  const parse = (text: string): T[] | null => {
    try {
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed)) return parsed as T[];
    } catch (e) {}
    return null;
  };

  // 1. Array murni
  const res1 = parse(rawText);
  if (res1) return res1;

  // 2. ```json fence
  try {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      const res2 = parse(match[1]);
      if (res2) return res2;
    }
  } catch (e) {}

  // 3. Array dalam teks panjang
  try {
    const start = rawText.indexOf('[');
    const end = rawText.lastIndexOf(']');
    if (start !== -1 && end > start) {
      const res3 = parse(rawText.slice(start, end + 1));
      if (res3) return res3;
    }
  } catch (e) {}

  // 4. Total gagal
  console.warn('[LynkSell] parseGeminiJSONArray gagal, menggunakan fallback.', rawText.substring(0, 100));
  return fallback;
}

export function safeGet<T>(obj: unknown, path: string, defaultVal: T): T {
  try {
    const keys = path.split('.');
    let current: any = obj;
    for (const key of keys) {
      if (current === null || current === undefined) {
        return defaultVal;
      }
      current = current[key];
    }
    return current !== undefined && current !== null ? current : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}
