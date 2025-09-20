import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VerifyEmail = () => {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);
    if (count === 0) router.push('/auth');
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="relative h-full w-full">
      <div className="bg-black w-full h-full bg-opacity-50">
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
          <h1 className="text-white text-4xl">Email verified successfully</h1>
          <h2 className="text-white text-4xl">
            You are being redirected to login page in {count} seconds...
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
