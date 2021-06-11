import { App, ipcMain, Menu, shell } from "electron";
import AppProvider from "../plugins/appProvider.plugin";
import SettingsProvider from "../plugins/settingsProvider.plugin";
import UpdateProvider from "../plugins/updateProvider.plugin";
import { BaseProvider } from "./baseProvider";

export const createTrayMenu = (provider: BaseProvider) => {
  const { set, instance: settings } = provider.getProvider(
    "settings"
  ) as SettingsProvider;
  const { app } = provider.getProvider("app") as AppProvider;
  const { updateAvailable, updateDownloaded, onCheckUpdate: checkUpdate, onAutoUpdateRun: applyUpdate } = provider.getProvider("update") as UpdateProvider;
  return Menu.buildFromTemplate([
    {
      label: "Youtube Music for Desktop",
      sublabel: `Version: ${app.getVersion()}`,
    },
    {
      label: updateAvailable ? 'Update Available - Apply/Download' : "Check for Updates",
      click: () => updateAvailable ? applyUpdate() : checkUpdate(),
    },
    {
      type: "separator",
    },
    {
      label: "Auto Startup",
      type: "checkbox",
      checked: settings.app.autostart,
      click: (item) => {
        set("app.autostart", item.checked);
      },
    },
    {
      label: "Auto Update",
      type: "checkbox",
      checked: settings.app.autoupdate,
      click: (item) => {
        set("app.autoupdate", item.checked);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Settings",
      click: () => {
        ipcMain.emit("settings.show");
      },
    },
    {
      type: "separator",
    },
    {
      type: "submenu",
      label: "Discord",
      submenu: [
        {
          label: "Show Presence",
          type: "checkbox",
          checked: settings.discord.enabled,
          click: (item) => {
            set("discord.enabled", item.checked);
          },
        },
        {
          label: "Show Buttons",
          type: "checkbox",
          checked: settings.discord.buttons,
          click: (item) => {
            set("discord.buttons", item.checked);
          },
        },
      ],
    },
    {
      type: "separator",
    },
    {
      type: "submenu",
      label: "Custom CSS",
      submenu: [
        {
          label: "Enable CSS",
          type: "checkbox",
          checked: settings.customcss.enabled,
          click: (item) => {
            set("customcss.enabled", item.checked);
          },
        },
        {
          label: "Open selected CSS File",
          enabled: settings.customcss.enabled,
          click: (item) => {
            if (item.enabled) shell.openExternal(settings.customcss.scssFile);
          },
        },
        {
          label: "Change CSS File",
          enabled: settings.customcss.enabled,
          click: (item) => {
            if (item.enabled) ipcMain.emit("settings.show");
          },
        },
      ],
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);
};