import { ConnectWallet } from '@thirdweb-dev/react';
import styles from '../styles/Header.module.css';

export const Header = () => {
  return (
    <nav className={styles.header}>
      <ConnectWallet theme='dark' />
    </nav>
  );
};
