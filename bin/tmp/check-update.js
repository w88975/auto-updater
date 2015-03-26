(function () {
var Remote = require('remote');
var app = Remote.require('app');
var autoUpdater = Remote.require('auto-updater');

Polymer({
    version: '',
    playAnimate: false,
    status: "normal",
    progressAnimate: false,
    statusTip: "",
    ignoreDialog: false,
    winUpdate: false,
    updateUrl: "",

    created: function () {
        this.version = app.getVersion();
    },

    domReady: function () {
        this.status = this.argv.status;
        this.ignoreDialog = this.argv.ignoreDialog;
        if (Fire.isDarwin) {
            this.windowsCheckUpdate();
        }else {
            if (this.status === "normal") {
                this.darwinCheckUpdate();
            }
        }
    },

    statusChanged: function () {
        if (this.status === "checking") {
            this.playAnimate = true;
            this.statusTip = "Checking for update...";
        }
        else if (this.status === "not-available") {
            this.progressAnimate = true;
            this.playAnimate = false;
            this.statusTip = "Update not available...";
        }
        else if (this.status === "downloading") {
            this.progressAnimate = true;
            this.statusTip = "Downloading... (You can close this window)";
        }
        else if (this.status === "error") {
            this.playAnimate = false;
            this.statusTip = "Error: install faild,please quite and check update again!";
        }
        else if (this.status === "downloaded") {
            this.playAnimate = false;
            this.statusTip = "Download success,ready to install...";
            if (!this.ignoreDialog) {
                var dialog = Remote.require('dialog');
                var result = dialog.showMessageBox( Remote.getCurrentWindow(), {
                    type: "warning",
                    buttons: ["Quite and install now","Later"],
                    title: "Install Update",
                    message: "install update now?",
                    detail: "If you choose \"Later\", Fireball will update itself after you quit the app."
                } );

                if (result === 0) {
                    autoUpdater.quitAndInstall();
                }
                else if (result === 1) {
                    //TODO: 发IPC给MainWindow,让MainWindow在关闭的时候调用autoUpdater.quitAndInstall();
                }
            }
        }
    },

    darwinCheckUpdate: function () {
        Fire.sendToCore( 'auto-update:start');
        this.animation();
    },

    windowsCheckUpdate: function () {
        this.animation();
        Fire._JsonLoader('http://localhost:3000/checkupdate?version='+ app.getVersion(), function (err,json) {
            this.progressAnimate = true;
            Fire.log("Checking for update!");
            this.statusTip = "Checking for update...";
            if (err) {
                this.statusTip = "Update not available...";
                Fire.error("Update not available...");
                this.progressAnimate = false;
            }
            else {
                this.statusTip = "New version for update!";
                Fire.info("New version for update! You should open this url to download: '"
                        +json.url+"'");
                this.winUpdate = true;
                this.updateUrl = json.url
            }
        }.bind(this));
    },

    ipcStatusChanged: function ( event ) {
        this.status = event.detail.status;
        this.ignoreDialog = event.detail.ignoreDialog;
    },

    animation: function () {
        this.playAnimate = true;
        this.$.logo.animate([
            { width: "45px" },
            { width: "40px" },
        ], {
            duration: 200
        });

        this.$.logo.style.width = "40px";
    },

    install: function () {
        autoUpdater.quitAndInstall();
    },

    goUpdateUrl: function () {
        var shell = Remote.require('shell');
        shell.openExternal(this.updateUrl);
    },
});
})();
