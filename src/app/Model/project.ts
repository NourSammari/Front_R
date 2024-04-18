export interface ProjectIn {
    code: string;
    projectname: string;
    description: string;
    specialty: string;
    technologies: string[];
    exp_date: string; // Date string in "YYYY-MM-DD" format
    companyID: string; // UUID string
  }

  export interface ProjectTable {
    id: string; // UUID string
    code: string;
    projectname: string;
    technologies: string[];
    companyID: string; // UUID string
    expdate: string; // Date string in "YYYY-MM-DD" format
  }

  export interface ProjectList {
    id: string; // UUID string
    projectname: string;
    code: string;
  }

  export interface ProjectsCount {
    count: number;
  }

  export interface ProjectsDetails {
    id: string; // UUID string
    code: string;
    projectname: string;
    technologies: string[];
    companyID: string; // UUID string
    expdate: string; // Date string in "YYYY-MM-DD" format
  }

  export interface CodeProject {
    code: string;
  }
