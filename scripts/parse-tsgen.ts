import * as commander from '@commander-js/extra-typings';
import { readFileSync } from 'fs';
import * as ts from 'typescript';

class ParseGenerator {
  sourceFile: ts.SourceFile;

  constructor(inputFile: string, outDir: string) {
    this.sourceFile = ts.createSourceFile(
      inputFile,
      readFileSync(inputFile).toString(),
  
      // TODO: Read from tsconfig.json
      ts.ScriptTarget.ES2023,
      /* setParentNodes */ true
    );
  }

  public generate() {
    this.visitNode(this.sourceFile);
  }

  private visitNode(node: ts.Node) {
    switch(node.kind) {
      case ts.SyntaxKind.InterfaceDeclaration:
        const interfaceDecl = node as ts.InterfaceDeclaration;
        interfaceDecl.
    }
  }
}

function visit(node: ts.Node) {
  switch(node.kind) {
    case ts.SyntaxKind.InterfaceDeclaration:

  }
  console.log(node.getText());
}

function generate(inputFile: string, outDir: string) {
  const sourceFile = 

  visit(sourceFile);
}

const program = new commander.Command()
  .argument('<input-file>')
  .option('--outDir <dir>', 'Specify an output folder for all emitted files.')
  .action((inputFile, options) => {
    new ParseGenerator(inputFile, options.outDir ?? './');
  });

program.parseAsync();
