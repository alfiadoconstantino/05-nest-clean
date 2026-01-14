import { left, right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentRepository } from '../repositories/attachment-repository'
import type { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  filename: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader,
    // eslint-disable-next-line prettier/prettier
  ) {}

  async execute({
    filename,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      filename,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: filename,
      url,
    })

    await this.attachmentRepository.create(attachment)

    return right({ attachment })
  }
}
