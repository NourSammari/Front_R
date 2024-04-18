 export interface TestsIn {
    title: string;
    specialty: string;
    technologies: string[];
  }

  export interface AssignTestIn {
    testID: string;
  }

  export interface CandidatAnswer {
    questionID: string;
    question: string;
    correctAnswer: string;
    candidatAnswer: string;
  }

  export interface CandidatAnswerIn {
    candidatAnswer: string;
  }

  export interface TestsQuestionsIn {
    questionID: string;
    question: string;
    correctAnswer: string;
    options: string[];
    associatedTechnology: string;
    candidatID: string;
  }

  export interface TestsTable {
    id: string;
    title: string;
    specialty: string;
    technologies: string[];
    createdAt: string;
  }

  export interface TestsQuestionsTable {
    id: string;
    questionID: string;
    question: string;
    correctAnswer: string;
    options: string[];
    associatedTechnology: string;
    candidatID: string;
  }

  export interface ScoresPagination {
    items: ScorsTable[];
    page: number;
    limit: number;
    totalCount: number;
  }

  export interface QuestionsPagination {
    items: QuestionsTable[];
    page: number;
    limit: number;
    totalCount: number;
  }

  export interface QuestionsTable {
    questionID: string;
    question: string;
    options: string[];
    associatedTechnology: string;
    createdAt: string;
  }

  export interface ScorsTable {
    idTest: string;
    idCandidat: string;
    title: string;
    firstName: string;
    lastName: string;
    score: number;
  }

  export interface TestsCandidatsList {
    id: string;
    candidats: string[];
  }

  export interface TestsList {
    id: string;
    specialty: string;
    title: string;
    technologies: string[];
  }

  export interface TestsCount {
    count: number;
  }

  export interface TestsDetails {
    id: string;
    specialty: string;
    technologies: string[];
    companyID: string;
    createdAt: string;
  }
