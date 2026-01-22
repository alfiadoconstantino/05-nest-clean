import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import type { Prisma } from '@prisma/client'

type PrismaCommentWithAuthorType = Prisma.CommentGetPayload<{
  include: { author: true }
}>

export class PrismaCommentWithAuthor {
  static toDomain(raw: PrismaCommentWithAuthorType): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
