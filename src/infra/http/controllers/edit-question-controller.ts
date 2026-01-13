import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { UpdateQuestionUseCase } from '@/domain/forum/application/use-cases/update-question'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const validationBody = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('questions/:id')
export class EditQuestionController {
  constructor(private updateQuestionUseCase: UpdateQuestionUseCase) {} // eslint-disable-line

  @Put()
  @HttpCode(204)
  async handle(
    @Body(validationBody) body: EditQuestionBodySchema,
    @CurrentUser() user: TokenPayloadSchema,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.updateQuestionUseCase.execute({
      questionId,
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
