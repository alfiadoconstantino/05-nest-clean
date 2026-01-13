import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('questions/:questionId/answers')
export class FetchQuestionAnswerstroller {
  constructor(private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase) {} // eslint-disable-line

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      page,
      questionId,
    })

    if (result.isLeft()) throw new BadRequestException()

    return { answers: result.value.answers.map(AnswerPresenter.toHTTP) }
  }
}
