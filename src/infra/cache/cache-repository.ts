export abstract class CacheRepository {
  abstract set(keyL: string, value: string): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
}
