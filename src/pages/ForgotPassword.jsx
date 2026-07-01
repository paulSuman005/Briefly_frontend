import { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPassword } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await dispatch(forgetPassword({email})).unwrap();
      console.log("Reset email sent to", email);
      setSent(true);
    } catch(err) {
      console.log(err);
      toast.error("Failed to send reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 border rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Forget your password</h2>
        <p className="text-sm text-base-content/60 text-center mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered bg-base-200 w-full rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-primary text-2xl">✉️</div>
            <p className="text-sm">
              If an account exists for <strong>{email}</strong>, you’ll receive a password reset link shortly.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/signin" className="text-sm text-primary hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;