import { ExamDetail } from "./exam-detail";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <ExamDetail id={id} />
    </div>
  );
}
