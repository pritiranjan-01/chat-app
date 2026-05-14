import React from "react";

/**
 * Primary submit button shared across all modal forms.
 */
const SubmitButton = ({ loading, label, loadingLabel = "Please wait…" }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold transition flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        {loadingLabel}
      </>
    ) : (
      label
    )}
  </button>
);

export default SubmitButton;
