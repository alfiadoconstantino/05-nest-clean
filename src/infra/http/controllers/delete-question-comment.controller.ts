import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller('questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase) {} // eslint-disable-line

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayloadSchema,
    @Param('id') questionCommentId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionCommentUseCase.execute({
      questionCommentId,
      authorId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
