import { JSDOM } from 'jsdom'
import { createSpinner } from 'nanospinner'
import { getDateFromURL } from './utils'

export interface Fetchable {
    date: string,
    photoId: string[]
}

export const LINK = atob('aHR0cHM6Ly93d3cyLmttc2NoLmVkdS5oay9odG1sLzIwMDk4MzExNTUzMy0yL2NvbnRlbnQv')

export function createLink(photoId: string, date: string): string {
    return LINK + date + '/' + encodeURIComponent(photoId).replaceAll('%2B', '%20')
}

export async function getPhotoId(url: string): Promise<string[]> {
    const dom = new JSDOM(await (await fetch(url)).text(), { url })
    const el = dom.window.document.getElementById("thumbnails")
    if (!el) return []
    return Array.from(el.children).map(v => (v as HTMLAnchorElement).href.slice(83))
}

export async function createFetchable(url: string): Promise<Fetchable | null> {
    const date = getDateFromURL(url)
    if (!date) {
        return null
    }
    return {
        date,
        photoId: await getPhotoId(url)
    }
}

export async function fetcher(f: Fetchable) {
    console.log('Fetching photos...')
    const spinner = createSpinner().start()
    const p: [string, Buffer][] = []
    let index = 0
    for (const i of f.photoId) {
        index++
        let link = LINK + f.date + '/' + encodeURIComponent(i).replaceAll('%2B', '%20')
        spinner.start({ text: `Downloading ${link} [${index}/${f.photoId.length}]` })
        p.push([i, Buffer.from(await ((await fetch(link)).arrayBuffer()))])
    }
    spinner.success({ text: 'Done!' })
    return p
}

export async function getWeb() {
    const url = 'https://www2.kmsch.edu.hk/html/album.php?year_t=16&album=1'
    const dom = new JSDOM(await (await fetch(url)).text(), { url })
    return Array.from(dom.window.document.querySelector('select#select')?.childNodes ?? []).map((v) => (v as HTMLOptionElement)?.value?.replaceAll('http://www', 'https://www2')).filter(v => !!v)
}

export async function getAllAlbum(url: string) {
    const dom = new JSDOM(await (await fetch(url)).text(), { url })
    return Array.from(dom.window.document.querySelectorAll('a')).map(v => v.href).filter(v => v.startsWith('https://www.kmsch.edu.hk') && !v.endsWith('.php')).map(v => v.replaceAll('www', 'www2'))
}