import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Head from 'next/head';
import '../styles/globals.css';
import { AppProps } from 'next/app';

const activeChain = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.CLIENT_ID}
      secretKey={process.env.TW_SECRET_KEY}
      authConfig={{
        domain: 'example.org',
        authUrl: '/api/auth',
      }}
    >
      <Head>
        <title>NFT Gated Website</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='Learn how to use the thirdweb Auth SDK to create an NFT Gated Website'
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
