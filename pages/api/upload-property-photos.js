// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)
require("dotenv").config()
// const multiparty = require("multiparty")

import { IncomingForm } from "formidable"
import fs from "fs"

export default async function handler(req, res) {
    // const contentType = req.headers["content-type"]
    // console.log("contentType", contentType)
    // try {
    //     const form = new multiparty.Form()

    //     form.parse(req, (err, fields, files) => {
    //         if (err) {
    //             console.error("Error parsing form:", err)
    //             res.status(500).json({ error: "Error parsing form" })
    //             return
    //         }

    //         // Access the decoded file
    //         // const file = files.file
    //         console.log("files", files)
    //         console.log("files.file_0", files.file_0)
    //         console.log("files.file_0.buffer", files.file_0.buffer)
    //         // console.log("Decoded file:", file)
    //         // res.status(200).json({ message: "File decoded successfully" })
    //         const uploadPromises = Array.from(files).map(async (file) => {
    // const { IpfsHash } = await pinata.pinFileToIPFS(file.buffer)
    // return IpfsHash
    //         })
    //         Promise.all(uploadPromises).then((uploadedHashes) => {
    //             res.status(200).json({ hashes: uploadedHashes })
    //             console.log("Uploaded hashes: ", uploadedHashes)
    //         })
    //     })
    //     // const body = req.body
    //     // console.log("body: ", body)
    //     // console.log("start...")
    //     // const files = req.body.files
    //     // console.log("files: ", files)
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({ error: "An error occurred while uploading images to Pinata" })
    // }

    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Error parsing form:", err)
            res.status(500).json({ error: "Error parsing form" })
            return
        }

        // Access the decoded file
        const file = files.file_0
        console.log("Decoded files:", files)

        try {
            // Read the file as a buffer
            const fileBuffer = fs.createReadStream(file.filepath)
            const { IpfsHash } = await pinata.pinFileToIPFS(fileBuffer, {
                pinataMetadata: {
                    name: "File name",
                },
            })
            console.log("IpfsHash", IpfsHash)
        } catch (error) {
            console.error("Error pinning file to Pinata:", error)
            res.status(500).json({ error: "Error pinning file to Pinata" })
        }

        // Handle the file data here...

        res.status(200).json({ message: "File decoded successfully" })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
}
