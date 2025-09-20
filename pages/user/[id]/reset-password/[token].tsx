import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Input from '@/components/Input';
import Loader from '@/components/Loader';

const VerifyEmail = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [count, setCount] = useState(5);
  const [token, setToken] = useState(router.query.token);
  const [id, setId] = useState(router.query.id);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [invalid, setInvalid] = useState('');
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
      setId(router.query.id);
    }
  });

  const reset = useCallback(async () => {
    try {
      if (token !== undefined) {
        const res = await axios.post(`/api/password/reset/${token}`, {
          id,
          token,
          password,
          confirmPassword,
        });
        setSuccess('');
        setError('');
        setInvalid('');
        setErrorForm('');
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          setSuccess(res.data.success);
          console.log(res);
        }, 2000);
      }
    } catch (error) {
      setSuccess('');
      error.response.data.invalid && setInvalid(error.response.data.invalid);
      error.response.data.error && setError(error.response.data.error);
      error.response.data.errorForm && setErrorForm(error.response.data.errorForm);
    }
  }, [id, token, password, confirmPassword]);

  useEffect(() => {
    reset();
  }, [token]);

  return (
    <div className="relative h-full w-full">
      <div className="bg-black w-full h-full bg-opacity-50">
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
          {invalid === '' && (
            <div className="bg-white px-16 py-16 self-center justify-center mt-16 mb-10 ml-2 mr-2 lg:w-4/5 md:w-3/5 lg:max-w-lg rounded-md w-full">
              <div className="flex flex-col gap-4 items-center justify-center h-auto">
                <h2 className="text-black text-4xl mb-8 font-semibold">
                  Reset your password
                </h2>
                <Input
                  label="New password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  value={password}
                />

                <Input
                  label="Confirm password"
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                />
                {errorForm !== '' && (
                  <p className="bg-red-600 bg-opacity-80 text-white h-auto p-2 font-semibold text-center">
                    {errorForm}
                  </p>
                )}
                {success !== '' && (
                  <p className="bg-green-600 bg-opacity-80 text-white h-auto p-2 font-semibold text-center">
                    {success}
                  </p>
                )}
                {loader && <Loader></Loader>}
                <button
                  onClick={reset}
                  className="bg-cyan-600 py-3 text-white rounded-md w-full mt-3 hover:bg-cyan-700 transition"
                >
                  Reset password
                </button>
              </div>
            </div>
          )}
          <h1 className="text-red-500 text-4xl text-center">
            {error !== '' || (invalid !== '' && 'Error')}
          </h1>
          <h1 className="text-white text-4xl text-center">
            {error !== '' ? success : invalid}
          </h1>
          <h2 className="text-white text-4xl">
            {success !== '' &&
              `You are being redirected to login page in ${count} seconds...`}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
