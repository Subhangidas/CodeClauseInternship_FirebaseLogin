import { auth, phoneProvider } from '../config/firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useState } from 'react';
import './Phone.css';
import { useNavigate } from 'react-router-dom';

function Phone(props) {
  const [country, setCountry] = useState('91');
  const [phone, setPhone] = useState('');
  const [generate, setGenerate] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(true); // New state
  const navigate = useNavigate();

  const captchaVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            signin();
          },
        }
      );
    }
  };

  const genOtp = async () => {
    captchaVerify();
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = `+${country}${phone}`;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setGenerate(true);
      setOtpButtonDisabled(false); // Enable the "Verify OTP" button
      window.confirmationResult = confirmationResult;
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await window.confirmationResult.confirm(otp);
      props.l(true);
      navigate('/');
    } catch (err) {
      setMessage('Invalid OTP');
      console.error(err.code);
    }
  };

  const change = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setCountry(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else {
      setOtp(value);
    }

    // Disable the "Verify OTP" button if OTP is empty
    setOtpButtonDisabled(value === '');
  };

  return (
    <div className='Phone min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='main bg-white p-8 rounded-md shadow-md max-w-md w-full'>
        <h1 className='heading text-3xl font-bold mb-6 text-center'>
          Sign in with Phone Number
        </h1>
        {!generate && (
          <>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Country Code
            </label>
            <input
              type='number'
              name='country'
              placeholder='Enter country code...'
              className='input'
              value={country}
              onChange={change}
            />
          </>
        )}
        {!generate && (
          <>
            <label className='block text-gray-700 text-sm font-bold mb-2 mt-4'>
              Phone Number
            </label>
            <input
              type='number'
              name='phone'
              placeholder='Enter phone number...'
              className='input'
              value={phone}
              onChange={change}
            />
          </>
        )}
        {generate && (
          <>
            <label className='block text-gray-700 text-sm font-bold mb-2 mt-4'>
              OTP (One Time Password)
            </label>
            <input
              type='number'
              name='otp'
              placeholder='Enter OTP...'
              className='input'
              value={otp}
              onChange={change}
            />
          </>
        )}
        <div id='recaptcha-container' className='mt-6'></div>
        <div className='buttondiv mt-8'>
          {!generate && (
            <button
              onClick={genOtp}
              className='button w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Generate OTP
            </button>
          )}
          {generate && (
            <button
              onClick={verifyOtp}
              disabled={otpButtonDisabled} // Disable the button if OTP is empty
              className={`button w-full ${
                otpButtonDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-700'
              } text-white font-bold py-2 px-4 rounded`}
            >
              Verify OTP
            </button>
          )}
        </div>
        <p className='message text-red-500 mt-2'>{message}</p>
      </div>
    </div>
  );
}

export default Phone;
