import path from 'path'
import { app, BrowserWindow } from 'electron'
import electronCtxMenu from 'electron-context-menu'
import initIpc from './ipc'
import './menu'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path')
		.join(__dirname, '/static')
		.replace(/\\/g, '\\\\')
}

electronCtxMenu()

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow() {
	/**
	 * Initial window options
	 */
	const icon =
		process.env.NODE_ENV !== 'development'
			? path.join(global.__static, './logo.png')
			: path.join(__dirname, '../../static/logo.png')
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000,
		webPreferences: {
			webSecurity: process.env.NODE_ENV !== 'development'
		},
		icon
	})

	mainWindow.loadURL(winURL)

	initIpc()

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})

process.on('uncaughtException', console.error)