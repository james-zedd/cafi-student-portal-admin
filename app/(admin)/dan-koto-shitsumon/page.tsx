import { QuestionList } from "./question-list";

export default function DanKotoShitsumonPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dan Koto Shitsumon</h1>
      <div className="mt-6">
        <QuestionList />
      </div>
    </div>
  );
}
