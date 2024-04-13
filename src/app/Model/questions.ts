
export interface Question {
    id?: string;
    question?: string;
    correctAnswer?: string;
    options?: string[];
    associatedTechnology?: string;
    createdAt?: Date;
  }

  export interface QuestionsPagination {
    items?: Question[];
    page?: number;
    limit?: number;
    totalCount?: number;
  }
