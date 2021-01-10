
if [ -z "$TORCHJS_PYTORCH_VERSION" ]; then
    echo "TORCHJS_PYTORCH_VERSION not set --> using latest"
    TORCHJS_PYTORCH_VERSION="latest"
fi

BASE_URL="https://download.pytorch.org/libtorch"


function download () {
    wget $1 -O ./libtorch.zip
    unzip -o ./libtorch.zip
    rm -rf ./libtorch.zip
}

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    download "${BASE_URL}/cpu/libtorch-shared-with-deps-${TORCHJS_PYTORCH_VERSION}.zip"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    download "${BASE_URL}/cpu/libtorch-macos-${TORCHJS_PYTORCH_VERSION}.zip"
    wget "https://github.com/oneapi-src/oneDNN/releases/download/v0.20/mklml_mac_2019.0.5.20190502.tgz" -O ./libmklml.tgz
    tar -xvzf ./libmklml.tgz
    cp mklml_mac_2019.0.5.20190502/lib/* ./libtorch/lib/
    rm -rf ./mklml_mac_2019.0.5.20190502
fi


