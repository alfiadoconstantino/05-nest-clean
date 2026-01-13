import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { TokenPayloadSchema } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

@Controller('answers/:answerId/choose-as-best')
export class ChooseBestQuestionAnswerController {
  constructor(private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase) {} // eslint-disable-line

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayloadSchema,
    @Param('answerId') answerId: string,
  ) {
    const userId = user.sub

    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      answerId,
      authorQuestionId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
