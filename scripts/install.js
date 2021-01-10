const spawn = require('child_process').spawn;

// install libtorch
// use environment variables to determine the version
// also determine the os
// if its a mac we also probably have to install libmklml and some other shit.

// configuration variables 
const TORCHJS_PYTORCH_VERSION       = process.env.TORCHJS_PYTORCH_VERSION || 'latest'
const TORCHJS_USE_GPU               = process.env.TORCHJS_USE_GPU ;
const TORCHJS_LIBTORCH_DOWNLOAD_URL = process.env.TORCHJS_LIBTORCH_DOWNLOAD
const TORCHJS_LIBTORCH_PATH         = process.env.TORCHJS_LIBTORCH_PATH

function shell(cmd, args){
    console.log(`spawn: ${cmd} ${args.join(" ")}`)
    return new Promise(function(resolve, reject) {
        const proc = spawn(cmd, args) ;
        proc.stdout.on("data", d => console.log(d.toString()))
        proc.stderr.on("data", d => console.log(d.toString()))
        proc.on("close", resolve)
        proc.on("error", reject)
    })
}

function wget(url, out) {
    return shell("wget", [url, "-O", "./libtorch.zip"])
}

/**
    Returns a download url for libtorch based on the user's OS and desired torch version.
    Context: If the user does not explicitly supply libtorch via a url or via a libtorch path
    we will try to pull an appropriate version of libtorch from the pytorch website.
*/
function getLibtorchDownloadUrl() {
    const downloadBaseUrl = `https://download.pytorch.org/libtorch` ;
    switch (process.platform) {
	case "darwin": 
            return `${downloadBaseUrl}/cpu/libtorch-macos-${TORCHJS_PYTORCH_VERSION}.zip` ; 
        case "linux":
            return `${downloadBaseUrl}/cpu/libtorch-shared-with-deps-${TORCHJS_PYTORCH_VERSION}.zip`
	default:
	    console.log("Unsupported OS! You may have to supply libtorch explicitly...") ;
            process.exit(1) ;
    }
}

async function run() {
    // User is telling us where to find libtorch. No work for us. Cool!
    if (TORCHJS_LIBTORCH_PATH) {
        console.log("User supplied libtorch")
        pass
    // If user supplies a download url, we don't need to infer the user's OS. 
    } else if (TORCHJS_LIBTORCH_DOWNLOAD_URL != null) {
        const downloadUrl = TORCHJS_LIBTORCH_DOWNLOAD_URL
        await wget(downloadUrl)
        await shell("unzip", ["-o", "./libtorch.zip"])
        await shell("rm", ["-rf", "./libtorch.zip"])
    } else {
        const downloadUrl = getLibtorchDownloadUrl()
        await wget(downloadUrl)
        await shell("unzip", ["-o", "./libtorch.zip"])
        await shell("rm", ["-rf", "./libtorch.zip"])
    }
}

run()
