"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExamDetail as ExamDetailType } from "@/lib/types/exam";

function variantLabel(variant: unknown): string {
  if (typeof variant === "string") {
    return variant;
  }
  if (
    variant &&
    typeof variant === "object" &&
    "name" in variant &&
    variant.name &&
    typeof variant.name === "object" &&
    "english" in variant.name &&
    typeof variant.name.english === "string"
  ) {
    return variant.name.english;
  }
  return JSON.stringify(variant);
}

export function ExamDetail({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["exams", id],
    queryFn: async () => {
      // The backend's GET /api/exams/:id currently responds with a
      // one-item array (Exam.find() rather than findById()), so unwrap it.
      const response = await api<{ data: ExamDetailType[] }>(
        `/api/exams/${id}`,
      );
      return response.data[0];
    },
  });

  const techniques = data
    ? [...data.techniques].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="grid gap-6">
      <Link
        href="/exams"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Exams
      </Link>

      {isPending && <p className="text-muted-foreground">Loading exam…</p>}

      {isError && (
        <p className="text-destructive">Failed to load exam: {error.message}</p>
      )}

      {!isPending && !isError && !data && (
        <p className="text-destructive">Exam not found.</p>
      )}

      {data && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{data.name.belt}</h1>
              <p className="text-muted-foreground">{data.name.rankEng}</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge variant="outline">{data.examId}</Badge>
              {data.isDanExam && <Badge variant="secondary">Dan Exam</Badge>}
              {data.isAdultExam && (
                <Badge variant="secondary">Adult Exam</Badge>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">
              Techniques ({techniques.length})
            </h2>

            {techniques.length === 0 ? (
              <p className="text-muted-foreground">
                No techniques on this exam.
              </p>
            ) : (
              <div className="grid gap-4">
                {techniques.map((technique) => (
                  <Card key={technique._id}>
                    <CardHeader>
                      <CardTitle>{technique.name.english}</CardTitle>
                      <CardDescription>
                        {technique.name.romanji}
                      </CardDescription>
                    </CardHeader>
                    {technique.hasVariants &&
                      technique.variants.length > 0 && (
                        <CardContent>
                          <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {technique.variants.map((variant, index) => (
                              <li
                                key={index}
                                className="rounded-md bg-muted/50 px-3 py-2 text-sm"
                              >
                                {variantLabel(variant)}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
