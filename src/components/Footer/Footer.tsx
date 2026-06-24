import Link from 'next/link';

import Logo from '@/components/Logo/Logo';

import DecorativeSwoops from './DecorativeSwoops';
import styles from './Footer.module.css';

// import { useCurrentUser } from '@/hooks/useCurrentUser';

function Footer() {
  const date = new Date().getFullYear();

  return (
    <div className={styles.wrapper}>
      <DecorativeSwoops />
      <div className={styles.content}>
        <div>
          <Logo mobileAlignment="center" />
          <p className={styles.attribution}>© {date} Trip Scribe. All rights reserved.</p>
        </div>
        <nav>
          <h2 className={styles.linkHeading}>Links</h2>
          <ul className={styles.linkList}>
            <li></li>
            <li>
              <Link href="/todo">Terms of Use</Link>
            </li>
            <li>
              <Link href="/todo">Privacy Policy</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Footer;
