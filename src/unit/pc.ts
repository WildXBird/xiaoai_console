
export async function OpenLink(url: string) {
    try {
        const response = await fetch(`http://192.168.1.121:15349?url=${url}`, {
            method: 'GET', headers: {}
        })
    } catch (error) {

    }

}

