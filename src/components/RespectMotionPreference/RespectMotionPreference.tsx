'use client';
import { type PropsWithChildren } from 'react';
import { MotionConfig } from 'framer-motion';

function RespectMotionPreference({ children }: PropsWithChildren) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export default RespectMotionPreference;
