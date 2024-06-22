export const createFileFromPath = async (path, name, type) => {
    const response = await fetch(path);
    const data = await response.blob();
    const metadata = {
        type: type
    };

    return new File([data], name, metadata);
}