import fs from 'fs';
import * as vscode from 'vscode';
import { appInstalledInWindows } from './isAppInstalledInWindows';
import findProcess from 'find-process';
import os from 'os';
import path from 'path';

export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "code-snip-ai" is now active!');


	const disposable = vscode.commands.registerCommand('code-snip-ai.codeSnip', async() => {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const code = editor.document.getText(selection);
			const fileName = editor.document.fileName;
			const extension = fileName.split('.').pop();
			const isWin = process.platform === "win32";
			if (isWin) {
				const {isInstalled, dir} = appInstalledInWindows("Code Snip Ai\\code-snip-ai.exe");
				if (isInstalled) {
					let isOpened: boolean | undefined;
					if (isOpened === undefined) {
						isOpened = (await findProcess("name","Code Snip AI") || await findProcess("name","code-snip-ai.exe")).length === 1;
					}
					
					const fileDirection = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),"com.code-snip-ai.app","vscode.json") ;
					if (isOpened){
						fs.writeFileSync(fileDirection,JSON.stringify({ code, extension }));
						console.log({ code, extension, isWin,  isInstalled, dir,isOpened });

					}else{
						vscode.window.showInformationMessage("Opening Code Snip AI");
						await vscode.env.openExternal(vscode.Uri.file(dir!));
						
						
						vscode.window.showInformationMessage("waiting for Code Snip AI to open");
						
						setTimeout(() => {
							fs.writeFileSync(fileDirection,JSON.stringify({ code, extension }));
						},25000);

						
					}
					
				} else {
					vscode.window.showErrorMessage("Code Snip AI is not installed");
				}

			} else {
				vscode.window.showErrorMessage("Not supported on this platform");
			}



		}
		
	});

	context.subscriptions.push(disposable);
}


export function deactivate() { }
