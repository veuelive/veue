'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, BrowserView, ipcMain, screen} = require('electron');
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');
const menu = require('./menu');
const packageJson = require('./package.json');
const {session} = require('electron')
var ffmpegStatic = require('ffmpeg-static-electron');
const child_process = require("child_process");
const Buffer = require('buffer').Buffer;
let ffmpeg;

unhandled();
debug();
contextMenu();

app.setAppUserModelId(packageJson.build.appId);

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: "Veue",
		show: false,
		width: 2048,
		height: 1200,
		maximizable: false,
		closable: false,
		minimizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	console.log("Hi!")

	win.loadURL('http://localhost:3000/videos/broadcast').then(() => console.log("loaded"))

	win.on('ready-to-show', () => {
		win.show();

		const view = new BrowserView()
		// view.webContents.loadFile("sample.html")
		view.webContents.loadURL("http://revolve.com")
		win.addBrowserView(view)
		let bounds = {x: 33, y: 125, width: 1280, height: 800 };
		view.setBounds(bounds)
		win.webContents.send("visible", bounds, screen.getPrimaryDisplay().workArea)
	})

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}


ipcMain.on('stream', (event, data) => {
	if (ffmpeg) {
		console.log("Sending data to ffmpeg ", data.payload.length)
		ffmpeg.stdin.write(data.payload);
	} else {
		console.log("Got data, but no good instance of ffmpeg")
	}
})

ipcMain.on("start", (_, data) => {
	const key = data.streamKey

	const rtmpUrl = `rtmps://global-live.mux.com/app/${key}`;

	console.log("Streaming to ", rtmpUrl)

	ffmpeg = child_process.spawn('ffmpeg', [
		'-i', '-',

		// video codec config: low latency, adaptive bitrate
		'-c:v', 'libx264', '-preset', 'medium', '-tune', 'animation',

		// audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
		'-c:a', 'aac', '-strict', '-2', '-ar', '44100', '-b:a', '64k',

		//force to overwrite
		'-y',

		// used for audio sync
		'-use_wallclock_as_timestamps', '1',
		'-async', '1',

		//'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
		//'-strict', 'experimental',
		'-bufsize', '1000',
		'-f', 'flv',

		rtmpUrl
	]);

	// Kill the WebSocket connection if ffmpeg dies.
	ffmpeg.on('close', (code, signal) => {
		console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
		ffmpeg = null
	});

	// Handle STDIN pipe errors by logging to the console.
	// These errors most commonly occur when FFmpeg closes and there is still
	// data to write.f If left unhandled, the server will crash.
	ffmpeg.stdin.on('error', (e) => {
		console.log('FFmpeg STDIN Error', e);
	});

	// FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
	ffmpeg.stderr.on('data', (data) => {
		// console.log('FFmpeg STDERR:', data.toString());
	});
})


app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

(async () => {
	await app.whenReady();

	await session.defaultSession.cookies.set({
		url: "http://localhost:3000/",
		name: "_veue_session",
		value: '0KeqvKZtOz3Q4HuGCK6eJxVWMeIkth9mBBialkCGpzusVtX%2BbwGGUPnwu%2Fj4hHjfAP1E4u8tWDYBsNSJ5d734bo2ofxEnvZ15QSck9tauB9saT0E%2Fzdw4FJu%2BR7U0%2FSyu4rCqN%2FuCd4LMvY2QeqQK9huF3FQfpFBSWCW12fbU3IsYqtwM78TbA83CVqO8PIjYc0HFzeZIW5w3iO%2BxdN4vhJA82H3ngIytKYwHQZnEyfO70m%2BAstfWVP%2Fb6OHsZeCKsQjj2PyjT3PcCmJklsE9jcnzuDhttujDtuVOqM9qhu93oGfJN6%2FsSMOALjAkOA1syVVDZ%2FFztdU7CiSA2xl8bLNy8xHedQexHHQNoqNmxxR179mE8cxkcGp48NQ7qm0PDh1mvI%3D--mgPfio%2BIIyvJikGj--u40tLGG733lIKGQN41zing%3D%3D'
	})

	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	// const favoriteAnimal = config.get('favoriteAnimal');

	// mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();
