import { ethers } from 'ethers'
import PoapJSON from './abi/poap.json'

const ETH_POAP_CONTRACT_ADDRESS = "0x22C1f6050E56d2876009903609a2cC3fEf83B415"
const GNOSIS_CHAIN_POAP_CONTRACT_ADDRESS = "0x22C1f6050E56d2876009903609a2cC3fEf83B415"
const GNOSIS_CHAIN_RPC_ENDPOINT = "https://rpc.gnosischain.com/"
const GNOSIS_CHAIN_CHAINID = 100

const address = "22c1f6050e56d2876009903609a2cc3fef83b415"

const providerEth = ethers.getDefaultProvider()
const providerGnosisChain = new ethers.providers.JsonRpcProvider(GNOSIS_CHAIN_RPC_ENDPOINT, GNOSIS_CHAIN_CHAINID)
const poapContractEth = new ethers.Contract(ETH_POAP_CONTRACT_ADDRESS, PoapJSON, providerEth)
const poapContractGnosisChain = new ethers.Contract(GNOSIS_CHAIN_POAP_CONTRACT_ADDRESS, PoapJSON, providerGnosisChain)

const getPOAPBalance = async () => {
    const tokenBalanceEth: ethers.BigNumber = await poapContractEth.balanceOf(address)
    const tokenBalanceGnosis: ethers.BigNumber = await poapContractGnosisChain.balanceOf(address)
    console.log(`This address has ${tokenBalanceEth} POAPs on Ethereum`)
    console.log(`This address has ${tokenBalanceGnosis} POAPs on Gnosis Chain`)
    return { tokenBalanceEth, tokenBalanceGnosis }
}

const getEventIds = async () => {
    const { tokenBalanceEth, tokenBalanceGnosis } = await getPOAPBalance()
    if (!tokenBalanceEth.eq(0)) {
        let i = 0;
        while (tokenBalanceEth.gt(i)) {
            const tokenIdEth: ethers.BigNumber = await poapContractEth.tokenOfOwnerByIndex(address, i)
            const eventIdEth: ethers.BigNumber = await poapContractEth.tokenEvent(tokenIdEth)
            console.log(`Ethereum - EventId: ${eventIdEth} for tokenId: ${tokenIdEth}`)
            i++
        }
        i = 0;
        while (tokenBalanceGnosis.gt(i)) {
            const tokenIdGnosisChain: ethers.BigNumber = await poapContractGnosisChain.tokenOfOwnerByIndex(address, i)
            const eventIdGnosisChain: ethers.BigNumber = await poapContractGnosisChain.tokenEvent(tokenIdGnosisChain)
            console.log(`Gnosis Chain - EventId: ${eventIdGnosisChain} for tokenId: ${tokenIdGnosisChain}`)
            i++
        }
    } else {
        console.log('Address doesn\'t have POAPs')
    }
}

getEventIds()
