import { useLogout, useUser } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUser } from '../../auth.config';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';
import checkBalance from '../util/checkBalance';

export default function Home() {
  const { isLoggedIn, isLoading } = useUser();
  const { logout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>NFT Gated Content </h2>

      <div className={styles.card}>
        <h3>Exclusive unlocked</h3>

        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const secretKey = process.env.TW_SECRET_KEY;

  if (!secretKey) {
    console.log('Missing env var: TW_SECRET_KEY');
    throw new Error('Missing env var: TW_SECRET_KEY');
  }

  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error('You need to add an PRIVATE_KEY environment variable.');
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY || '',
    'mumbai',
    { secretKey }
  );

  // Check to see if the user has an NFT
  const hasNft = await checkBalance(sdk, user.address);

  // If they don't have an NFT, redirect them to the login page
  if (!hasNft) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
