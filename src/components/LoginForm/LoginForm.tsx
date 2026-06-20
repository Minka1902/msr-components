import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Input } from "../Input/Input";
import { PasswordInput } from "../PasswordInput/PasswordInput";

export interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit?: (values: LoginValues) => void;
  loading?: boolean;
  error?: React.ReactNode;
  defaultEmail?: string;
  showRemember?: boolean;
  submitLabel?: string;
  /** Forgot-password affordance. */
  onForgotPassword?: () => void;
  /** Slot for social auth buttons (rendered above a divider). */
  social?: React.ReactNode;
}

/** Email + password sign-in form built on `Input` / `PasswordInput`. */
export const LoginForm = React.forwardRef<HTMLFormElement, LoginFormProps>(function LoginForm(
  {
    onSubmit,
    loading,
    error,
    defaultEmail = "",
    showRemember = true,
    submitLabel = "Sign in",
    onForgotPassword,
    social,
    className,
    ...rest
  },
  ref,
) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  return (
    <form
      ref={ref}
      className={cx("msr-LoginForm", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({ email, password, remember });
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
          autoComplete="current-password"
          placeholder="••••••••"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <div className="msr-LoginForm__row">
        {showRemember && (
          <label className="msr-LoginForm__remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Remember me</span>
          </label>
        )}
        {onForgotPassword && (
          <button type="button" className="msr-LoginForm__link" onClick={onForgotPassword}>
            Forgot password?
          </button>
        )}
      </div>

      <button type="submit" className="msr-LoginForm__submit" disabled={loading} data-loading={loading || undefined}>
        {loading ? <Icon name="spinner" size={16} className="msr-LoginForm__spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
});
