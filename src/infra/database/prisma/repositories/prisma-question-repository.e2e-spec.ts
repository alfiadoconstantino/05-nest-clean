import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Prisma questions repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionRepository: QuestionRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionRepository = moduleRef.get(QuestionRepository)

    await app.init()
  })

  it('Should cache questions details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionRepository.findBySlugWithDetails(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(JSON.parse(cached!)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('Should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    // await cacheRepository.set(
    //   `question:${slug}:details`,
    //   JSON.stringify({ empty: true }),
    // )

    let cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()

    await questionRepository.findBySlugWithDetails(slug)

    cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).not.toBeNull()

    const questionDetails = await questionRepository.findBySlugWithDetails(slug)

    expect(JSON.parse(cached!)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('Should reset cache on save', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionRepository.update(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
