const path = require("path")

module.exports = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        // Set up aliases
        config.resolve.alias["@"] = path.join(__dirname)

        // Set up CSS modules
        config.module.rules.push({
            test: /\.module\.css$/,
            use: [
                isServer ? "css-loader/locals" : "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        localIdentName: "[local]__[hash:base64:5]",
                        sourceMap: !isServer,
                    },
                },
            ],
        })

        return config
    },
}
