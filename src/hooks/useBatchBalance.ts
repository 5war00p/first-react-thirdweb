import { type AddressOrEns as ContractAddress, useSDK } from "@thirdweb-dev/react";
import { ethers } from "ethers";


export const useBatchBalance = (addresses: ContractAddress[]) => {

    const provider = useSDK()
    const url = (provider?.getProvider() as ethers.providers.Provider & { connection: { url: string } }).connection.url

    // const singleProvider = new ethers.providers.JsonRpcProvider(url)
    const batchProvider = new ethers.providers.JsonRpcBatchProvider(url)

    const formattedTokenAddresses = addresses
        .map((address, index) => {
            return { jsonrpc: "2.0", id: index + 1, method: "eth_getBalance", params: [address, 'latest'] }
        })

    // singleProvider.send('eth_getBalance', [addresses[4], 'latest'])

    batchProvider.send('eth_getBalance' , formattedTokenAddresses)
        .then((result) => {
            console.log(result)
        })
        .catch(error => {
            console.log("Error:", error);
        })
}