import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useState } from 'react'

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = new Metaplex(connection);

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const mintAddress = new PublicKey("3nLcd7A14CevzFhvCzw6xJmKNRKn311DzAzrg16WLD6i");
  const [imageUrl, setImageUrl] = useState("");
  
  async function getNft() {
    const nft = await metaplex.nfts().findByMint({ mintAddress });
    if (nft.json != null) {
      setImageUrl(nft.json.image || "");
      console.log(imageUrl)
    }
    
    console.log(nft)
  }

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
          <button className='my-8 mx-2 text-2xl bg-purple-500 hover:bg-purple-600 hover:scale-105 text-white py-2 px-4 rounded-lg' onClick={getNft}>Get NFT</button>
          {imageUrl != "" ? (
            <img className="w-32 h-32 object-center" src={imageUrl}></img>
          ) : (
            <p className='text-center'>no image</p>
          )}
        </div>
      </main>
    </>
  );
}
