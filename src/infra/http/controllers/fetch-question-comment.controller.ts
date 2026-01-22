import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('questions/:questionId/comments')
export class FetchQuestionCommentController {
  constructor(private fetchQuestionCommentUseCase: FetchQuestionCommentsUseCase) {} // eslint-disable-line

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionCommentUseCase.execute({
      page,
      questionId,
    })

    if (result.isLeft()) throw new BadRequestException()

    return {
      comments: result.value.questionComments.map(
        CommentWithAuthorPresenter.toHTTP,
      ),
    }
  }
}
