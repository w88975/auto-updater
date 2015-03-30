var Url = require('fire-url');
var app = require('app');
var autoUpdater = require('auto-updater');
var status = 'normal';
var ignoreDialog = false;
module.exports = {
    load: function (plugin) {
        plugin.on('check-update:open', function () {
            ignoreDialog = false;
            plugin.openPanel('default', {
                status: status,
                ignoreDialog: ignoreDialog
            });
        });
        autoUpdater.setFeedUrl('http://fireball-x.com/api/checkupdate?version=v' + app.getVersion());
        autoUpdater
          .on('checking-for-update', function() {
              status = 'checking';
              Fire.log("Checking for update! Now Version: " + app.getVersion());
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
          }.bind(this))
          .on('update-available', function(notes) {
              status = 'downloading';
              Fire.log('Downloading...');
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
          })
          .on('update-not-available', function() {
              status = 'not-available';
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
              Fire.info('Is the latest version');
          })
          .on('update-downloaded', function() {
              status = 'downloaded';
              Fire.info('Download success,ready to install');

              var dialog = require('dialog');
              var result = dialog.showMessageBox({
                  type: "warning",
                  buttons: ["Quite and install now","later"],
                  title: "Install Update",
                  message: "install update now?",
                  detail: "If you choose \"later\", Fireball will update itself after you quit the app."
              } );

              if (result === 0) {
                  autoUpdater.quitAndInstall();
              }
              else if (result === 1) {
                  //TODO: 发IPC给MainWindow,让MainWindow在关闭的时候调用autoUpdater.quitAndInstall();
              }
              ignoreDialog = true;

              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status,
                  ignoreDialog: ignoreDialog
              });
          })
          .on('error', function () {
              Fire.error(arguments[1]);
              status = "error";
              plugin.openPanel('default', {
                  status: status
              });
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status,
              });
          });

        plugin.on('auto-update:start', function () {
            autoUpdater.checkForUpdates();
        });

        plugin.on('auto-update:ignore-dialog', function () {
            ignoreDialog = true;
        });
    },
    unload: function (plugin) {
    },
};
