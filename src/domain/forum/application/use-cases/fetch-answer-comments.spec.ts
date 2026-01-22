import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('Should be able to fetch answer comments', async () => {
    const student = makeStudent()
    inMemoryStudentRepository.items.push(student)

    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('Should be able to fetch pagination answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      const student = makeStudent()
      inMemoryStudentRepository.items.push(student)
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
