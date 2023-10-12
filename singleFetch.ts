import { readFileSync, writeFile } from 'fs'

const j: { link: string, photoId: string[], date: string } = JSON.parse(readFileSync('./test.json', { encoding: 'utf8' }))
console.log(j.link + j.date + '/' + j.photoId[0])
fetch(j.link + j.date + '/' + j.photoId[0]).then(async v => {
    writeFile('./out/' + j.photoId[0].toLowerCase(), Buffer.from(await v.arrayBuffer()), () => {})
}).catch(r => console.log('Download failed, reason: ' + r))
