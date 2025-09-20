import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const VerifyEmail = () => {
  const router = useRouter();
  const [count, setCount] = useState(5);
  const [token, setToken] = useState(router.query.token);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (success !== '') {
      const interval = setInterval(() => {
        setCount((currentCount) => currentCount - 1);
      }, 1000);
      if (count === 0) router.push('/auth');
      return () => clearInterval(interval);
    }
  }, [count, success]);

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token);
    }
  });

  const verify = useCallback(async () => {
    try {
      if (token !== undefined) {
        const res = await axios.post(`/api/email/verify/${token}`, {
          token,
        });
        setError('');
        setSuccess(res.data.success);
      }
    } catch (error) {
      setSuccess('');
      setError(error.response.data.error);
    }
  }, [token]);

  useEffect(() => {
    verify();
  }, [token]);

  return (
    <div className="relative h-full w-full">
      <div className="bg-black w-full h-full bg-opacity-50">
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
          <h1 className="text-red-500 text-4xl">{error !== '' && 'Error'}</h1>
          <h1 className="text-white text-4xl">
            {success !== '' ? success : error}
          </h1>
          <h2 className="text-white text-4xl">
            {success !== '' &&
              `You are being redirected to login page in ${count} seconds...`}
          </h2>
          {error !== '' && (
            <button
              onClick={() => router.push('/auth')}
              className="bg-cyan-600 py-3 text-white rounded-md w-64 mt-2 hover:bg-cyan-700 transition"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
