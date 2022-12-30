import Head from "next/head";
import { Inter } from "@next/font/google";
import NavBar from "../components/navBar";

import { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { MetaplexProvider } from "./MetaplexProvider";
import "@solana/wallet-adapter-react-ui/styles.css";

import { app, database } from "./firebaseConfig"
import { collection, addDoc, getDocs } from 'firebase/firestore';


export default function Home() {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const dbInstance = collection(database, '/coupons');
  
  function getCoupons() {
    getDocs(dbInstance).then((data) => {
      console.log( data.docs.map((item)=>{
        return {...item.data(), id: item.id}
      }));
    });
  }

  getCoupons()

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  const handleChange = (event: { target: { value: any; }; }) => {
    switch (event.target.value) {
      case "devnet":
        setNetwork(WalletAdapterNetwork.Devnet);
        break;
      case "mainnet":
        setNetwork(WalletAdapterNetwork.Mainnet);
        break;
      case "testnet":
        setNetwork(WalletAdapterNetwork.Testnet);
        break;
      default:
        setNetwork(WalletAdapterNetwork.Devnet);
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Treehoppers Merchant Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <MetaplexProvider>
              <main>
                <NavBar onClusterChange={handleChange}/>
                <h1 className='px-6 py-6 text-4xl font-bold text-center'>Coming Soon!</h1>
              </main>
            </MetaplexProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
