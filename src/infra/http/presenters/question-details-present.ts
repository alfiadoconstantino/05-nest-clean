import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      title: questionDetails.titile,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      attachments: questionDetails.attachments.map((attachment) => {
        return {
          id: attachment.id.toString(),
          title: attachment.title,
          url: attachment.url,
        }
      }), // criar um presenter
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
