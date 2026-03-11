import fs from "fs"
import path from "path"
import type { ViteDevServer } from "vite"

export default function plugin(options: {
  input: string
  output: string
}) {

  function generate() {
    const php = fs.readFileSync(options.input, "utf8")

    const matches = [...php.matchAll(/class\s+(\w+)\s+extends\s+ApiError/g)]
    const errors = matches.map(m => m[1])

    const union = errors.map(e => `"${e}"`).join("\n  | ")

    const classes = errors
      .map(e => `export class ${e} extends ApiError {}`)
      .join("\n")

    const map = errors.join(",\n  ")

    const ts = `
export class ApiError extends Error {
  code?: number

  constructor(message: string, code?: number) {
    super(message)
    this.code = code
  }
}

export type ApiErrorType =
  | ${union}

export interface ApiErrorPayload {
  error: {
    type: ApiErrorType
    message: string
    code: number
  }
}

${classes}

export const errorMap = {
  ${map}
} as const
`

    fs.writeFileSync(options.output, ts)
  }

  return {
    name: "vite-plugin-php-api-errors-to-ts",

    buildStart() {
      generate()
    },

    configureServer(server: ViteDevServer) {
      const file = path.resolve(options.input)

      server.watcher.add(file)

      server.watcher.on("change", changed => {
        if (path.resolve(changed) === file) {
          generate()
        }
      })
    }
  }
}