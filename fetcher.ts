import { readFileSync, writeFile, existsSync, mkdirSync } from 'fs'
import { Fetchable, createFetchable, fetcher, getPhotoId } from './lib/fetch'
import { createSpinner } from 'nanospinner'
import { savableName } from './lib/utils'
import confirms from '@inquirer/confirm'
import chalk from 'chalk'

async function writer(f: Fetchable) {
    const dir = './out/' + f.date
    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
    console.log(chalk.magenta.bold('Downloading album ' + f.date))
    for (const [name, buf] of await fetcher(f)) {
        writeFile(dir + '/' + savableName(name), buf, () => { })
    }
}
(async () => {
    let link: { links: string[] } = JSON.parse(readFileSync('./link.json', 'utf8'))
    const useTest = await confirms({ message: 'Would you like to use test.json as fetch origin?', default: false })
    if (useTest) {
        link = { links: JSON.parse(readFileSync('./test.json', { encoding: 'utf8' })) }
    }

    const spinner = createSpinner().start()
    Promise.all(link.links.map(async (v, i) => {
        spinner.start({ text: `Fetching ${v} [${i + 1}/${link.links.length}]` })
        const f = await createFetchable(v)
        spinner.success({ text: 'Got Photo IDs sucessfully!' })
        process.stdout.moveCursor(0, -1)
        process.stdout.clearScreenDown()
        await writer(f)
    })).then(() => {
        process.stdout.moveCursor(0, link.links.length * -3)
        process.stdout.clearScreenDown()
        console.log('✅ All Finished!')
        console.log('Downloaded ' + link.links.map(v => chalk.underline(v)).join(', '))
    })
})()