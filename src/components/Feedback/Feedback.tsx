import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* NpsSurvey                                                           */
/* ------------------------------------------------------------------ */

export interface NpsSurveyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  question?: React.ReactNode;
  value?: number | null;
  onChange?: (score: number) => void;
  lowLabel?: React.ReactNode;
  highLabel?: React.ReactNode;
}

/** 0–10 Net Promoter Score scale picker. */
export const NpsSurvey = React.forwardRef<HTMLDivElement, NpsSurveyProps>(
  function NpsSurvey(
    {
      question = "How likely are you to recommend us to a friend?",
      value = null,
      onChange,
      lowLabel = "Not likely",
      highLabel = "Very likely",
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Nps", className)} {...rest}>
        {question && <div className="msr-Nps__question">{question}</div>}
        <div className="msr-Nps__scale" role="radiogroup" aria-label="NPS score">
          {Array.from({ length: 11 }, (_, n) => {
            const tone = n <= 6 ? "detractor" : n <= 8 ? "passive" : "promoter";
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                className="msr-Nps__btn"
                data-tone={tone}
                data-selected={value === n || undefined}
                onClick={() => onChange?.(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="msr-Nps__labels">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* EmojiRating                                                         */
/* ------------------------------------------------------------------ */

export interface EmojiRatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number | null;
  onChange?: (value: number) => void;
  /** Emoji set from worst → best. */
  emojis?: string[];
  labels?: string[];
  size?: "sm" | "md" | "lg";
}

const DEFAULT_EMOJIS = ["😖", "🙁", "😐", "🙂", "😍"];
const DEFAULT_LABELS = ["Awful", "Bad", "Okay", "Good", "Great"];

/** Emoji-scale rating (1..n). */
export const EmojiRating = React.forwardRef<HTMLDivElement, EmojiRatingProps>(
  function EmojiRating(
    {
      value = null,
      onChange,
      emojis = DEFAULT_EMOJIS,
      labels = DEFAULT_LABELS,
      size = "md",
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-EmojiRating", className)}
        data-size={size}
        role="radiogroup"
        {...rest}
      >
        {emojis.map((emoji, i) => {
          const score = i + 1;
          const label = labels[i] ?? `${score}`;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={value === score}
              aria-label={label}
              title={label}
              className="msr-EmojiRating__btn"
              data-selected={value === score || undefined}
              onClick={() => onChange?.(score)}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* SurveyForm                                                          */
/* ------------------------------------------------------------------ */

export type SurveyQuestionType = "rating" | "choice" | "text";

export interface SurveyQuestion {
  id: string;
  label: React.ReactNode;
  type: SurveyQuestionType;
  /** For `choice`. */
  options?: Array<{ label: string; value: string }>;
  /** For `rating` — number of points (default 5). */
  max?: number;
  required?: boolean;
}

export interface SurveyFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange"> {
  questions: SurveyQuestion[];
  answers: Record<string, string | number>;
  onChange: (answers: Record<string, string | number>) => void;
  onSubmit?: () => void;
  submitLabel?: string;
}

/** Simple multi-question survey (rating / choice / text). */
export const SurveyForm = React.forwardRef<HTMLFormElement, SurveyFormProps>(
  function SurveyForm(
    {
      questions,
      answers,
      onChange,
      onSubmit,
      submitLabel = "Submit",
      className,
      ...rest
    },
    ref,
  ) {
    const set = (id: string, v: string | number) =>
      onChange({ ...answers, [id]: v });
    const missing = questions.some(
      (q) => q.required && (answers[q.id] == null || answers[q.id] === ""),
    );
    return (
      <form
        ref={ref}
        className={cx("msr-Survey", className)}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        {...rest}
      >
        {questions.map((q) => (
          <div key={q.id} className="msr-Survey__q">
            <div className="msr-Survey__label">
              {q.label}
              {q.required && <span className="msr-Survey__req">*</span>}
            </div>
            {q.type === "rating" && (
              <div className="msr-Survey__rating">
                {Array.from({ length: q.max ?? 5 }, (_, i) => {
                  const score = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="msr-Survey__star"
                      data-on={
                        typeof answers[q.id] === "number" &&
                        (answers[q.id] as number) >= score
                          ? true
                          : undefined
                      }
                      aria-label={`${score}`}
                      onClick={() => set(q.id, score)}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            )}
            {q.type === "choice" && (
              <div className="msr-Survey__choices">
                {q.options?.map((o) => (
                  <label key={o.value} className="msr-Survey__choice">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === o.value}
                      onChange={() => set(q.id, o.value)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            )}
            {q.type === "text" && (
              <textarea
                className="msr-Survey__text"
                rows={2}
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => set(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
        {onSubmit && (
          <button
            type="submit"
            className="msr-Survey__submit"
            disabled={missing}
          >
            {submitLabel}
          </button>
        )}
      </form>
    );
  },
);

/* ------------------------------------------------------------------ */
/* FeedbackForm                                                        */
/* ------------------------------------------------------------------ */

export interface FeedbackPayload {
  category: string;
  message: string;
  rating?: number;
}

export interface FeedbackFormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  categories?: Array<{ label: string; value: string }>;
  /** Include an emoji satisfaction rating. */
  withRating?: boolean;
  onSubmit?: (payload: FeedbackPayload) => void;
  submitLabel?: string;
  title?: React.ReactNode;
}

const DEFAULT_CATEGORIES = [
  { label: "💡 Idea", value: "idea" },
  { label: "🐛 Bug", value: "bug" },
  { label: "❤ Praise", value: "praise" },
  { label: "❓ Question", value: "question" },
];

/** Feedback widget: category, optional rating and a message. */
export const FeedbackForm = React.forwardRef<HTMLFormElement, FeedbackFormProps>(
  function FeedbackForm(
    {
      categories = DEFAULT_CATEGORIES,
      withRating,
      onSubmit,
      submitLabel = "Send feedback",
      title = "Send us feedback",
      className,
      ...rest
    },
    ref,
  ) {
    const [category, setCategory] = React.useState(categories[0]?.value ?? "");
    const [message, setMessage] = React.useState("");
    const [rating, setRating] = React.useState<number | null>(null);
    return (
      <form
        ref={ref}
        className={cx("msr-FeedbackForm", className)}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.({
            category,
            message,
            rating: rating ?? undefined,
          });
        }}
        {...rest}
      >
        {title && <div className="msr-FeedbackForm__title">{title}</div>}
        <div className="msr-FeedbackForm__cats">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              className="msr-FeedbackForm__cat"
              data-active={category === c.value || undefined}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        {withRating && (
          <EmojiRating value={rating} onChange={setRating} size="sm" />
        )}
        <textarea
          className="msr-FeedbackForm__message"
          rows={3}
          placeholder="Tell us more…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="msr-FeedbackForm__submit"
          disabled={!message.trim()}
        >
          {submitLabel}
        </button>
      </form>
    );
  },
);
