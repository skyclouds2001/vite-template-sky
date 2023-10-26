import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { formatPackageName, formatProjectName } from './format'
import { isEmptyDir } from './fs'
import { isValidPackageName, isValidProjectName } from './validate'

enum Framework {
  Vue = 'Vue',
  React = 'React',
}

const DEFAULT_NAME = 'vite-template-sky'

const cwd = process.cwd()

void (async function cli() {
  try {
    let dir = DEFAULT_NAME
    const response = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: DEFAULT_NAME,
          validate: (name) => isValidProjectName(name),
          onState: (data) => {
            dir = formatProjectName(data.value)
          },
        },
        {
          type: () => (fs.existsSync(dir) && !isEmptyDir(dir) ? 'confirm' : null),
          name: 'overwrite',
          message: `${dir === '.' ? 'Current' : 'Target'} dictionary is not empty, remove existing files and continue?`,
        },
        {
          type: 'text',
          name: 'packageName',
          message: 'Package name:',
          initial: () => (isValidPackageName(formatPackageName(dir)) ? formatPackageName(dir) : DEFAULT_NAME),
          validate: (name) => isValidPackageName(name),
        },
        {
          type: 'select',
          name: 'framework',
          message: 'Select a framework:',
          initial: 0,
          choices: [
            {
              title: 'Vue',
              value: Framework.Vue,
            },
            {
              title: 'React',
              value: Framework.React,
            },
          ],
        },
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled!')
        },
      }
    )

    const { framework, packageName, projectName, overwrite } = response

    console.log(framework, packageName, projectName, overwrite)

    const root = path.join(cwd, projectName)

    console.log(root)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log(error)
    }
  }
})()
