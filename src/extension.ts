import * as vscode from "vscode";
import { InputSchemaGenerator } from "./api/input";
import generateOutputSchema from "./api/output/outputSchema";
import { OutputSchemaGenerator } from "./api/output";

const insertText = (text: string) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit(edit => {
      editor.selections.forEach(selection => {
        edit.delete(selection);
        edit.insert(selection.start, text);
      });
    });
  }
};

export function activate(context: vscode.ExtensionContext) {
  console.log(
    `Congratulations, your extension "Fastify Schema Generator" is now active!`
  );

  let disposableOutput = vscode.commands.registerCommand(
    "extension.generateOutputSchema",
    async () => {
      const clipBoardText = await vscode.env.clipboard.readText();
      try {
        const statusCodeText = await vscode.window.showInputBox({
          placeHolder: "Status Code",
          value: "200"
        });
        if (statusCodeText && parseInt(statusCodeText, 10)) {
          insertText(
            JSON.stringify(
              OutputSchemaGenerator.outputSchema(
                parseInt(statusCodeText, 10),
                clipBoardText
              ),
              null,
              "\t"
            ).replace(/\"([^(\")"]+)\":/g, "$1:")
          );
          return;
        }
      } catch (e) {
        console.log("TCL: activate -> e", e);
        vscode.window.showErrorMessage(`Enter Valid Status Code`);
      }
    }
  );

  let disposableInput = vscode.commands.registerCommand(
    "extension.generateInputSchema",
    async () => {
      const clipBoardText = await vscode.env.clipboard.readText();
      const schemaType = await vscode.window.showQuickPick([
        "Generate Body Schema",
        "Generate Query Schema"
      ]);

      switch (schemaType) {
        case "Generate Body Schema": {
          insertText(
            JSON.stringify(
              InputSchemaGenerator.bodySchema(clipBoardText),
              null,
              "\t"
            ).replace(/\"([^(\")"]+)\":/g, "$1:")
          );
          return;
        }
        case "Generate Query Schema": {
          insertText(
            JSON.stringify(
              InputSchemaGenerator.querySchema(clipBoardText),
              null,
              "\t"
            ).replace(/\"([^(\")"]+)\":/g, "$1:")
          );
          return;
        }
        default: {
          return undefined;
        }
      }
    }
  );

  context.subscriptions.push(disposableInput);
  context.subscriptions.push(disposableOutput);
}

export function deactivate() {}
