import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["gql/operations/*.ts", "gql/operations/*.graphql"],
  generates: {
    "gql/generated/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
      // plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
      hooks: { afterAllFileWrite: ["prettier --write"] },
    },
  },
}

export default config
