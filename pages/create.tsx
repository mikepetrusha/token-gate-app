import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';
import { contractAddress } from '../config';

export default function Create() {
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

      <div className={styles.card}>
        <h3>Claim NFT</h3>

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

        <Web3Button
          contractAddress={contractAddress}
          action={(contract) => contract.erc1155.claim(0, 1)}
        >
          Claim NFT
        </Web3Button>
      </div>
    </div>
  );
}
