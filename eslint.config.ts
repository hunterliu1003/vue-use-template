import antfu from '@antfu/eslint-config'

export default antfu({
  /** The pnpm rules move settings into pnpm-workspace.yaml, which pnpm 8 (pinned in packageManager) ignores. */
  pnpm: false,
})
