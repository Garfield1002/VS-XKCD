"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const sidebarProvider = new ViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("xkcd-sidebar", sidebarProvider));
}
exports.activate = activate;
class ViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableCommandUris: true,
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));
        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.css"));
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
        <meta http-equiv="Content-Security-Policy" content="default-src https://xkcd.now.sh; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src https://imgs.xkcd.com/comics/;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Cat Colors</title>
			</head>
			<body>
        <div id="middleContainer" class="box">
        <div id="ctitle">Woodpecker</div>
        <ul class="comicNav">
        <li><button id="linkToFirst">|&lt;</button></li>
        <li><button id="linkToPrev">&lt; Prev</button></li>
        <li><button id="linkToRnd">Random</button></li>
        <li><button id="linkToNext">Next &gt;</button></li>
        <li><button id="linkToLast">&gt;|</button></li>
        </ul>
        <div id="comic">
        <img id="cimage" src="https://imgs.xkcd.com/comics/woodpecker.png" title="If you don't have an extension cord I can get that too.  Because we're friends!  Right?" alt="Oops something broke" style="image-orientation:none">
        </div>
        <br>
        <div id="clink">
        Permanent link to this comic: https://xkcd.com/614/
        </div>
        <br>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map