import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Env } from './env'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {} // eslint-disable-line

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
