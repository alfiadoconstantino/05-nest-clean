import type { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import type { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  // eslint-disable-next-line prettier/prettier
  constructor(private prisma: PrismaService) { }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user ? PrismaStudentMapper.toDomain(user) : null
  }
}
