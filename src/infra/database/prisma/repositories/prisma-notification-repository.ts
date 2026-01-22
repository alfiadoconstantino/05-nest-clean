import type { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}
  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    return notification ? PrismaNotificationMapper.toDomain(notification) : null
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
