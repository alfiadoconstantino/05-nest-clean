import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: CommentOnAnswerUseCase

describe('Create Comment On Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository,
    )
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentRepository,
    )
  })

  it('Should be able to comment on answer', async () => {
    const answer = makeAnswer({ questionId: new UniqueEntityId('1') })

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: '1',
      answerId: answer.id.toString(),
      content: 'Conteudo do novo comentario da resposta',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      'Conteudo do novo comentario da resposta',
    )
  })
})
