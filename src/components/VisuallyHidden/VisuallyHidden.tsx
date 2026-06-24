import clsx from 'clsx';
import type { JSX } from 'react';
import { useState, useEffect } from 'react';

type VisuallyHiddenProps = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>;
  className?: string;
  children: React.ReactNode;
};

const VisuallyHidden = ({ children, className, ...delegated }: VisuallyHiddenProps) => {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Alt') {
          setForceShow(true);
        }
      };
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Alt') {
          setForceShow(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, []);
  if (forceShow) {
    return children;
  }
  return (
    <span className={clsx('sr-only focus:not-sr-only active:not-sr-only', className)} {...delegated}>
      {children}
    </span>
  );
};
export default VisuallyHidden;
