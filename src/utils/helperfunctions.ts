export async function isPdfBySignature(url: string): Promise<boolean> {
    const res = await fetch(url, { method: 'GET' });
    const buffer = await res.arrayBuffer();
    const header = new TextDecoder().decode(buffer.slice(0, 5));
    return header === '%PDF-';
}

export const convertDate = (date: string) => {
    return new Date(date).toLocaleDateString();
}

export function safeParse<T>(str: string | null | undefined, fallback: T): T {
    if (!str) return fallback;
    try {
        return JSON.parse(str) as T;
    } catch {
        return fallback;
    }
}