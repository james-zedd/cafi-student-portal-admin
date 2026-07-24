"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Exam } from "@/lib/types/exam";

function sortExams(exams: Exam[]): Exam[] {
  return [...exams].sort((a, b) => {
    if (a.isDanExam !== b.isDanExam) {
      return a.isDanExam ? 1 : -1;
    }
    const rankA = parseInt(a.examId, 10);
    const rankB = parseInt(b.examId, 10);
    return a.isDanExam ? rankA - rankB : rankB - rankA;
  });
}

export function ExamList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await api<{ data: Exam[] }>("/api/exams");
      return response.data;
    },
  });

  if (isPending) {
    return <p className="text-muted-foreground">Loading exams…</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">Failed to load exams: {error.message}</p>
    );
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">No exams found.</p>;
  }

  const sortedExams = sortExams(data);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedExams.map((exam) => (
        <Link key={exam._id} href={`/exams/${exam._id}`} className="block">
          <Card className="h-full transition-shadow hover:shadow-md hover:ring-foreground/20">
            <CardHeader>
              <CardTitle>{exam.name.belt}</CardTitle>
              <CardDescription>{exam.name.rankEng}</CardDescription>
              <CardAction>
                <Badge variant="outline">{exam.examId}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              {exam.isDanExam && <Badge variant="secondary">Dan Exam</Badge>}
              {exam.isAdultExam && (
                <Badge variant="secondary">Adult Exam</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {exam.techniques.length} technique
                {exam.techniques.length === 1 ? "" : "s"}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
