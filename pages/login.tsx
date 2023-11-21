import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUser } from '../auth.config';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';
import checkBalance from '../utils/checkBalance';
import { contractAddress } from '../config';
import Link from 'next/link';

export default function Login() {
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);
  const address = useAddress();
  const { data: nfts } = useOwnedNFTs(contract, address);
  const router = useRouter();

  useEffect(() => {
    if (nfts?.length) {
      router.push('/');
    }
  }, [nfts, router, address]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>NFT Gated Content </h2>

      <div className={styles.card}>
        <h3>Holder exclusive</h3>
        <p>To unlock this product, you need:</p>

        {contractMetadata && (
          <div className={styles.nft}>
            <MediaRenderer
              src={contractMetadata.image}
              alt={contractMetadata.name}
              width='70px'
              height='70px'
            />
            <div className={styles.nftDetails}>
              <h4>{contractMetadata.name}</h4>
              <p>{contractMetadata?.description?.substring(0, 100)}...</p>
            </div>
          </div>
        )}
        {contractLoading && <p>Loading...</p>}

        <ConnectWallet
          theme='dark'
          className={styles.connect}
          switchToActiveChain={true}
        />

        <Link href='/create'>
          <button>Create Token</button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      props: {},
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

  // If they have an NFT, redirect them to the home page
  if (hasNft) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
