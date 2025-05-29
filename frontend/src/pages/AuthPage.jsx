import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setConfirmationEmailSent(false);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword(formData);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.auth.signUp(formData);
                if (error) throw error;
                setConfirmationEmailSent(true); // ✅ Show success message

                // ✅ Automatically switch back to login view after 4 seconds
                setTimeout(() => {
                    setConfirmationEmailSent(false);
                }, 4000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsLogin(true); // Switch to login view after signup
        }
    };
    // Handle Google login
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
        if (error) console.error("Google login error:", error.message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isLogin ? "Welcome Back" : "Create an Account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />

                    {!isLogin && (
                        <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        />
                    )}

                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
                    </button>
                    {confirmationEmailSent && (
                        <div className="text-green-600 text-sm text-center mt-2">
                            📧 Confirmation email sent to {formData.email} Please check your inbox.
                        </div>
                        )
                    }
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                {isLogin ? (
                    <>
                    Don't have an account?{" "}
                    <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => setIsLogin(false)}
                    >
                        Sign up
                    </button>
                    </>
                ) : (
                    <>
                    Already have an account?{" "}
                    <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => setIsLogin(true)}
                    >
                        Log in
                    </button>
                    </>
                )}
                </div>

                <div className="my-6 border-t text-center text-sm text-gray-400 pt-4">
                or continue with
                </div>

                <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span>Google</span>
                </button>
            </div>
        </div>
    );
}
