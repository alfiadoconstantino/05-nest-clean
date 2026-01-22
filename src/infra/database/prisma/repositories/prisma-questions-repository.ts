import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async findBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    return question ? PrismaQuestionDetailsMapper.toDomain(question) : null
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }

  async update(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }
}
