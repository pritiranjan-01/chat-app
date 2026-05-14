import React from "react";

/**
 * Reusable labeled input field used across auth, profile, and settings forms.
 */
const FormField = ({ label, type = "text", placeholder, value, onChange, readOnly = false, required = false, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    {children ?? (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        className={`w-full px-4 py-2.5 rounded-xl border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition ${
          readOnly
            ? "bg-white/3 border-white/5 text-gray-500 cursor-not-allowed"
            : "bg-white/5 border-white/10"
        }`}
      />
    )}
  </div>
);

export default FormField;
