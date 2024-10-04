import kleur from 'kleur'

/**
 * template base type
 */
export interface Template {
  name: string
  template: string
  color: kleur.Color
}

/**
 * templates enum
 */
export const templates: Template[] = [
  {
    name: 'vue',
    template: 'vite-vue-template-sky',
    color: kleur.green,
  },
  {
    name: 'react',
    template: 'vite-react-template-sky',
    color: kleur.blue,
  },
]

/**
 * validate if a template name is valid and supported one
 * @param name package manager name
 * @returns validation result
 */
export function isValidTemplateName(name: string): boolean {
  return Object.values(templates).some((template) => template.name === name)
}
