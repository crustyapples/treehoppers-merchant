import Head from "next/head";
import { Inter } from "@next/font/google";
import NavBar from "../components/navBar";
import { Form } from "@web3uikit/core";
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

import { app, database } from "./firebaseConfig";
import { collection, addDoc, setDoc, getDocs, doc } from "firebase/firestore";
import { pinata } from "./pinataConfig.js";
import fs from "fs";
import axios from "axios";

export default function Home() {
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const dbInstance = collection(database, '/MerchantCollection');

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

  const pinataUpload = async (image: any) => {
    const formData = new FormData();
    formData.append("file", image);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.JWT}`,
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODA1MzJhMC01YmU2LTQyZTItYmRlNS1hMTkwYWZkMzNkZjkiLCJlbWFpbCI6ImFkdmFpdC5iaGFyYXQuZGVzaHBhbmRlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MzNjNjBkNDAyMjUxNmM3MThjZiIsInNjb3BlZEtleVNlY3JldCI6IjA1YTZjMDhkY2QxMTJmNzgyOTQyYjZmNjZiMDI0ZGIwMjUwYzAxMjY5NjM2MjUxN2FlMmM5NmY3MmMyOGRhOTciLCJpYXQiOjE2NzI4MjA5NDR9.F-671ePIGEfYz9m3Ev-Owb6nAeY-cCH2KjFJiqKQBj8
          },
        }
      );
      console.log(res.data.IpfsHash);
      return res.data.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  };

  async function formHandler(event: any) {
    // Get data from the form.
    console.log(event);

    const image = event.data[8].inputResult;
    // Upload image to /uploadFile endpoint using Pinata
    pinataUpload(image).then(async (hash) => {
      const metadata = {
        title: event.data[1].inputResult,
        symbol: event.data[2].inputResult,
        description: event.data[3].inputResult,
        image: `https://ipfs.io/ipfs/${hash}`,
        attributes: [
          { trait_type: "Membership", value: event.data[4].inputResult },
          { trait_type: "Redemption points", value: event.data[5].inputResult },
          { trait_type: "Valid till", value: event.data[6].inputResult },
          { trait_type: "owner", value: "@jackDorsey101" },
          { trait_type: "expired", value: "false" },
        ],
        properties: {
          files: [
            {
              uri: `https://ipfs.io/ipfs/${hash}`,
              type: "image/png",
            },
          ],
          category: null,
        },
      };

      //upload metadata to ipfs
      fetch("http://localhost:3000/uploadData", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      })
        .then(async (res) => {
          const metadataCID = await res.text();
          const mintData = {
            Image: hash,
            Symbol: event.data[2].inputResult,
            Title: event.data[1].inputResult,
            URI: metadataCID,
            maxSupply: event.data[7].inputResult,
            merchantName: event.data[0].inputResult,
          };
          uploadData(mintData);
          console.log("mintdata: ", mintData);
        })
        .catch((err) => console.log(err));
    });

    // upload document to firebase
    const uploadData = (data: {}) => {
      // const dbInstance = collection(database, '/MerchantCollection');
      const dbInstance = doc(
        database,
        "/MerchantCollection",
        data.merchantName
      );
      setDoc(dbInstance, data).then(() => {
        window.location.reload(false);
        console.log("uploaded form data");
      });
    };
  }

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
                <NavBar onClusterChange={handleChange} />

                <div className="flex justify-center h-screen">
                  <Form
                    buttonConfig={{
                      theme: "primary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Merchant Name",
                        type: "text",
                        value: "",
                      },
                      {
                        inputWidth: "100%",
                        name: "Coupon Title",
                        type: "text",
                        value: "",
                      },
                      {
                        inputWidth: "100%",
                        name: "Symbol",
                        type: "text",
                        value: "",
                      },
                      {
                        inputWidth: "100%",
                        name: "Description",
                        type: "text",
                        value: "",
                      },
                      {
                        inputWidth: "100%",
                        name: "Membership Level",
                        type: "text",
                        value: "",
                      },
                      {
                        name: "Redemption Points",
                        type: "number",
                        value: "",
                      },
                      {
                        name: "Date of Expiry",
                        type: "date",
                        value: "",
                      },
                      {
                        name: "Supply",
                        type: "number",
                        value: "",
                      },
                      {
                        inputWidth: "100%",
                        name: "Image",
                        type: "file",
                        value: "",
                      },
                    ]}
                    onSubmit={formHandler}
                  />
                </div>
              </main>
            </MetaplexProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}