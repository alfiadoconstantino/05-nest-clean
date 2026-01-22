import { left, right, type Either } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resources-not-found-error'
import { Injectable } from '@nestjs/common'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

@Injectable()
export class ReadNotificationUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) return left(new ResourceNotFoundError())

    if (notification.recipientId.toString() !== recipientId)
      return left(new NotAllowedError())

    notification.read()

    await this.notificationRepository.save(notification)

    return right({
      notification,
    })
  }
}
