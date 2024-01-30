import { auth } from '../config/firebase-config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Home(props) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      props.l(false);
      navigate('/signup');
    } catch (err) {
      console.error(err.code);
    }
  };

  return (
    <div className='bg-blue-500 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded shadow-md max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-4 text-center text-blue-500'>
          Welcome to Firebase Authenticated App
        </h1>
        <div className='text-center'>
          <button
            onClick={logout}
            className='bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300'
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
