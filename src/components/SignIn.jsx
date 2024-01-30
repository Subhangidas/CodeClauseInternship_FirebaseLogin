import { useState } from 'react';
import { auth } from '../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

function SignIn(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const change = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const signin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      props.l(true);
      navigate('/');
    } catch (err) {
      handleAuthError(err);
      console.error(err.code);
    }
  };

  const handleAuthError = (err) => {
    switch (err.code) {
      case 'auth/missing-password':
        setMessage('Please enter a password');
        break;
      case 'auth/invalid-email':
        setMessage('Please enter a valid email');
        break;
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        setMessage('Invalid email or password');
        break;
      default:
        setMessage('An error occurred');
    }
  };

  return (
    <div className='signIn min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='center bg-white p-8 rounded shadow-md max-w-md w-full'>
        <h1 className='title text-2xl font-bold mb-4 text-center'>
          Sign in with your existing account
        </h1>
        <div className='credential'>
          <label className='label'>
            Email<span className='span'>*</span>
          </label>
          <input
            placeholder='Enter Email...'
            type='email'
            name='email'
            value={email}
            className='email input'
            onChange={change}
          />
          <label className='label'>
            Password<span className='span'>*</span>
          </label>
          <input
            placeholder='Enter Password...'
            type='password'
            name='password'
            value={password}
            className='email input'
            onChange={change}
          />
        </div>
        <div className='buttondiv mt-4'>
          <button onClick={signin} className='signInButton btn w-full'>
            Sign In
          </button>
        </div>
        <p className='message text-red-500 text-center mt-2'>{message}</p>
        <p className='text-center mt-4'>
          Don't have an account?{' '}
          <span
            className='signup-link text-blue-500 cursor-pointer'
            onClick={() => {
              navigate('/signup');
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
