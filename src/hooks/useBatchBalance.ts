import { useBalance, type AddressOrEns as ContractAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import { BigNumber } from "ethers";

interface  BalanceResult {
    symbol: string
    value: BigNumber
    name: string
    decimals: number
    displayValue: string
}

export const useBatchBalance = (addresses: ContractAddress[]) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState<Array<BalanceResult | undefined>>([])


    const promises = []
    for (const address of addresses) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        promises.push(useBalance(address))
    }

    Promise
        .all(promises)
        .then((result) => {
            const allData = result.map(each => each.data).filter(Boolean)
            setData(allData)
        })
        .catch((err) => {
            setIsError(true)
        })
        .finally(() => {
            setIsLoading(false)
        })

    return {
        data,
        isError,
        isLoading,
    }
}