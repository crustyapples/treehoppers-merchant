import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState,useEffect } from 'react'
import NftCard from '../components/nft';

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const mintAddress = new PublicKey("3nLcd7A14CevzFhvCzw6xJmKNRKn311DzAzrg16WLD6i");

  const [nftProps, setNftProps] = useState({ name: "", symbol: "", imageURI: "" });
  
  async function getNft() {
    const nft = await metaplex.nfts().findByMint({ mintAddress });
    if (nft.json != null) {
      setNftProps({ name: nft.name || "", symbol: nft.symbol || "", imageURI: nft.json.image || "" })
    }
    console.log(nft)
    return nft
  }

  useEffect(() => {
    getNft()
  }, [])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-5xl text-gray-700">
            Currently Minted Coupons
          </h1>
          <div className='flex flex-wrap'>
          {nftProps ? <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI}/> : <p>loading...</p> }
          <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI}/>
          <NftCard name={nftProps.name} symbol={nftProps.symbol} imageURI={nftProps.imageURI}/>
          </div>

        </div>
      </main>
    </>
  );
}
