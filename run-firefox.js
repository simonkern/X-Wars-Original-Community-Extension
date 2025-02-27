import "dotenv/config"
import process from "process"

import { spawn } from "child_process"

function indentLinebreak(data) {
    return data.toString().replaceAll("\n", "\n  ").trim()
}

const webextParameters = ["web-ext", "run", "-s", "build/"]

if (process.env.PATH_TO_FF_PROFILE)
    webextParameters.push(
        ...[
            "--firefox-profile",
            process.env.PATH_TO_FF_PROFILE,
            "--keep-profile-changes",
            "--pref=signon.rememberSignons=true",
            "--pref=browser.startup.homepage=https://original.xwars.net/login.php?",
        ]
    )

const build = spawn(
    "npx",
    [
        "node",
        "--loader",
        "ts-node/esm",
        "esbuild.ts",
        "--watch",
        "--development",
    ],
    {
        stdio: "pipe",
    }
)
const webExt = spawn("npx", webextParameters, {
    stdio: "pipe",
})

build.stdout.setEncoding("utf8")
build.stdout.on("data", (data) =>
    console.log(`build: ${indentLinebreak(data)}`)
)
build.stderr.setEncoding("utf8")
build.stderr.on("data", (data) =>
    console.log(`build: ${indentLinebreak(data)}`)
)
build.on("error", (error) => console.log(`build: error: ${error.message}`))

webExt.stdout.setEncoding("utf8")
webExt.stdout.on("data", (data) =>
    console.log(`web-ext: ${indentLinebreak(data)}`)
)
webExt.stderr.setEncoding("utf8")
webExt.stderr.on("data", (data) =>
    console.log(`web-ext: ${indentLinebreak(data)}`)
)
webExt.on("error", (error) => console.log(`web-ext: error: ${error.message}`))
