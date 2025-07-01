import Image from 'next/image';
import Link from 'next/link';

import styles from './Logo.module.css';

function Logo({ mobileAlignment = 'left' }) {
  return (
    <Link href="/" className={styles.wrapper} data-mobile-alignment={mobileAlignment}>
      <Image src="/logo.svg" width={150} height={100} alt="Trip Scribe logo" />
    </Link>
  );
}

export default Logo;
