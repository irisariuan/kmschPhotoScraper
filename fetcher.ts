import { readFileSync, writeFile, existsSync, mkdirSync } from 'fs'
import { Fetchable, createFetchable, fetcher, getPhotoId } from './lib/fetch'
import { createSpinner } from 'nanospinner'
import { savableName, writer } from './lib/utils'
import confirms from '@inquirer/confirm'
import chalk from 'chalk'

(async () => {
    let link: { links: string[] } = JSON.parse(readFileSync('./link.json', 'utf8'))
    const useTest = await confirms({ message: 'Would you like to use test.json as fetch origin?', default: false })
    if (useTest) {
        link = { links: JSON.parse(readFileSync('./test.json', { encoding: 'utf8' })) }
    }

    const spinner = createSpinner().start()
    await Promise.all(link.links.map(async (v, i) => {
        spinner.start({ text: `Fetching ${v} [${i + 1}/${link.links.length}]` })
        const f = await createFetchable(v)
        if (!f) {
            spinner.warn({ text: 'Failed to fetch ' + v })
            return
        }
        spinner.success({ text: 'Got Photo IDs sucessfully!' })
        process.stdout.moveCursor(0, -1)
        process.stdout.clearScreenDown()
        await writer(f)
    }))
    process.stdout.moveCursor(0, link.links.length * -3)
    process.stdout.clearScreenDown()
    console.log('✅ All Finished!')
    console.log('Downloaded ' + link.links.map(v => chalk.underline(v)).join(', '))
})()