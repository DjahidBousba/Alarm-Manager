const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

let lastTriggeredMinute = null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = isDev
    ? process.env.ELECTRON_START_URL
    : url.format({
        pathname: path.join(__dirname, 'public/index.html'),
        protocol: 'file',
        slashes: true,
      });

  setInterval(async () => {
    const alarms = await prisma.alarm.findMany();

    alarms.forEach(({ schedule, isActive }) => {
      if (
        schedule === dayjs().format('HH:mm:ss') &&
        dayjs().minute() !== lastTriggeredMinute &&
        isActive
      ) {
        lastTriggeredMinute = dayjs().minute();
        showNotification({
          title: "C'est l'heure !",
          body: `Votre alarme sonne`,
        });
        mainWindow.webContents.send('trigger:alarm');
      }
    });
  }, 1000);

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    app.quit();
  });
}

function showNotification({ title, body }) {
  new Notification({
    title,
    body,
  }).show();
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('getAll:alarm', async (event) => {
  const alarms = await prisma.alarm.findMany({
    orderBy: {
      schedule: 'asc',
    },
  });

  event.sender.send('getAll:alarm', alarms);
});

ipcMain.handle('set:alarm', async (event, args) => {
  await prisma.alarm.create({ data: { schedule: args } });

  showNotification({
    title: "Ajout d'une alarme",
    body: `Programmation d'une alarme à ${dayjs(args, 'HH:mm:ss').format(
      'HH:mm'
    )}`,
  });

  const alarms = await prisma.alarm.findMany({
    orderBy: {
      schedule: 'asc',
    },
  });
  event.sender.send('getAll:alarm', alarms);
});

ipcMain.handle('setActive:alarm', async (event, args) => {
  const { id, checked } = args;

  await prisma.alarm.update({ where: { id }, data: { isActive: checked } });

  const alarms = await prisma.alarm.findMany({
    orderBy: {
      schedule: 'asc',
    },
  });
  event.sender.send('getAll:alarm', alarms);
});

ipcMain.handle('delete:alarm', async (event, args) => {
  await prisma.alarm.delete({ where: { id: args } });

  const alarms = await prisma.alarm.findMany({
    orderBy: {
      schedule: 'asc',
    },
  });
  event.sender.send('getAll:alarm', alarms);
});
