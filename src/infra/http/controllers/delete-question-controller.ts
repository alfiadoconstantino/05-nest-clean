import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {} // eslint-disable-line

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayloadSchema,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionUseCase.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
