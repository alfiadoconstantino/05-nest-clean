/**
 * Make some property optional on type
 *
 * @example
 * ```
 * type Post {
 *  id: string
 *  name: string
 *  email: string
 * }
 *
 * Optional<Post, 'id' / 'email'>
 * ```
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
