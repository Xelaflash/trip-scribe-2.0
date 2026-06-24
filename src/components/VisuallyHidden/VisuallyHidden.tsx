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
    <span
      className={clsx(
        'not-focus:not-active:absolute not-focus:not-active:size-px not-focus:not-active:overflow-hidden not-focus:not-active:whitespace-nowrap not-focus:not-active:[clip-path:inset(50%)] not-focus:not-active:[clip:rect(0_0_0_0)]',
        className,
      )}
      {...delegated}
    >
      {children}
    </span>
  );
};
export default VisuallyHidden;
