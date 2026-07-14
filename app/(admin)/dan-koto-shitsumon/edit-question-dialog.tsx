"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { KotoShitsumonItem } from "@/lib/types/koto-shitsumon";

const REQUIRED_ANSWER_COUNT = 4;

type KotoShitsumonPayload = {
  question: string;
  categories: string[];
  correct_answer: string;
  explanation: string;
  answers: string[];
};

type EditQuestionDialogProps = {
  item: KotoShitsumonItem | null;
  onClose: () => void;
};

export function EditQuestionDialog({ item, onClose }: EditQuestionDialogProps) {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {item !== null && (
          <EditQuestionForm key={item.id} item={item} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditQuestionForm({
  item,
  onClose,
}: {
  item: KotoShitsumonItem;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState(item.question);
  const [categories, setCategories] = useState(item.categories);
  const [explanation, setExplanation] = useState(item.explanation);
  const [answers, setAnswers] = useState(item.answers);
  // The mobile app matches correct_answer to an answer by exact string
  // comparison, so the value must always be one of the current answers.
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(
    item.answers.includes(item.correct_answer) ? item.correct_answer : null,
  );

  const hasRequiredAnswers = answers.length === REQUIRED_ANSWER_COUNT;
  const canSave = hasRequiredAnswers && correctAnswer !== null;

  const mutation = useMutation({
    mutationFn: (payload: KotoShitsumonPayload) =>
      api(`/api/kotoshitsumon/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["kotoshitsumon"] });
      toast.success("Question updated");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to save question: ${error.message}`);
    },
  });

  function handleAnswersChange(next: string[]) {
    setAnswers(next);
    if (correctAnswer !== null && !next.includes(correctAnswer)) {
      setCorrectAnswer(null);
    }
  }

  function handleSave() {
    if (correctAnswer === null) {
      return;
    }
    mutation.mutate({
      question,
      categories,
      correct_answer: correctAnswer,
      explanation,
      answers,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit question</DialogTitle>
        <DialogDescription>
          Update the question details, then save your changes.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-question">Question</Label>
          <Textarea
            id="edit-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-categories">Categories</Label>
          <TagInput
            id="edit-categories"
            tags={categories}
            onTagsChange={setCategories}
            placeholder="Add a category…"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-answers">Answers</Label>
          <TagInput
            id="edit-answers"
            tags={answers}
            onTagsChange={handleAnswersChange}
            placeholder="Add an answer…"
            maxTags={REQUIRED_ANSWER_COUNT}
          />
          <p
            className={
              hasRequiredAnswers
                ? "text-xs text-muted-foreground"
                : "text-xs text-destructive"
            }
          >
            {answers.length}/{REQUIRED_ANSWER_COUNT} answers — exactly{" "}
            {REQUIRED_ANSWER_COUNT} are required.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-correct-answer">Correct Answer</Label>
          <Select
            value={correctAnswer}
            onValueChange={(value) => setCorrectAnswer(value)}
          >
            <SelectTrigger
              id="edit-correct-answer"
              className="w-full"
              disabled={answers.length === 0}
            >
              <SelectValue placeholder="Select the correct answer…" />
            </SelectTrigger>
            <SelectContent>
              {answers.map((answer) => (
                <SelectItem key={answer} value={answer}>
                  {answer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {correctAnswer === null && (
            <p className="text-xs text-destructive">
              Choose which of the answers is correct.
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-explanation">Explanation</Label>
          <Textarea
            id="edit-explanation"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave || mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </>
  );
}

function TagInput({
  id,
  tags,
  onTagsChange,
  placeholder,
  maxTags,
}: {
  id: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}) {
  const [draft, setDraft] = useState("");
  const atLimit = maxTags !== undefined && tags.length >= maxTags;

  function addDraft() {
    const value = draft.trim();
    if (!value || atLimit || tags.includes(value)) {
      return;
    }
    onTagsChange([...tags, value]);
    setDraft("");
  }

  function removeTag(index: number) {
    onTagsChange(tags.filter((_, tagIndex) => tagIndex !== index));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraft();
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      {tags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
          <span className="max-w-48 truncate">{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="rounded-full hover:text-destructive focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={() => removeTag(index)}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        disabled={atLimit}
        placeholder={atLimit ? undefined : placeholder}
        aria-label={placeholder}
        className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addDraft}
      />
    </div>
  );
}
