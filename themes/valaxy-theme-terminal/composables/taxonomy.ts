export interface CategoryEntry {
  label: string
  path: string
}

// Valaxy 分类数组表示逐层目录，查询参数保留原来的斜杠连接路径。
export function categoryTrail(value: unknown): CategoryEntry[] {
  const labels = (Array.isArray(value) ? value : [value])
    .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
  return labels.map((label, index) => ({ label, path: labels.slice(0, index + 1).join('/') }))
}

// 目录边界必须是斜杠，避免把 k8s-other 算进 k8s。
export function matchesCategory(value: unknown, path: string): boolean {
  const trail = categoryTrail(value)
  const fullPath = trail.at(-1)?.path || ''
  return !!path && (fullPath === path || fullPath.startsWith(`${path}/`))
}
