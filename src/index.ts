import kleur from 'kleur'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import prompts from 'prompts'
import { simpleGit } from 'simple-git'
import { frameworks, type FrameWork } from './framework'
import { IGNORES, clearDir, copy, isEmptyDir } from './fs'
import { PackageManager, getPackageManager } from './package'
import { isValidPackageName, isValidProjectName } from './validate'

const DEFAULT_NAME = 'vite-template-sky'

const OVERRIDE_NAME_FILE = ['./README.md']

const logger = global.console

const cwd = process.cwd()

const argv = minimist<{
  framework?: string
  pkg?: string
}>(process.argv.slice(2), {
  string: ['_', 'framework', 'pkg'],
  alias: { f: 'framework' },
})

void (async function cli() {
  try {
    const argvProjectName = typeof argv._[0] === 'string' && isValidProjectName(argv._[0]) ? argv._.at(0) : null
    const argvPackageName = typeof argv._[1] === 'string' && isValidPackageName(argv._[1]) ? argv._.at(1) : null
    const argvFramework = argv.framework ?? null
    const argvPackageManager = Object.values(PackageManager).includes(argv.pkg as PackageManager) ? argv.pkg : getPackageManager(process.env.npm_config_user_agent ?? '')

    let dir = DEFAULT_NAME
    const {
      framework = argvFramework,
      packageName = argvPackageName,
      projectName = argvProjectName,
      packageManager = argvPackageManager,
    } = await prompts(
      [
        {
          type: () => (argvProjectName != null ? null : 'text'),
          name: 'projectName',
          message: 'Project name:',
          initial: DEFAULT_NAME,
          validate: (name) => isValidProjectName(name),
          onState: (data) => {
            dir = data.value
          },
        },
        {
          type: () => (argvPackageName != null ? null : 'text'),
          name: 'packageName',
          message: 'Package name:',
          initial: () => (isValidPackageName(dir) ? dir : DEFAULT_NAME),
          validate: (name) => isValidPackageName(name),
        },
        {
          type: () => (argvFramework != null && frameworks.map((framework) => framework.name).includes(argvFramework) ? null : 'select'),
          name: 'framework',
          message: 'Select a framework:',
          initial: 0,
          choices: frameworks.map((framework) => ({
            title: framework.color(framework.name),
            value: framework.name,
          })),
        },
        {
          type: 'select',
          name: 'packageManager',
          message: 'Select a package manager:',
          initial: 0,
          choices: Object.values(PackageManager).map((pm) => ({
            title: pm,
            value: pm,
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
    const root = path.join(cwd, projectName)

    // check if the target dictionary is not an empty dictionary
    // if so, prompt to let user decide whether overwrite the target dictionary
    // if user decide to overwrite, clear the target dictionary; if not, exit the process
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
    const template = (frameworks.find((f) => f.name === framework) as FrameWork).template
    const templateDir = path.resolve(url.fileURLToPath(import.meta.url), '../..', template)

    // copy template project to target
    for (const file of fs.readdirSync(templateDir)) {
      if (IGNORES.includes(file)) {
        continue
      }

      copy(path.resolve(templateDir, file), path.resolve(root, file))
    }

    // travel each file that need to update package name
    for (const file of OVERRIDE_NAME_FILE) {
      // read file content
      let content = fs.readFileSync(path.resolve(root, file), 'utf-8')

      // overwrite the name field
      content = content.replaceAll(DEFAULT_NAME, packageName)

      // write file content
      fs.writeFileSync(path.resolve(root, file), content)
    }

    // read package.json file content to do some edits
    const pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))

    // overwrite package.json name field
    pkg.name = packageName
    pkg.version = '0.0.0'

    // write package.json file content to do some edits
    fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

    // init git config
    await simpleGit({
      baseDir: root,
    }).init()

    // print prompt message
    logger.log()
    logger.log('Done.')
    logger.log()
    logger.log('Now run:')
    if (cwd !== root) {
      logger.log(`  cd ${projectName}`)
    }
    switch (packageManager) {
      case PackageManager.PNPM:
        logger.log('  pnpm install')
        logger.log('  pnpm dev')
        break
      case PackageManager.YARN:
        logger.log('  yarn')
        logger.log('  yarn dev')
        break
      case PackageManager.NPM:
        logger.log('  npm install')
        logger.log('  npm run dev')
        break
    }
    logger.log()
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    } else {
      logger.error(error)
    }
  }
})()
