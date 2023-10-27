import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { formatPackageName, formatProjectName } from './format'
import { IGNORES, clearDir, copy, isEmptyDir } from './fs'
import { isValidPackageName, isValidProjectName } from './validate'
import url from 'node:url'

enum Framework {
  Vue = 'Vue',
  React = 'React',
}

const DEFAULT_NAME = 'vite-template-sky'

const cwd = process.cwd()

void (async function cli() {
  try {
    let dir = DEFAULT_NAME
    const { framework, packageName, projectName } = await prompts(
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

    // generate the target dictionary path
    const root = path.join(cwd, formatProjectName(projectName))

    // check if the target dictionary is not an empty dictionary
    // if so, prompt to let user decide whether overwrite the target dictionary
    // if user decide to overwrite, clear the target dictionary; or if not, exit the process
    if (fs.existsSync(root) && !isEmptyDir(root)) {
      const { overwrite } = await prompts([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `${root === __dirname ? 'Current' : 'Target'} dictionary is not empty, remove existing files and continue?`,
        },
      ])

      if (overwrite as boolean) {
        clearDir(root)
      } else {
        throw new Error('Operation cancelled!')
      }
    }

    // create target dictionary if it doesn't existed
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }

    // get the template dictionary name
    let template: string
    switch (framework as Framework) {
      case Framework.Vue:
        template = 'vite-vue-template-sky'
        break
      case Framework.React:
        template = 'vite-react-template-sky'
        break
    }
    const templateDir = path.resolve(url.fileURLToPath(import.meta.url), '../..', template)

    // copy template project to target
    for (const file of fs.readdirSync(templateDir)) {
      if (IGNORES.includes(file) && fs.existsSync(path.resolve(root, file))) {
        continue
      }

      if (file === 'node_modules') {
        continue
      }

      copy(path.resolve(templateDir, file), path.resolve(root, file))
    }

    // overwrite package.json name field
    const pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))
    pkg.name = formatPackageName(packageName)
    fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

    // print message
    console.log('Done.')
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log(error)
    }
  }
})()
