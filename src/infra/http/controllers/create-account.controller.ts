import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public.decorator'

const createAccountBodySchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .required()

type CreateAccountBodyDTO = z.infer<typeof createAccountBodySchema>

@Controller('accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) { } // eslint-disable-line 

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodyDTO) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
