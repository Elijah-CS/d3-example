module.exports = {
    presets: [
        "react-app",
        "@babel/preset-env",
        [
            "@babel/preset-react",
            {
                runtime: "automatic",
            },
        ],
    ],
};