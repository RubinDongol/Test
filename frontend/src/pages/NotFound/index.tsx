import { useState, useEffect } from 'react';

import { AppWrapper } from '../../components/layouts';
import { NotFoundPage } from '../../assets';

export default function NotFound() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <AppWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div
          className={`-mt-12 transform transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
          <img
            src={NotFoundPage}
            alt="404"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80"
          />
        </div>

        <div
          className={`mt-6 transform transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
          <h1
            className="text-l sm:text-3l md:text-4l italic text-black"
            style={{ fontFamily: 'Pacifico' }}>
            OOPS! THE PAGE YOU WERE LOOKING FOR, COULDN’T BE FOUND
          </h1>
        </div>
      </div>
    </AppWrapper>
  );
}
