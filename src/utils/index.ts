export const fileExtensionURL = (fileName: string, slug: string) => {
    const fileExtension = fileName.split('.').pop()

    return `${slug}.${fileExtension}`
}
