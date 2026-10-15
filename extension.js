import GObject from 'gi://GObject';
import Shell from 'gi://Shell';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as TrayIndicator from './TrayIndicator.js';

const TrayIconsClass = GObject.registerClass(
class TrayIconsClass extends GObject.Object { 
	constructor(extension) {
		super();
		this.tray       = new Shell.TrayManager();
		this.indicators = new TrayIndicator.TrayIndicator(extension);

		this._traySignalIds = [
			this.tray.connect('tray-icon-added', this._onIconAdded.bind(this)),
			this.tray.connect('tray-icon-removed', this._onIconRemoved.bind(this)),
		];
	}

	_onIconAdded(trayManager, icon)		 {		this.indicators.addIcon(icon); 		}
	_onIconRemoved(trayManager, icon)	 {		this.indicators.removeIcon(icon);	}

	_destroy() {
		this.tray.unmanage_screen();
		this._traySignalIds.forEach(id => this.tray.disconnect(id));
		this._traySignalIds = [];
		this.tray = null;

		this.indicators.destroy();
		this.indicators = null;
	}
});

export default class TrayIconsReloaded extends Extension {
	_setIconSize() {
		const margin = { vertical: this._settings.get_int('icon-margin-vertical'), horizontal: this._settings.get_int('icon-margin-horizontal') }
		const padding = { vertical: this._settings.get_int('icon-padding-vertical'), horizontal: this._settings.get_int('icon-padding-horizontal') }
		this.TrayIcons.indicators.setSize(this._settings.get_int('icon-size'), margin, padding);
	}

	_setTrayMargin() {
		this.TrayIcons.indicators.set_style('margin-left: ' + this._settings.get_int('tray-margin-left') + 'px; margin-right: ' + this._settings.get_int('tray-margin-right') + 'px');
	}

	_setTrayArea() {
		Main.panel.statusArea['TrayIconsReloaded'] = null;
		Main.panel.addToStatusArea('TrayIconsReloaded', this.TrayIcons.indicators, this._settings.get_int('position-weight'), this._settings.get_string('tray-position'));
	}

	_setIconsLimit() {
		this.TrayIcons.indicators.checkOverflow();
	}

	_setIconEffect() {
		this.TrayIcons.indicators.setEffect(this._settings.get_int('icon-contrast'), this._settings.get_int('icon-saturation'), this._settings.get_int('icon-brightness'));
	}

	_onChange() {
		this._settings.connectObject('changed::tray-position', this._setTrayArea.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::position-weight', this._setTrayArea.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::tray-margin-left', this._setTrayMargin.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::tray-margin-right', this._setTrayMargin.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-size', this._setIconSize.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-margin-horizontal', this._setIconSize.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-margin-vertical', this._setIconSize.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-padding-vertical', this._setIconSize.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-padding-horizontal', this._setIconSize.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icons-limit',  this._setIconsLimit.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-saturation', this._setIconEffect.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-contrast', this._setIconEffect.bind(this), this.TrayIcons.indicators);
		this._settings.connectObject('changed::icon-brightness', this._setIconEffect.bind(this), this.TrayIcons.indicators);
	}

	enable() {
		this._settings = this.getSettings();
		this.TrayIcons = new TrayIconsClass(this);
		this._setTrayMargin();
		this._setIconSize();
		this._onChange();
		this.TrayIcons.tray.manage_screen(Main.panel);

		if (Main.layoutManager._startingUp) {
			this._startupComplete = Main.layoutManager.connect('startup-complete', () => {
				this._setTrayArea();
				Main.layoutManager.disconnect(this._startupComplete);
				this._startupComplete = null;
			});
		} else {
			this._setTrayArea();
		}
	}

	disable() {
		this._settings.disconnectObject(this.TrayIcons.indicators);
		this.TrayIcons._destroy();
		this.TrayIcons = null;
		this._settings = null;

		if (this._startupComplete) {
			Main.layoutManager.disconnect(this._startupComplete);
			this._startupComplete = null;
		}
	}
}
