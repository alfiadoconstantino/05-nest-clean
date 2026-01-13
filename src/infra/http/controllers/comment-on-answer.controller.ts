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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const commentonAnswerBodySchema = z.object({
  content: z.string(),
})

const validationBody = new ZodValidationPipe(commentonAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentonAnswerBodySchema>

@Controller('answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentonAnswer: CommentOnAnswerUseCase) {} // eslint-disable-line

  @Post()
  async handle(
    @Body(validationBody) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentonAnswer.execute({
      answerId,
      content,
      authorId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
