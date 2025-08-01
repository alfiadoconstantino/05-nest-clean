import type { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import type { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = []

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email.toString() === email)

    return student ?? null
  }
}
