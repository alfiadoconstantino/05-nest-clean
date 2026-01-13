import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const commentonQuestionBodySchema = z.object({
  content: z.string(),
})

const validationBody = new ZodValidationPipe(commentonQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentonQuestionBodySchema>

@Controller('questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentonQuestion: CommentOnQuestionUseCase) {} // eslint-disable-line

  @Post()
  async handle(
    @Body(validationBody) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentonQuestion.execute({
      questionId,
      content,
      authorId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
