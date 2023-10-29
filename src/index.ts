import kleur from 'kleur'
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import prompts from 'prompts'
import { IGNORES, clearDir, copy, isEmptyDir } from './fs'
import { isValidPackageName, isValidProjectName } from './validate'
import { PackageManager, getPackageManager } from './package'
import { type FrameWork, frameworks } from './framework'

const DEFAULT_NAME = 'vite-template-sky'

const logger = global.console

const cwd = process.cwd()

const packageManager = getPackageManager(process.env.npm_config_user_agent ?? '')

const argv = minimist<{
  f?: string
  framework?: string
}>(process.argv.slice(2), {
  string: ['_', 'f', 'framework'],
})

void (async function cli() {
  try {
    const argvProjectName = typeof argv._[0] === 'string' && isValidProjectName(argv._[0]) ? argv._[0] : null
    const argvPackageName = typeof argv._[1] === 'string' && isValidPackageName(argv._[1]) ? argv._[1] : null
    const argvFramework = argv.f ?? argv.framework ?? null

    let dir = DEFAULT_NAME
    const {
      framework = argvFramework,
      packageName = argvPackageName,
      projectName = argvProjectName,
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
    const template = (frameworks.find((f) => f.template === framework) as FrameWork).template
    const templateDir = path.resolve(url.fileURLToPath(import.meta.url), '../..', template)

    // copy template project to target
    for (const file of fs.readdirSync(templateDir)) {
      if (IGNORES.includes(file) && fs.existsSync(path.resolve(root, file))) {
        continue
      }

      copy(path.resolve(templateDir, file), path.resolve(root, file))
    }

    // read package.json file content to do some edits
    const pkg = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'))

    // overwrite package.json name field
    pkg.name = packageName

    // write package.json file content to do some edits
    fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

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
