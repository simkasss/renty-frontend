// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)
require("dotenv").config()

export default async function handler(req, res) {
    const propertyData = JSON.parse(req.body)
    console.log("propertyData", propertyData)
    const propertyDataHash = await uploadPropertyDataToIPFS(propertyData)
    res.status(201).json({ propertyDataHash })
}

async function uploadPropertyDataToIPFS(propertyData) {
    const metadata = {
        name: "Property Details",
        area: propertyData.area,
        numberOfRooms: propertyData.numberOfRooms,
        floor: propertyData.floor,
        buildYear: propertyData.buildYear,
    }

    console.log(`Uploading metadata...`)
    const metadataUploadResponse = await storeMetadata(metadata)
    console.log("response", metadataUploadResponse)
    const dataHash = metadataUploadResponse.IpfsHash

    console.log("uploaded data hash: ", dataHash)

    return dataHash
}

async function storeMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    } // why is this needed?

    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
