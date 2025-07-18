import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { TokenPayloadSchema } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as TokenPayloadSchema
  },
)
