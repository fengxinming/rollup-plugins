import { RenderedChunk, OutputOptions, SourceMap } from 'rollup'

declare function replaceImports(
  options: (str: string, i: number) => string | { replacement: (str: string, i: number) => string }
): {
  name: string,
  renderChunk: (code: string, chunk: RenderedChunk, options: OutputOptions) => string | { code: string, map: SourceMap } | null
}

export default replaceImports
