var Remote = require('remote');
var app = Remote.require('app');
var autoUpdater = Remote.require('auto-updater');

Polymer({
    version: '',
    playAnimate: false,
    created: function () {
        this.version = app.getVersion();
    },

    domReady: function () {
        console.log('status = ' + this.argv.status);
    },

    checkUpdate: function () {
        Fire.sendToCore( 'auto-update:start');
        // this.animation();
        //
        // autoUpdater.checkForUpdates();
        // autoUpdater
        //   .on('checking-for-update', function() {
        //       Fire.log("Checking for update! Now Version:" + this.version);
        //   }.bind(this))
        //   .on('update-available', function(notes) {
        //       console.log('正在自动下载最新版本!');
        //   })
        //   .on('update-not-available', function() {
        //       Fire.log('当前已经是最新版本!');
        //   })
        //   .on('update-downloaded', function() {
        //       Fire.log('更新完成，是否需要重启客户端完成安装?');
        //   })
        //   .on('error', function () {
        //       Fire.error(arguments[1]);
        //   });
    },

    ipcStatusChanged: function ( event ) {
        var status = event.detail.status;

        console.log( "status changed = " + status );
    },

    animation: function () {
        this.$.svgForStroke.style.display = "block";
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
});
