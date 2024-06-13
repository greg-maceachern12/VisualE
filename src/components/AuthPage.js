import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const supabaseUrl = 'https://zapxsrrbfywsypmqiqab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcHhzcnJiZnl3c3lwbXFpcWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxOTU4NDAsImV4cCI6MjAzMzc3MTg0MH0.gInUgEZwD2GpnVXx2fh25Gk3ggoPVeIwuwqLHk1DF0s';

const supabase = createClient(supabaseUrl, supabaseKey);

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign-in error:', error);
        if (error.status === 400) {
          console.log('User does not exist. Showing sign-up form.');
          setIsNewUser(true);
        } else {
          setError('An error occurred during sign-in. Please try again.');
        }
      } else {
        console.log('Sign-in successful. Redirecting to home page.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      setError('An error occurred during sign-in. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to sign up...');
      const { user, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        console.error('Sign-up error:', signUpError);
        setError('An error occurred during sign-up. Please try again.');
      } else {
        console.log('Sign-up successful. Updating user profile.');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ name })
          .eq('id', user.id);
        if (updateError) {
          console.error('Profile update error:', updateError);
          setError('An error occurred while updating the profile. Please try again.');
        } else {
          console.log('Profile updated. Redirecting to home page.');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('An error occurred during sign-up. Please try again.');
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      console.log(`Attempting to sign in with ${provider}...`);
      const { user, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        console.error('OAuth sign-in error:', error);
        setError('An error occurred during OAuth sign-in. Please try again.');
      } else {
        console.log('OAuth sign-in successful. Redirecting to home page.');
        // navigate('/');
      }
    } catch (error) {
      console.error('Error during OAuth sign-in:', error);
      setError('An error occurred during OAuth sign-in. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In / Sign Up</h2>
        {error && <p className="error">{error}</p>}
        {!isNewUser ? (
          <form onSubmit={handleSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or Phone" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign In / Sign Up</button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <button type="submit">Sign Up</button>
          </form>
        )}
        <div className="oauth-buttons">
          <button onClick={() => handleOAuthSignIn('google')}>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;