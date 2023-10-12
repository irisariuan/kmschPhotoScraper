import { JSDOM } from 'jsdom'
import { clearLastLine, getDateFromURL } from './lib/utils'
import { readFileSync, writeFileSync } from 'fs'

const link = 'https://www2.kmsch.edu.hk/html/200983115533-2/?p=html'
export async function getAlbumIds(url: string): Promise<string[]> {
    const dom = new JSDOM(await (await fetch(url)).text(), { url, runScripts: 'dangerously' })
    writeFileSync('./test.html', dom.serialize())
    const el = dom.window.document.querySelectorAll<HTMLAnchorElement>('a.node')
    for (const i of el.values()) {
        console.log(i.href)
    }
    console.log(el.length)
    const result: string[] = []
    el.forEach((v) => {
        console.log(v.href)
        const link = getDateFromURL(v.href)
        if (link) {
            result.push(link)
        }
    })
    return result
}
const r = []
for (const [i, _] of readFileSync('./test.txt', {encoding: 'utf-8'}).matchAll(/(?<=content\/)([0-9]+)/g)) {
    console.log(i)
    r.push(i)
    process.stdout.moveCursor(0, -1)
}
writeFileSync('./test.json', JSON.stringify(r.map(v => 'https://www2.kmsch.edu.hk/html/200983115533-2/?p=html&path=content/' + v)))