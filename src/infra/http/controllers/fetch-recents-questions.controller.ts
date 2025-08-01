import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('questions')
export class FetchRecentsquestionstroller {
  constructor(private fetchRecentsQuestionsUseCase: FetchRecentQuestionsUseCase) { } // eslint-disable-line

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchRecentsQuestionsUseCase.execute({
      page,
    })

    if (result.isLeft()) throw new BadRequestException()

    return { questions: result.value.questions.map(QuestionPresenter.toHTTP) }
  }
}
