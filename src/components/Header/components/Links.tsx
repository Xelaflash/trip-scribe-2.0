'use client';
import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
// libs
import { motion } from 'framer-motion';

// styles
import styles from '../Header.module.css';

export default function Links() {
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

  const noUserLinks = [
    {
      name: 'How it works',
      href: '/',
    },
    {
      name: 'About Us',
      href: '/',
    },
    {
      name: 'TBD',
      href: `/`,
    },
    {
      name: 'TBD2',
      href: '/',
    },
  ];

  const { data: session } = useSession();

  const userConnectedLinks = [
    {
      name: 'How it works',
      href: '/',
    },
    {
      name: 'About Us',
      href: '/',
    },
    {
      name: 'Profile',
      href: `profile/${session?.user.id}`,
    },
  ];

  const linkHoverVariants = {
    hover: {
      opacity: 1,
      scale: 1,
      transformOrigin: 'bottom left',
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 35,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0,
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 10,
      },
    },
  };

  const Links = session ? userConnectedLinks : noUserLinks;

  return (
    <ul className={styles.linksList}>
      {}
      {Links.map((link, index) => (
        <motion.li
          key={link.name}
          whileHover="hover"
          initial="hidden"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/${link.href}`}
            className={styles.headerLink}
            style={{
              color: isHovering && hoveredIndex === index ? 'var(--color-secondary' : 'inherit',
              transition: 'color 0.3s ease-in-out',
            }}
          >
            {link.name}
            <motion.div className={styles.imageWrapper} variants={linkHoverVariants}>
              <Image src={`/handline${index + 1}.svg`} fill alt="Decorative Hand Drawn line" className={styles.image} />
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
