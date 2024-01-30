import {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
} from '../config/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import './SignUp.css';

function SignUp(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const submit = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (auth?.currentUser) {
        props.l(true);
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          if (auth?.currentUser) {
            props.l(true);
            navigate('/');
          }
        } catch (err) {
          handleAuthError(err);
        }
      } else {
        handleAuthError(err);
      }
    }
  };

  const handleAuthError = (err) => {
    console.error(err.code);
    if (err.code === 'auth/missing-password') {
      setMessage('*Please enter a password');
    } else if (err.code === 'auth/invalid-email') {
      setMessage('*Please enter a valid email');
    }
  };

  const socialSignIn = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      if (auth?.currentUser) {
        props.l(true);
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        setMessage('Login with the same method you used earlier');
      } else {
        console.error(err.code);
      }
    }
  };

  return (
    <div className='signUp flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='card bg-white p-8 rounded shadow-md max-w-md w-full'>
        <h1 className='new text-5xl font-bold mb-4 text-center'>
          Login in to continue
        </h1>
        <div className='buttondiv mb-4'>
          <button
            onClick={() => socialSignIn(googleProvider)}
            className='social-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mb-2'
          >
            <GoogleIcon className='icon' fontSize='small' /> Login with Google
          </button>
          <button
            onClick={() => socialSignIn(githubProvider)}
            className='social-btn bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full w-full mb-2'
          >
            <GitHubIcon className='icon' fontSize='small' /> Login with Github
          </button>
          <button
            onClick={() => socialSignIn(facebookProvider)}
            className='social-btn bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full w-full mb-2'
          >
            <FacebookIcon className='icon' fontSize='small' /> Login with
            Facebook
          </button>
          <button
            onClick={() => {
              navigate('/phone');
            }}
            className='social-btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full mb-2'
          >
            <PhoneIcon className='icon' fontSize='small' /> Sign In with Phone
            Number
          </button>
        </div>
        <h2 className='or text-center mb-4'>
          <span className='line mx-2'></span> Or{' '}
          <span className='line mx-2'></span>
        </h2>
        <h2 className='new text-center mb-4'>Create a new account</h2>
        <div className='credential'>
          <label className='label'>
            Email<span className='span'>*</span>
          </label>
          <input
            placeholder='Enter your email...'
            value={email}
            name='email'
            className='email input'
            onChange={change}
            type='email'
            required
          />
          <label className='label'>
            Password<span className='span'>*</span>
          </label>
          <input
            placeholder='Enter your password...'
            value={password}
            name='password'
            className='password input'
            onChange={change}
            type='password'
            required
          />
          <p className='already text-center mt-4'>
            Already have an account?{' '}
            <span
              className='signin text-blue-500 cursor-pointer'
              onClick={() => {
                navigate('/signin');
              }}
            >
              Sign in
            </span>
          </p>
        </div>
        <div className='buttondiv mt-4'>
          <button onClick={submit} className='signUpButton btn w-full'>
            Sign Up
          </button>
        </div>
        <p className='message text-red-500 text-center'>{message}</p>
      </div>
    </div>
  );
}

export default SignUp;
