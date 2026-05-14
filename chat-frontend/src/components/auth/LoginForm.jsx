import React from "react";
import FormField from "../shared/FormField";
import SubmitButton from "../shared/SubmitButton";

/**
 * Login form — email + password fields with a link to switch to Register.
 */
const LoginForm = ({ form, onChange, onSubmit, loading, onSwitchToRegister }) => (
  <form onSubmit={onSubmit} className="px-8 py-6 flex flex-col gap-4">
    <FormField
      label="Email"
      type="email"
      placeholder="you@example.com"
      value={form.email}
      onChange={(e) => onChange("email", e.target.value)}
      required
    />
    <FormField
      label="Password"
      type="password"
      placeholder="••••••••"
      value={form.password}
      onChange={(e) => onChange("password", e.target.value)}
      required
    />
    <SubmitButton loading={loading} label="Sign In" />
    <p className="text-center text-sm text-gray-400 mt-1">
      Don't have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-blue-500 hover:underline font-medium"
      >
        Register
      </button>
    </p>
  </form>
);

export default LoginForm;
