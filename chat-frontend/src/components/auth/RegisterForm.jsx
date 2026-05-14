import React from "react";
import FormField from "../shared/FormField";
import SubmitButton from "../shared/SubmitButton";

/**
 * Register form — name + email + password with a link to switch to Login.
 */
const RegisterForm = ({ form, onChange, onSubmit, loading, onSwitchToLogin }) => (
  <form onSubmit={onSubmit} className="px-8 py-6 flex flex-col gap-4">
    <FormField
      label="Full Name"
      type="text"
      placeholder="Your name"
      value={form.name}
      onChange={(e) => onChange("name", e.target.value)}
      required
    />
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
      placeholder="your password"
      value={form.password}
      onChange={(e) => onChange("password", e.target.value)}
      required
    />
    <SubmitButton loading={loading} label="Create Account" />
    <p className="text-center text-sm text-gray-400 mt-1">
      Already have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-blue-500 hover:underline font-medium"
      >
        Sign in
      </button>
    </p>
  </form>
);

export default RegisterForm;
