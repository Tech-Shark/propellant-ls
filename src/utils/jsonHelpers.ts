/**
 * Safely parses a JSON string, returning a default value if parsing fails
 * @param jsonString The JSON string to parse
 * @param defaultValue Value to return if parsing fails (default is an empty array)
 * @returns The parsed object or the default value
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON string:', error);
    return defaultValue;
  }
}
