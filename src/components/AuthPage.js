import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/AuthPage.scss";

const supabaseUrl = "https://zapxsrrbfywsypmqiqab.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcHhzcnJiZnl3c3lwbXFpcWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxOTU4NDAsImV4cCI6MjAzMzc3MTg0MH0.gInUgEZwD2GpnVXx2fh25Gk3ggoPVeIwuwqLHk1DF0s";

const supabase = createClient(supabaseUrl, supabaseKey);

function AuthPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSignInWithMagicLink = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'https://pro.visuai.io',
        },
      });
      if (error) {
        console.error("Magic Link sign-in error:", error);
        setError("An error occurred during Magic Link sign-in. Please try again.");
      } else {
        console.log("Magic Link sent. Please check your email.");
        setMagicLinkSent(true);
        setError(null);
      }
    } catch (error) {
      console.error("Error during Magic Link sign-in:", error);
      setError("An error occurred during Magic Link sign-in. Please try again.");
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      console.log(`Attempting to sign in with ${provider}...`);
      const { user, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        console.error("OAuth sign-in error:", error);
        setError("An error occurred during OAuth sign-in. Please try again.");
      } else {
        console.log("OAuth sign-in successful. Redirecting to home page.");
        console.log(user);
        // Additional logic for successful OAuth sign-in can be added here
      }
    } catch (error) {
      console.error("Error during OAuth sign-in:", error);
      setError("An error occurred during OAuth sign-in. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In / Sign Up</h2>
        {!magicLinkSent ? (
          <>
            <h2>Sign In with Magic Link</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSignInWithMagicLink}>Send Magic Link</button>
          </>
        ) : (
          <p>Magic link sent! Please check your inbox.</p>
        )}
        {error && <p className="error">{error}</p>}
        <div className="oauth-buttons">
          <button onClick={() => handleOAuthSignIn("google")}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;