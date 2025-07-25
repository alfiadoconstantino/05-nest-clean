import type { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import type { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashCompare {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
}
