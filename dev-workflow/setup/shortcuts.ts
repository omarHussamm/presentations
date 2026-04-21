import type { NavOperations, ShortcutOptions } from '@slidev/types'

export default function defineShortcutsSetup(nav: NavOperations, shortcuts: ShortcutOptions[]): ShortcutOptions[] {
  // Disable the Goto dialog (G key) — when open it gets stuck because the input
  // steals focus and prevents all shortcuts from firing, including G to close it.
  return shortcuts.map(s => s.name === 'goto' ? { ...s, fn: () => {} } : s)
}
