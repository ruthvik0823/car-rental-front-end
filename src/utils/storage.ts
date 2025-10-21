export async function fetchJSON<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  }
  
  export function loadLocal<T>(key: string): T[] {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T[] : [];
  }
  
  export function saveLocal<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  