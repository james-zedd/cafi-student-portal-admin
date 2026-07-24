import { ExamList } from "./exam-list";

export default function ExamsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Exams</h1>
      <div className="mt-6">
        <ExamList />
      </div>
    </div>
  );
}
