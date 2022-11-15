import './App.css';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { getWeb3Provider } from './service';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function App() {

  const CONTRACT_ADDRESS = '0xDB24115ebFf916FCb1a2E4280acf8e9e6cF3B2Ea'
  const CONTRACT_ABI = '[{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dec","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"inc","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

  const { account, activate, deactivate } = useWeb3React()
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0)
  const [currentCounterValue, setCurrentCounterValue] = useState(0)

  const handleMetamaskConnect = async () => {
    const selectedNetWorks = [56, 97, 137, 43114, 2, 3, 4, 42, 1]
    const injected = new InjectedConnector({ supportedChainIds: selectedNetWorks })
    await activate(injected)
  }

  const listingToTheBlockEvent = async () => {
    const provider = await getWeb3Provider()
    provider.on('block', (blockNumber) => {
      setCurrentBlockNumber(blockNumber)
    })
  }

  const readCurrentCounterValue = async () => {
    const provider = await getWeb3Provider()
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, JSON.parse(CONTRACT_ABI), provider)
    const response = await contractInstance.get()
    setCurrentCounterValue(response.toString())
  }

  const handleDisconnect = async () => {
    deactivate()
  }

  useEffect(() => {
    listingToTheBlockEvent()
    readCurrentCounterValue()
  }, [])

  return (
    <div className="App">
      <div className='metamask-login-container' style={{ marginTop: '50px' }}>
        <div className='block-number' style={{ margin: '10px 0' }}>Current Block Number : {currentBlockNumber}</div>
        <div className='counter-number' style={{ margin: '10px 0' }}>Current Counter : {currentCounterValue}</div>
        {
          account ? (
            <div className='logged-user'>
              <div className='account-address'>
                Account Address : <b>{account}</b>
              </div>

              <div className='logout-container' style={{ marginTop: '10px' }}>
                <button onClick={handleDisconnect}>Disconnect</button>
              </div>

            </div>
          ) : (
            <div className='login-container'>
              <button onClick={handleMetamaskConnect}>Login with metamask</button>
            </div>)
        }

      </div>
    </div>
  );
}

export default App;
