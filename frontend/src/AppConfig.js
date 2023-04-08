const configs = {
    "localUrl": "http://localhost:8000",
    "devUrl": "http://localhost:8000",  // TODO choose different URL for dev
    "prodUrl": "http://localhost:8000"  // TODO choose different URL for prod
}

const determineBackendURL = () => {
    const frontendUrl = window.location.href;

    if (frontendUrl.includes("localhost")) {
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