import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";

export function extractMessages() {
  const messages = new Map();
  const dynamic = [];
  for (const directory of ["components", "pages", "contexts", "data"]) {
    for (const name of readdirSync(directory).filter((name) =>
      /\.tsx?$/.test(name),
    )) {
      const path = `${directory}/${name}`;
      const source = ts.createSourceFile(
        path,
        readFileSync(path, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      );
      function visit(node) {
        if (
          ts.isCallExpression(node) &&
          node.expression.getText(source) === "l" &&
          node.arguments.length >= 2
        ) {
          const [fa, en] = node.arguments;
          if (
            ts.isStringLiteral(en) ||
            ts.isNoSubstitutionTemplateLiteral(en)
          ) {
            messages.set(en.text, ts.isStringLiteral(fa) ? fa.text : en.text);
          } else dynamic.push({ path, message: en.getText(source) });
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  for (const [en, fa] of Object.entries(
    JSON.parse(readFileSync("data/static-messages.json", "utf8")),
  ))
    messages.set(en, fa);
  return { messages, dynamic };
}

if (process.argv[1]?.endsWith("extract-messages.mjs")) {
  const { messages, dynamic } = extractMessages();
  console.log(JSON.stringify({ count: messages.size, dynamic }, null, 2));
}
