# vite-template-sky

An opinionated vite starter template for vue or react with a cli to generate template project.

## Usage

Using npm to initialize a project

```sh
npx @sky-fly/vite-template
```

Can passing one cli option as the project name, this will be used to decide the folder where the generated project template will be placed.

```sh
npx @sky-fly/vite-template project
```

Can also passing another cli option as the package name, this will be used to overwrite in the project.

```sh
npx @sky-fly/vite-template project project
```

Available named cli options is shown below:

| Name                     | Default | Type                    | Description                                            |
| ------------------------ | ------- | ----------------------- | ------------------------------------------------------ |
| _--template_ _-t_        | -       | `'vue'\|'react'`        | decide the template the project is intended to use     |
| _--package-manager_ _-p_ | -       | `'npm'\|'yarn'\|'pnpm'` | decide the package manager the project is going to use |

## Changelog

[Changelog](CHANGELOG.md)

## Contribution

[Contribution](CONTRIBUTING.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Code of Conduct

[Code of Conduct](CODE_OF_CONDUCT.md)

## License

[MIT](LICENSE) © skyclouds2001
