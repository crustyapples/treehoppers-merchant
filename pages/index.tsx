import Head from "next/head";
import NavBar from "../components/navBar";
import DashBoard from "../components/dashboard";
import { useMemo, useState, useEffect } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { database } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const dbInstance = collection(database, "/CouponCollection");
  const [mintAddresses, setMintAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function getCoupons() {
    getDocs(dbInstance).then((data) => {
      const coupons = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });

      let addresses = [];
      for (let i = 0; i < coupons.length; i++) {
        addresses.push(coupons[i].mintAddress);
      }
      setMintAddresses(addresses);
      console.log("state", mintAddresses);
      setLoading(false);
    });
  }

  useEffect(() => {
    getCoupons();
  }, []);

  const handleChange = (event: { target: { value: any } }) => {
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

      <NavBar />

      {loading ? (
        <p className="text-center font-light">loading...</p>
      ) : (
        <DashBoard addresses={mintAddresses} pending={false} />
      )}
    </>
  );
}
