import { useRouter } from "next/router"
import Router from "next/router"
import { PropertyDetails } from "@/components/PropertyCard"
import { getListedProperties } from "@/constants/blockchain"
import Link from "next/link"
import React from "react"
import { ethers } from "ethers"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import tenantManagerAbi from "../../../constants/TenantManager.json"
import { useSelector } from "react-redux"
import { ApplyForm } from "../../../components/ApplyForm"

export default function ApplyForRent({ listedProperties }) {
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const { wallet } = useSelector((states) => states.globalStates)
    const { propertyId: id } = router.query
    const selectedProperty = listedProperties.find((property) => property.propertyNftId === parseInt(id))

    const [tenantId, setTenantId] = React.useState("")
    const [tenantName, setTenantName] = React.useState("")
    const [rentalTermSeconds, setRentalTermSeconds] = React.useState("year")
    const [numDays, setNumDays] = React.useState(null)
    const [applyFormData, setApplyFormData] = React.useState({
        startDate: "",
        daysValid: "",
        rentalPrice: "",
        depositAmount: "",
    })

    React.useEffect(() => {
        async function getContract() {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const tenantManagerAddress = networkMapping["11155111"].TenantManager[0]
                    const contractAbi = tenantManagerAbi
                    const contract = new ethers.Contract(tenantManagerAddress, contractAbi, signer)
                    return contract
                } catch (e) {
                    console.log(e)
                }
            }
        }

        async function getTokenId(contract) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const userAddress = provider.getSigner().getAddress()
                const tokenId = await contract.getTokenId(userAddress)
                console.log(`User has soulbound token. Token ID: ${tokenId}`)
                return tokenId
            } catch (e) {
                console.log(e)
            }
        }
        async function getTenantName(contract) {
            try {
                const name = await contract.getTokenOwnerName(tenantId)
                console.log(`Name: ${name}`)
                return name
            } catch (e) {
                console.log(e)
            }
        }

        getContract().then((contract) => {
            getTokenId(contract)
                .then((tokenId) => {
                    setTenantId(tokenId)
                })
                .then(() => getTenantName(contract).then((name) => setTenantName(name)))
        })
        console.log(selectedProperty)
        setApplyFormData((prevData) => ({
            ...prevData,
            depositAmount: selectedProperty.depositAmount,
        }))
        setApplyFormData((prevData) => ({
            ...prevData,
            rentalPrice: selectedProperty.rentalPrice,
        }))
    }, [tenantName])

    async function applyForRent(_rentalTerm, _rentalPrice, _depositAmount, _startDate, _daysValid) {
        try {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)

                const propertyTx = await contract.createRentContract(
                    selectedProperty.propertyNftId,
                    tenantId,
                    _rentalTerm,
                    ethers.BigNumber.from(ethers.utils.parseUnits(_rentalPrice, 18)),
                    ethers.BigNumber.from(ethers.utils.parseUnits(_depositAmount, 18)),
                    _startDate,
                    _daysValid
                )

                // Wait for the transaction to be confirmed
                const propertyTxReceipt = await propertyTx.wait()
                // Get the property ID from the event emitted by the contract
                const events = propertyTxReceipt.events
                const rentContractCreatedEvent = events.find((e) => e.event === "RentContractCreated")
                const rentContractId = rentContractCreatedEvent.args[1]

                console.log(`Rent Contract is created. Rent Contract ID: ${rentContractId}`)
                setAlert(true)
                return rentContractId
            }
        } catch (e) {
            console.log(e)
        }
    }
    const handleRentalTermChange = (event) => {
        setRentalTermSeconds(event.target.value)
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        let rentalTerm = 0
        if (rentalTermSeconds === "month") {
            rentalTerm = 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "three-months") {
            rentalTerm = 3 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "six-months") {
            rentalTerm = 6 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "year") {
            rentalTerm = 12 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "custom") {
            rentalTerm = numDays * 24 * 60 * 60
        }
        console.log(rentalTerm)

        const startDateTimestampInSeconds = Math.floor(new Date(applyFormData.startDate).getTime() / 1000)

        const daysValidInSeconds = applyFormData.daysValid * 24 * 60 * 60

        const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

        const validUntil = nowTimestampInSeconds + daysValidInSeconds
        console.log("txData: ", rentalTerm, applyFormData.rentalPrice, applyFormData.depositAmount, startDateTimestampInSeconds, validUntil)

        await applyForRent(rentalTerm, applyFormData.rentalPrice, applyFormData.depositAmount, startDateTimestampInSeconds, validUntil)
    }

    return (
        <ApplyForm
            {...{
                applyFormData,
                setApplyFormData,
                handleSubmit,
                tenantId,
                wallet,
                tenantName,
                alert,
                loading,
                rentalTermSeconds,
                handleRentalTermChange,
                numDays,
                setNumDays,
            }}
        />
    )
}

export const getServerSideProps = async () => {
    const data2 = await getListedProperties()
    return {
        props: { listedProperties: JSON.parse(JSON.stringify(data2)) },
    }
}
