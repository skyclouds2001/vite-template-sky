import kleur from 'kleur'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import prompts from 'prompts'
import { formatPackageName, formatProjectName } from './format'
import { IGNORES, clearDir, copy, isEmptyDir } from './fs'
import { isValidPackageName, isValidProjectName } from './validate'

enum Frameworks {
  Vue = 'Vue',
  React = 'React',
}

interface FrameWork {
  name: Frameworks
  template: string
  color: kleur.Color
}

const frameworks: Record<Frameworks, FrameWork> = {
  [Frameworks.Vue]: {
    name: Frameworks.Vue,
    template: 'vite-vue-template-sky',
    color: kleur.green,
  },
  [Frameworks.React]: {
    name: Frameworks.React,
    template: 'vite-react-template-sky',
    color: kleur.blue,
  },
}

const DEFAULT_NAME = 'vite-template-sky'

const cwd = process.cwd()

const argv = minimist<{
  f?: string
  framework?: string
}>(process.argv.slice(2), {
  string: ['_', 'f', 'framework'],
})

void (async function cli() {
  try {
    const argvProjectName = typeof argv._[0] === 'string' && isValidProjectName(formatProjectName(argv._[0])) ? formatProjectName(argv._[0]) : null
    const argvPackageName = typeof argv._[1] === 'string' && isValidPackageName(formatPackageName(argv._[1])) ? formatPackageName(argv._[1]) : null
    const argvFramework = argv.f ?? argv.framework ?? null

    let dir = DEFAULT_NAME
    const { framework, packageName, projectName } = await prompts(
      [
        {
          type: () => (argvProjectName != null ? null : 'text'),
          name: 'projectName',
          message: 'Project name:',
          initial: DEFAULT_NAME,
          validate: (name) => isValidProjectName(name),
          onState: (data) => {
            dir = formatProjectName(data.value)
          },
        },
        {
          type: () => (argvPackageName != null ? null : 'text'),
          name: 'packageName',
          message: 'Package name:',
          initial: () => (isValidPackageName(formatPackageName(dir)) ? formatPackageName(dir) : DEFAULT_NAME),
          validate: (name) => isValidPackageName(name),
        },
        {
          type: () => (argvFramework != null ? null : 'select'),
          name: 'framework',
          message: 'Select a framework:',
          initial: 0,
          choices: Object.values(frameworks).map((framework) => ({
            title: framework.name,
            value: framework.name,
          })),
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${kleur.red('✖')} Operation cancelled!`)
        },
      }
    )

    // generate the target dictionary path
    const root = path.join(cwd, formatProjectName(projectName ?? argvProjectName))

    // check if the target dictionary is not an empty dictionary
    // if so, prompt to let user decide whether overwrite the target dictionary
    // if user decide to overwrite, clear the target dictionary; or if not, exit the process
    if (fs.existsSync(root) && !isEmptyDir(root)) {
      const { overwrite } = await prompts(
        [
          {
            type: 'confirm',
            name: 'overwrite',
            message: `${root === __dirname ? 'Current' : 'Target'} dictionary is not empty, remove existing files and continue?`,
          },
        ],
        {
          onCancel: () => {
            throw new Error(`${kleur.red('✖')} Operation cancelled!`)
          },
        }
      )

      if (overwrite as boolean) {
        clearDir(root)
      } else {
        throw new Error(`${kleur.red('✖')} Operation cancelled!`)
      }
    }

    // create target dictionary if it doesn't existed
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }

    // get the template dictionary name
    let template: string
    switch ((framework ?? argvFramework) as Frameworks) {
      case Frameworks.Vue:
        template = frameworks[Frameworks.Vue].template
        break
      case Frameworks.React:
        template = frameworks[Frameworks.React].template
        break
    }
    const templateDir = path.resolve(url.fileURLToPath(import.meta.url), '../..', template)

    // copy template project to target
    for (const file of fs.readdirSync(templateDir)) {
      if (IGNORES.includes(file) && fs.existsSync(path.resolve(root, file))) {
        continue
      }

      copy(path.resolve(templateDir, file), path.resolve(root, file))
    }

    // overwrite package.json name field
    const pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))
    pkg.name = formatPackageName(packageName ?? argvPackageName)
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
