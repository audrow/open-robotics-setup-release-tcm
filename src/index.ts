import getSitePages from './get-site-pages'
import makeIssues from './make-issues'
import {createIssues, closeGeneratedIssues, getUser, getIssues} from './gh-api'

import type Repo from './__types__/Repo'

async function main() {
  const distro = 'rolling'
  const baseUrl = 'https://docs.ros.org/en/'
  const sections: string[] = ['Install', 'Tutorials', 'How-to-guide']
  const platforms = ['ubuntu', 'windows']
  const repo: Repo = {
    owner: 'audrow',
    name: 'humble-tcm-example',
  }
  const isCloseGeneratedIssues = false
  const generatedStamp = `> generated by @${await getUser()} with [this](https://github.com/audrow/open-robotics-setup-release-tcm) code`

  const pages = await getSitePages(distro, baseUrl, sections)
  const possibleIssues = makeIssues(pages, platforms, generatedStamp)

  const existingIssues = (await getIssues(repo, 'open')).map((i) => i.title)
  const newIssues = possibleIssues.filter(
    (i) => !existingIssues.includes(i.title),
  )

  await createIssues(repo, newIssues)

  if (isCloseGeneratedIssues) {
    await closeGeneratedIssues(repo, generatedStamp)
  }
}
if (typeof require !== 'undefined' && require.main === module) {
  main()
}