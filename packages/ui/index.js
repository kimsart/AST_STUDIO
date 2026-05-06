import BentoCard from './components/bento/BentoCard'
import BentoGrid from './components/bento/BentoGrid'
import BentoSectionHeader from './components/bento/BentoSectionHeader'
import * as motion from './components/bento/motion'

export function Button({ children, className = '' }) {
  return `<button class="px-4 py-2 bg-ast_blue text-white rounded hover:bg-ast_purple ${className}">${children}</button>`
}

export function Card({ children, className = '' }) {
  return `<div class="bg-white rounded-lg shadow-md p-6 ${className}">${children}</div>`
}

export { BentoCard, BentoGrid, BentoSectionHeader, motion }

export default { Button, Card, BentoCard, BentoGrid, BentoSectionHeader, motion }


