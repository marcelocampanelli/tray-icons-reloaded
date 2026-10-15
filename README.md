# Status

> The upstream project is no longer maintained. This checkout includes compatibility changes for GNOME Shell 50 and 51.

Recommended alternative: [AppIndicator and KStatusNotifierItem Support](https://extensions.gnome.org/extension/615/appindicator-support/)

# Tray Icons Reloaded

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" height="100" align="right">](https://extensions.gnome.org/extension/2890/tray-icons-reloaded/)
Tray Icons Reloaded is a [GNOME Shell](https://www.gnome.org/) extension which bring back Tray Icons to top panel, with additional features.

## Compatibility

- Targets GNOME Shell 50 and 51 on Wayland, using XWayland for legacy tray icons. GNOME Shell 50 removed support for Xorg sessions.
- Appindicator and similar extensions are not compatible, disable it (some distributions ship it by default ex. Ubuntu based).
- If you have some trouble with compatibility you can try [snixembed](https://git.sr.ht/~steef/snixembed) it also adds visual native menus.
- Native Wayland StatusNotifierItem/AppIndicator icons require a bridge such as snixembed; they are not handled directly by this extension.

Compatibility references: [GNOME Shell 50 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-50.html) and [GNOME Shell 51 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-51.html).

## Wayland

If you are on Wayland and app won't run through XWayland you can force it via command:
`GDK_BACKEND=x11 app_name`

## Features

### Overflow mode

<img src=".github/overflow.png">

(default when there more than 3 items in tray)

### Rich settings

<img src=".github/settings.png">

- fix left click invoking menu in some apps ex. Steam
- fast app killing (SHIFT + mouse middle click)
- window are invoked to current workspace (by default)
- work with Wine (left and middle click affect all wine apps)
- hide selected apps in your tray

## Installation

To install this checkout with the GNOME Shell 50 and 51 compatibility changes:

1. From the project directory, build the extension package:

   ```bash
   gnome-extensions pack --extra-source=TrayIndicator.js --extra-source=AppManager.js --extra-source=preferences --out-dir=/tmp .
   ```

2. Install the package (or replace an existing installation):

   ```bash
   gnome-extensions install --force /tmp/trayIconsReloaded@selfmade.pl.shell-extension.zip
   ```

3. Save your work, log out, and log back in so GNOME Shell loads the updated extension.

4. Enable the extension:

   ```bash
   gnome-extensions enable trayIconsReloaded@selfmade.pl
   ```

5. Open its preferences:

   ```bash
   gnome-extensions prefs trayIconsReloaded@selfmade.pl
   ```

If you already have the package, start at step 2 and adjust its path as needed. If you rebuild it in the same location, add `--force` to the `pack` command to replace the previous package.

## Credits

Evolved from: [unite-shell (hardpixel)](https://github.com/hardpixel/unite-shell) ([TopIcons Plus (phocean)](https://github.com/phocean/TopIcons-plus), TopIcons (Adel Gadllah), [TopTray (mjnaderi)](https://github.com/mjnaderi/TopTray))

## Buy me a beer 🍺

[https://revolut.me/martinpl](https://revolut.me/martinpl)
