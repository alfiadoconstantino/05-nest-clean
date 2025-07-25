import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const validationBody = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) { } // eslint-disable-line

  @Post()
  async handle(
    @Body(validationBody) body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
