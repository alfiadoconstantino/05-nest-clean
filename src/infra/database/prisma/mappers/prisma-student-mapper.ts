import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import type { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }

  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
