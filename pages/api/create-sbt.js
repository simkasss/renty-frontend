// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)
require("dotenv").config()

export default async function handler(req, res) {
    const sbtData = JSON.parse(req.body)
    console.log("SbtData: ", sbtData)

    const sbtDataHash = await uploadSBTDataToIPFS(sbtData)

    res.status(201).json({ sbtDataHash })
}

async function uploadSBTDataToIPFS(sbtData) {
    const metadata = {
        name: sbtData.name,
        description: "Soulbound Token that represents a tenant",
    }

    console.log(`Uploading metadata...`)
    const metadataUploadResponse = await storeMetadata(metadata)
    const dataHash = metadataUploadResponse.IpfsHash

    console.log("Uploaded data hash: ", dataHash)

    return dataHash
}

async function storeMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }

    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
