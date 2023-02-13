import { useEffect } from "react"
import './App.css';
import { useWeb3React } from "@web3-react/core"
import { injected } from "./connector";
function App() {
  const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
  const SIGNING_DOMAIN_VERSION = "1"

  const { active, account, library, connector, activate, deactivate } = useWeb3React()


  async function balancefetch() {
    try {
      if (active) {
        console.log(library);
        const balance = await library.eth.getBalance(account);
        console.log(balance);
        const balancematic = await library.utils.fromWei(balance);
        console.log(balancematic);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  const signmessage = async () => {
    try {
      const voucher = {
        "royalty": 2,
        "uri": "safaj",
        "minPrice": 0
      }
      const types = {
        NFTVoucher: [
          { name: "royalty", type: "uint256" },
          { name: "minPrice", type: "uint256" },
          { name: "uri", type: "string" },
        ]
      }
      const domain = {
        name: SIGNING_DOMAIN_NAME,
        version: SIGNING_DOMAIN_VERSION,
        verifyingContract: "dfghj",
        chainId: 80001
      }
      const response = library.utils.sha3(voucher + types + domain);
      console.log(response);
      const sig1 = await library.eth.sign(response, account);
      console.log(sig1);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])
  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
      {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
      <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
      <button onClick={signmessage} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Balance</button>
    </div>
  );
}

export default App;
