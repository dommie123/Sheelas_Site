const configs = {
    "localUrl": "http://10.0.0.240:5000",
    // "localUrl": "http://192.168.215.188:5000",
    "devUrl": "http://10.0.0.252:5000",  // TODO choose different URL for dev
    "prodUrl": "http://10.0.0.252:5000"  // TODO choose different URL for prod
}

const determineBackendURL = () => {
    const frontendUrl = window.location.href;

    if (frontendUrl.includes("localhost" || frontendUrl.includes("10.0.0.252"))) {
        return configs.localUrl;
    }

    const urlParts = frontendUrl.split(".");

    let isProd = false;
    urlParts.forEach(part => {
        if (!part.match("[0-9]+")) {
            isProd = true;
            return;
        }
    })

    if (isProd) {
        return configs.prodUrl;
    } else {
        return configs.devUrl;
    }
}

export { determineBackendURL }