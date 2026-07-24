export type Exam = {
  _id: string;
  examId: string;
  name: {
    rankEng: string;
    belt: string;
  };
  isAdultExam: boolean;
  isDanExam: boolean;
  techniques: string[];
  __v: number;
};

export type Variant = {
  _id: string;
  techId: string;
  name: {
    english: string;
    romanji: string;
  };
  category?: string;
  heading?: string;
  order: number;
  orderVisible?: string;
};

export type Technique = {
  _id: string;
  techId: string;
  name: {
    english: string;
    romanji: string;
  };
  hasVariants: boolean;
  order: number;
  orderVisible: string;
  // Not a populated Mongoose ref on the backend, so this may be raw
  // ids/strings rather than full Variant objects.
  variants: unknown[];
};

export type ExamDetail = Omit<Exam, "techniques"> & {
  techniques: Technique[];
};
