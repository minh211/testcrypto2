import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import axios from "axios";
import "./style.css"

const startPayment = async ({ setError, setTxs, ether }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.request({ method: "eth_accounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress("0x8d897271B02ce4BC854714C9A9375f439a8B1216");
    const tx = await signer.sendTransaction({
      to: "0x8d897271B02ce4BC854714C9A9375f439a8B1216",
      value: ethers.utils.parseEther(ether),
    });
    console.log({ ether });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};

//   const getEther = async () =>{
//     const ether = await axios.get(
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=ethereum"
//   );
//   console.log(ether.data);
//   return ether.data
// };
//   getEther();

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [ether, setEther] = useState([]);

  useEffect(() => {
    const interval=setInterval(()=>{
      fetchData()
     },15000)
    const fetchData = async () => {
      try {
        const ether = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=ethereum"
        );
        setEther(ether.data);
        console.log(ether.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    return()=>clearInterval(interval)

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <form className="m-4" onSubmit={handleSubmit}>
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
          <div className="">
            <div className="my-3">
              <input
                type="text"
                name="addr"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="0x8d897271B02ce4BC854714C9A9375f439a8B1216"
                disabled
              />
            </div>
            <div className="my-3">
              <input
                name="ether"
                type="text"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Amount in ETH"
              />
            </div>
          </div>
          <p className="blinking">
          <div>
            {ether.map(function (item, i) {
              return (
                <span key={i}>
                  {item.name} price is {item.current_price}$ last updated{" "}
                  {item.last_updated}
                </span>
              );
            })}
          </div>
          </p>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
  );
}
