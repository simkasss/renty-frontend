import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { ethers } from "ethers"
import React from "react"
import { useRouter } from "next/router"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import { structureProperties } from "../../../../utilities/structureStructs"
import { UpdateProperty } from "../../../../components/UpdateProperty"
import { useSelector } from "react-redux"

export default function Update() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const { wallet } = useSelector((states) => states.globalStates)
    const [properties, setProperties] = React.useState([])
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [selectedProperty, setSelectedProperty] = React.useState(null)
    const [rentalTermSeconds, setRentalTermSeconds] = React.useState("")
    const [numDays, setNumDays] = React.useState("")
    const [selectedPhotos, setSelectedPhotos] = React.useState([])
    const [file, setFile] = React.useState(null)
    const [listPropertyData, setListPropertyData] = React.useState({
        name: "",
        description: "",
        rentalTerm: "",
        rentalPrice: "",
        depositAmount: "",
        hashesOfPhotos: "",
        hashOfRentalAgreement: "",
    })

    let provider, signer, userAddress, contractAbi, contract
    React.useEffect(() => {
        if (!id) {
            return
        }
        async function getUserProperties() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                provider = new ethers.providers.Web3Provider(ethereum)
                signer = provider.getSigner()
                userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                contractAbi = mainContractAbi
                contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
                const [listedPropertiesResponse, userPropertiesResponse] = await Promise.all([
                    contract.getListedProperties(),
                    contract.getUserProperties(userAddress),
                ])
                const listedProperties = structureProperties(listedPropertiesResponse)
                const userProperties = structureProperties(userPropertiesResponse).map((userProperty) => {
                    userProperty.isListed = false
                    listedProperties.forEach((listedProperty) => {
                        if (listedProperty.propertyNftId === userProperty.propertyNftId) {
                            userProperty.isListed = true
                        }
                    })
                    return userProperty
                })
                return userProperties
            }
        }
        async function getSelectedProperty(properties) {
            const property = properties.find((property) => property.propertyNftId == parseInt(id))
            console.log("PROPERTY: ", property)
            return property
        }

        getUserProperties().then((properties) => {
            setProperties(properties)
            console.log(properties)
            getSelectedProperty(properties).then((property) => {
                setSelectedProperty(property)
                setListPropertyData((data) => {
                    console.log("data1", data)
                    data.name = property.name
                    data.depositAmount = property.depositAmount
                    data.rentalPrice = property.rentalPrice
                    data.description = property.description
                    data.rentalTerm = property.rentalTerm
                    data.hashesOfPhotos = property.hashesOfPhotos
                    data.hashOfRentalAgreement = property.hashOfRentalAgreement
                    return data
                })
            })
        })
    }, [id])

    async function updateProperty(
        _name,
        _description,
        _propertyNftId,
        _rentalTerm,
        _rentalPrice,
        _depositAmount,
        _hashesOfPhotos,
        _hashOfRentalAggreement
    ) {
        provider = new ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner()
        userAddress = await signer.getAddress()
        const mainContractAddress = networkMapping["11155111"].MainContract[0]
        contractAbi = mainContractAbi
        contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
        const propertyTx = await contract.updateProperty(
            _name,
            _description,
            _propertyNftId,
            _rentalTerm,
            _rentalPrice,
            _depositAmount,
            _hashesOfPhotos,
            _hashOfRentalAggreement
        )
        await propertyTx.wait()
        setAlert(true)
        router.push(`/${wallet}/myproperties`)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
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

        setListPropertyData((data) => {
            data.rentalTerm = seconds
            return data
        })

        if (selectedPhotos.length !== 0) {
            const formData = new FormData()
            selectedPhotos.forEach((file, index) => {
                formData.append(`file_${index}`, file, `photo${index}.jpg`)
            })

            const hashesOfPhotosResponse = await fetch("/api/upload-property-photos", {
                method: "POST",
                body: formData,
                contentType: "multipart/form-data",
            }).then((response) => response.json())

            console.log("hashesOfPhotosResponse: ", hashesOfPhotosResponse)
            console.log("hashesOfPhotosResponse: ", hashesOfPhotosResponse.hashesOfPhotos)

            setListPropertyData((data) => {
                data.hashesOfPhotos = hashesOfPhotosResponse.hashesOfPhotos
                return data
            })
        }

        if (file) {
            const formData2 = new FormData()
            formData2.append("rentalTermsAndConditions", file, "rentalTermsAndConditions.pdf")

            const hashOfRentalTermsAndConditionsResponse = await fetch("/api/upload-terms-and-conditions", {
                method: "POST",
                body: formData2,
                contentType: "multipart/form-data",
            }).then((response) => response.json())

            console.log("hashOfRentalTermsAndConditions Response: ", hashOfRentalTermsAndConditionsResponse)
            console.log("hashOfRentalTermsAndConditions Response 2:  ", hashOfRentalTermsAndConditionsResponse.hash)

            setListPropertyData((data) => {
                data.hashOfRentalAggreement = hashOfRentalTermsAndConditionsResponse.hash
                return data
            })
        }

        await updateProperty(
            listPropertyData.name,
            listPropertyData.description,
            selectedProperty.propertyNftId,
            listPropertyData.rentalTerm,
            ethers.BigNumber.from(ethers.utils.parseUnits(listPropertyData.rentalPrice, 18)),
            ethers.BigNumber.from(ethers.utils.parseUnits(listPropertyData.depositAmount, 18)),
            listPropertyData.hashesOfPhotos,
            listPropertyData.hashOfRentalAgreement
        )
    }

    const handleRentalTermChange = (event) => {
        setRentalTermSeconds(event.target.value)
    }

    const handleNumDaysChange = (event) => {
        setNumDays(event.target.value)
    }
    const handlePhotosChange = (e) => {
        console.log("e.target.files: ", e.target.files)
        const files = Array.from(e.target.files)
        console.log("files: ", files)
        setSelectedPhotos(files)
    }
    const handleFileChange = (e) => {
        console.log("Rental Terms and Cond.:  e.target.files: ", e.target.files)
        const file = e.target.files[0]
        setFile(file)
    }

    return (
        <UpdateProperty
            {...{
                properties,
                alert,
                loading,
                listPropertyData,
                setListPropertyData,
                rentalTermSeconds,
                handleRentalTermChange,
                numDays,
                handleNumDaysChange,
                handlePhotosChange,
                handleFileChange,
                handleSubmit,
            }}
        />
    )
}
