import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import type { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }

  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        title: raw.title,
        content: raw.title,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
