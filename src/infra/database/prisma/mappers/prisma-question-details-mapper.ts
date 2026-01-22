import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import type { Prisma } from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetailsType = Prisma.QuestionGetPayload<{
  include: { author: true; attachments: true }
}>

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetailsType): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      titile: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
