import kleur from 'kleur'

/**
 * framework base type
 */
export interface FrameWork {
  name: string
  template: string
  color: kleur.Color
}

/**
 * frameworks enum
 */
export const frameworks: FrameWork[] = [
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
