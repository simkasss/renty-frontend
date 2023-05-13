import { useRouter } from "next/router"
import Router from "next/router"
import { PropertyDetails } from "@/components/PropertyCard"
import { getListedProperties } from "@/constants/blockchain"
import Link from "next/link"
import React from "react"
import { ethers } from "ethers"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureTenant } from "../../../utilities/structureStructs"

export default function ApplyForRent({ listedProperties }) {
    const [alert, setAlert] = React.useState(false)
    const router = useRouter()
    const { propertyId: id } = router.query
    const [tenantSbtId, setTenantSbtId] = React.useState("")
    const [tenant, setTenant] = React.useState("")
    const { wallet } = useSelector((states) => states.globalStates)
    const [rentalTermSeconds, setRentalTermSeconds] = React.useState("year")
    const [numDays, setNumDays] = React.useState("")

    React.useEffect(() => {
        let provider, signer, userAddress, rentAppAddress, contractAbi, contract

        async function getContract() {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    provider = new ethers.providers.Web3Provider(ethereum)
                    signer = provider.getSigner()
                    userAddress = await signer.getAddress()
                    rentAppAddress = networkMapping["11155111"].RentApp[0]
                    contractAbi = rentAppAbi
                    contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                    return contract
                } catch (e) {
                    console.log(e)
                }
            }
        }

        async function getSbtTokenId() {
            try {
                const sbtTokenId = await contract.getSbtTokenId(userAddress)
                console.log(`User has soulbound token. Token ID: ${sbtTokenId}`)
                return sbtTokenId
            } catch (e) {
                console.log(e)
            }
        }
        async function getTenant(tenantSbtId) {
            try {
                const tenant = structureTenant(await contract.getTenant(tenantSbtId))
                console.log(`Tenant: ${tenant}`)
                return tenant
            } catch (e) {
                console.log(e)
            }
        }

        getContract().then(() => {
            getSbtTokenId().then((tokenId) => {
                setTenantSbtId(tokenId)
                getTenant(tokenId).then((tenant) => {
                    setTenant(tenant)
                    console.log("Tenant: ", tenant)
                })
            })
        })
    }, [])

    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = listedProperties.find((property) => property.propertyNftId === parseInt(id))

    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }

    const [startDate, setStartDate] = React.useState("")
    const [rentalTerm, setRentalTerm] = React.useState("")
    const [daysValid, setDaysValid] = React.useState("")
    const [rentalPrice, setRentalPrice] = React.useState(selectedProperty.rentalPrice)
    const [depositAmount, setDepositAmount] = React.useState(selectedProperty.depositAmount)

    async function applyForRent(_rentalTerm, _rentalPrice, _depositAmount, _startDate, _daysValid) {
        try {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)

                const propertyTx = await contract.createRentContract(
                    selectedProperty.propertyNftId,
                    tenantSbtId,
                    _rentalTerm,
                    _rentalPrice,
                    _depositAmount,
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        let seconds = 0
        if (rentalTermSeconds === "month") {
            seconds = 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "three-months") {
            seconds = 3 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "six-months") {
            seconds = 6 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "year") {
            seconds = 12 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "custom") {
            seconds = numDays * 24 * 60 * 60
        }

        setRentalTerm(seconds)

        await applyForRent(rentalTerm, ethers.utils.parseEther(rentalPrice), ethers.utils.parseEther(depositAmount), startDate, daysValid)
    }
    const handleRentalTermChange = (event) => {
        setRentalTermSeconds(event.target.value)
    }

    const handleNumDaysChange = (event) => {
        setNumDays(event.target.value)
    }
    return (
        <>
            {tenantSbtId == null ? (
                <>
                    {wallet == 0 ? (
                        <>You have to Log In and create a soulbound token in order to apply for rent</>
                    ) : (
                        <>
                            <div>You have to create your soulbound token in order to apply for rent </div>
                            <Link className="link-standart" href={`/${wallet}/myrentals`}>
                                Redirect
                            </Link>
                        </>
                    )}
                </>
            ) : (
                <>
                    <>My Tenant Soulbound Token ID: {Number(tenantSbtId)}</>
                    <div>My name: {tenant.name}</div>

                    <form onSubmit={handleSubmit} className="form">
                        <label>
                            Start Date:
                            <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </label>
                        <label>
                            Rental Term:
                            <select value={rentalTermSeconds} onChange={handleRentalTermChange}>
                                <option value="year">Year</option>
                                <option value="month">Month</option>
                                <option value="three-months">Three Months</option>
                                <option value="six-months">Six Months</option>

                                <option value="custom">Select Number of Days</option>
                            </select>
                        </label>
                        {rentalTermSeconds === "custom" && (
                            <label>
                                Number of Days:
                                <input type="number" value={numDays} onChange={handleNumDaysChange} />
                            </label>
                        )}
                        <label>
                            Rental Price:
                            <input type="text" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                        </label>
                        <label>
                            Deposit Amount:
                            <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                        </label>
                        <label>
                            How many days this application is valid:
                            <input type="text" value={daysValid} onChange={(e) => setDaysValid(e.target.value)} />
                        </label>
                        <button type="submit" className="button-standart">
                            Submit
                        </button>
                    </form>
                    {alert ? <div> Application submited! </div> : <></>}
                </>
            )}
        </>
    )
}

export const getServerSideProps = async () => {
    const data2 = await getListedProperties()
    return {
        props: { listedProperties: JSON.parse(JSON.stringify(data2)) },
    }
}
