import { createFetchable, fetcher, getAllAlbum, getPhotoId, getWeb } from "./lib/fetch";
import { writer } from "./lib/utils";
(async () => {
    const links = await (await Promise.all((await getWeb()).map(v => getAllAlbum(v)))).flat()
    for (const link of links) {
        console.log('Feteching ' + link)
        const v = await createFetchable(link)
        if (!v) {
            continue
        }
        writer(v)
    }
})()