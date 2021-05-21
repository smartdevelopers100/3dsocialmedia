export const getFileSizeInText = size => {
    const sizeExts = ["B", "KB", "MB", "GB"];
    let i = 0;
    while(size >= 1024)
    {
        size /= 1024;
        i += 1;
    }

    const intSize = parseInt(size);
    if(size === intSize)
    {
        return `${size}${sizeExts[i]}`;
    }
    return `${size.toFixed(1)}${sizeExts[i]}`;
}

export const getFileType = type => {
    if(/image/.test(type))
        return "Image";

    if(/audio/.test(type))
        return "Audio";

    if(/video/.test(type))
        return "Video";

    return "File";
}