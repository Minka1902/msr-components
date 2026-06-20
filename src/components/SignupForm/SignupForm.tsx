import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Input } from "../Input/Input";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export interface SignupValues {
  name: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export interface SignupFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit?: (values: SignupValues) => void;
  loading?: boolean;
  error?: React.ReactNode;
  submitLabel?: string;
  /** Require checking a terms box before submit. */
  requireTerms?: boolean;
  /** Terms label/links node. */
  termsLabel?: React.ReactNode;
  /** Slot for social auth buttons. */
  social?: React.ReactNode;
}

/** Account creation form with a password strength meter. */
export const SignupForm = React.forwardRef<HTMLFormElement, SignupFormProps>(function SignupForm(
  {
    onSubmit,
    loading,
    error,
    submitLabel = "Create account",
    requireTerms = true,
    termsLabel = "I agree to the Terms and Privacy Policy",
    social,
    className,
    ...rest
  },
  ref,
) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [accepted, setAccepted] = React.useState(false);

  const blocked = requireTerms && !accepted;

  return (
    <form
      ref={ref}
      className={cx("msr-LoginForm", "msr-SignupForm", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (blocked) return;
        onSubmit?.({ name, email, password, acceptedTerms: accepted });
      }}
      {...rest}
    >
      {social && (
        <>
          <div className="msr-LoginForm__social">{social}</div>
          <div className="msr-LoginForm__divider"><span>or</span></div>
        </>
      )}

      {error && (
        <div className="msr-LoginForm__error" role="alert">
          <Icon name="alert" size={16} /> {error}
        </div>
      )}

      <label className="msr-LoginForm__field">
        <span className="msr-LoginForm__label">Name</span>
        <Input value={name} autoComplete="name" placeholder="Jane Doe" required onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="msr-LoginForm__field">
        <span className="msr-LoginForm__label">Email</span>
        <Input
          type="email"
          value={email}
          autoComplete="email"
          placeholder="you@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="msr-LoginForm__field">
        <span className="msr-LoginForm__label">Password</span>
        <PasswordInput
          value={password}
          autoComplete="new-password"
          placeholder="Create a password"
          showStrength
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {requireTerms && (
        <label className="msr-LoginForm__remember">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>{termsLabel}</span>
        </label>
      )}

      <button
        type="submit"
        className="msr-LoginForm__submit"
        disabled={loading || blocked}
        data-loading={loading || undefined}
      >
        {loading ? <Icon name="spinner" size={16} className="msr-LoginForm__spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
});
