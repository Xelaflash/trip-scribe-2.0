'use client';
import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
// libs
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const noUserLinks = [
  {
    name: 'How it works',
    href: '/',
  },
  {
    name: 'Features',
    href: '/',
  },
  {
    name: 'Sign in',
    href: '/auth/signin',
  },
];

const userConnectedLinks = [
  {
    name: 'Trips',
    href: '/trips',
  },
  {
    name: 'How it works',
    href: '/',
  },
];

const linkHoverVariants: Variants = {
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 35,
    },
  },
  hidden: {
    opacity: 0,
    scale: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 600,
      damping: 10,
    },
  },
};

const Links = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleMouseEnter = (index: number) => {
    setIsHovering(true);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoveredIndex(-1);
  };

  const { data: session } = useSession();

  const links = session ? userConnectedLinks : noUserLinks;

  return (
    <ul className="hidden list-none items-center gap-[clamp(1rem,4vw,2.75rem)] p-0 min-[761px]:flex">
      {links.map((link, index) => (
        <motion.li
          key={link.name}
          className="cursor-pointer"
          whileHover="hover"
          initial="hidden"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={link.href}
            className="text-sm font-bold no-underline"
            style={{
              color: isHovering && hoveredIndex === index ? 'var(--color-secondary)' : 'inherit',
              transition: 'color 0.3s ease-in-out',
            }}
          >
            {link.name}
            <motion.div
              className="relative mt-[0.1rem] h-[0.8rem]"
              variants={linkHoverVariants}
              style={{ transformOrigin: '0% 100%' }}
            >
              <Image src={`/handline${index + 1}.svg`} fill alt="" aria-hidden="true" className="object-contain" />
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
};

export default Links;
