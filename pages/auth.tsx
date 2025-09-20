import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FcGoogle } from 'react-icons/fc';

import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Auth = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loader, setLoader] = useState(false);

  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === 'login' ? 'register' : 'login'
    );
    setError('');
    setSuccess('');
  }, []);

  const login = useCallback(async () => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callBackUrl: '/',
      });
      if (res?.error) {
        setError(res.error);
        setSuccess('');
      }
      if (!res?.error) {
        setError('');
        setSuccess('');
        setLoader(true);
        setTimeout(() => {
          router.push('/');
          setLoader(false);
        }, 3000);
      }
    } catch (error) {
      setSuccess('');
      console.log(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    try {
      const res = await axios.post('/api/register', {
        email,
        name,
        password,
        confirmPassword,
      });
      setError('');
      setSuccess('');
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setSuccess(res.data.success);
        console.log(res);
      }, 2000);
    } catch (error) {
      setSuccess('');
      console.log(error);
      error.response && setError(error.response.data.error);
    }
  }, [email, name, password, confirmPassword]);

  const resendVerification = useCallback(async () => {
    try {
      const res = await axios.post('/api/email/send-verification', {
        email,
      });
      setError('');
      setSuccess('');
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setSuccess(res.data.success);
      }, 2000);
    } catch (error) {
      setSuccess('');
      console.log(error);
      error.response && setError(error.response.data.error);
    }
  }, [email]);

  const resetPassword = useCallback(async () => {
    try {
      const res = await axios.post('/api/password/reset-password', {
        email,
      });
      setError('');
      setSuccess('');
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setSuccess(res.data.success);
      }, 2000);
    } catch (error) {
      setSuccess('');
      console.log(error);
      error.response && setError(error.response.data.error);
    }
  }, [email]);

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full bg-[url('/images/auth-bg.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="bg-black w-full h-full bg-opacity-50">
          <div className="flex justify-center h-screen">
            <div className="bg-white px-16 py-16 self-center lg:mt-10 md:mt-10 mt-28 mb-10 ml-2 mr-2 lg:w-3/5 md:w-3/5 lg:max-w-md rounded-md w-full">
              <h2 className="text-black text-4xl mb-8 font-semibold">
                {variant === 'login' ? 'Sign in' : 'Register'}
              </h2>
              <div className="flex flex-col gap-4">
                {variant === 'register' && (
                  <Input
                    label="Username"
                    onChange={(e: any) => setName(e.target.value)}
                    id="name"
                    value={name}
                  />
                )}
                <Input
                  label="Email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  value={email}
                />
                <Input
                  label="Password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  value={password}
                />
                {variant === 'register' && (
                  <Input
                    label="Confirm password"
                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                  />
                )}
                {variant === 'login' && (
                  <div className="flex flex-col gap-1 text-blue-500 text-right">
                    <span
                      onClick={resetPassword}
                      className="hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </span>
                    <span
                      onClick={resendVerification}
                      className="hover:underline cursor-pointer "
                    >
                      Resend Verification Link
                    </span>
                  </div>
                )}
                {error !== '' && (
                  <p className="bg-red-600 bg-opacity-80 text-white h-auto p-2 font-semibold text-center">
                    {error}
                  </p>
                )}
                {success !== '' && (
                  <p className="bg-green-600 bg-opacity-80 text-white h-auto p-2 font-semibold text-center">
                    {success}
                  </p>
                )}
                {loader && <Loader></Loader>}
              </div>
              <button
                onClick={variant === 'login' ? login : register}
                className="bg-blue-500 py-3 text-white rounded-md w-full mt-7 hover:bg-blue-600 transition"
              >
                {variant === 'login' ? 'Login' : 'Sign up'}
              </button>
              <div className="inline-flex items-center justify-center w-full mt-4">
                <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">
                  or
                </span>
              </div>
              <div className="flex flex-row items-center gap-4 justify-center">
                <div
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="
                w-11
                h-11
                bg-white
                rounded-full
                flex
                items-center
                justify-center
                cursor-pointer
                hover:opacity-70
                transition
                border
                "
                >
                  <FcGoogle size={32} />
                </div>
              </div>
              <p className="text-neutral-500 mt-12">
                {variant === 'login'
                  ? 'Are you a new user?'
                  : 'Already have an account?'}
                <span
                  onClick={toggleVariant}
                  className="text-blue-500 ml-1 hover:underline cursor-pointer"
                >
                  {variant === 'login' ? 'Create an account' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
