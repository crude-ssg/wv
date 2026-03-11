import fs from "fs"
import path from "path"
import type { ViteDevServer } from "vite"

export default function plugin(options: { input: string; output: string }) {
    function generate() {
        const php = fs.readFileSync(options.input, "utf8")
        const lines: string[] = []

        // --- enums ---
        const enumRegex = /enum\s+(\w+):\s*(\w+)\s*{([\s\S]*?)}/g
        let m
        while ((m = enumRegex.exec(php)) !== null) {
            const [_, name, _type, body] = m
            const values = [...body.matchAll(/case\s+(\w+)\s*=\s*['"]?([^'";]+)['"]?;/g)]
                .map(x => `'${x[2]}'`).join(" | ")
            lines.push(`export type ${name} = ${values};\n`)
        }

        // --- classes (including those extending ApiData) ---
        const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?\s*{([\s\S]*?)}/g
        while ((m = classRegex.exec(php)) !== null) {
            const [_, name, body] = m
            const props = [...body.matchAll(/public\s+(\??\w+)\s+\$([\w_]+)(?:\s*=\s*[^;]+)?;/g)]
                .map(([_, type, key]) => {
                    const tsType = mapType(type)
                    return `  ${key}: ${tsType};`
                })
            lines.push(`export interface ${name} {\n${props.join("\n")}\n}\n`)
        }

        fs.mkdirSync(path.dirname(options.output), { recursive: true })
        fs.writeFileSync(options.output, lines.join("\n"))
    }

    function mapType(type: string): string {
        let nullable = false
        if (type.startsWith('?')) {
            nullable = true
            type = type.slice(1)
        }

        let tsType: string
        switch (type) {
            case 'int': tsType = 'number'; break
            case 'float': tsType = 'number'; break
            case 'string': tsType = 'string'; break
            case 'bool': tsType = 'boolean'; break
            default: tsType = type // enums or other classes
        }

        if (nullable) tsType += ' | null'
        return tsType
    }

    return {
        name: "vite-plugin-php-schema-to-ts",

        buildStart() {
            generate()
        },

        configureServer(server: ViteDevServer) {
            const file = path.resolve(options.input)
            server.watcher.add(file)
            server.watcher.on("change", changed => {
                if (path.resolve(changed) === file) generate()
            })
        }
    }
}