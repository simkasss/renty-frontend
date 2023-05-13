const { NFTStorage, File } = require("nft.storage")
// The 'mime' npm package helps us set the correct file type on our File objects
require("dotenv").config()
const mime = require("mime")
const fs = require("fs")
const path = require("path")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))
const NFTSTORAGE_API_KEY = process.env.NFTSTORAGE_API_KEY

//SOURCE: https://nft.storage/docs/how-to/mint-erc-1155/

export default async function handler(req, res) {
    const propertyNftData = JSON.parse(req.body)
    console.log("propertyNftData", propertyNftData)

    const nftTokenURI = await uploadPropertyNftToStorage(propertyNftData)

    res.status(201).json({ nftTokenURI })
}

async function uploadPropertyNftToStorage(_propertyNftData) {
    // create a new NFTStorage client using API key
    const nftstorage = new NFTStorage({ token: NFTSTORAGE_API_KEY })
    const image = await fileFromPath("utils/house.jpeg")
    // call client.store, passing in the metadata
    const nft = {
        name: "Property NFT",
        image,
        ownerName: _propertyNftData.ownerName,
        description: "NFT that represents a property",
        address: _propertyNftData.address,
        countryCode: _propertyNftData.countryCode,
        // Custom - if LT, tai registrų centro objekto numeris
    }
    const metadata = await nftstorage.store(nft)
    console.log("NFT data stored! Metadata URI: ", metadata.url)

    return metadata.url //returns TokenURI (ipfs://)
}

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}
