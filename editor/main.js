var Url = require('fire-url');
var app = require('app');
var autoUpdater = require('auto-updater');

var status = 'normal';

module.exports = {
    load: function (plugin) {
        plugin.on('check-update:open', function () {
            plugin.openPanel('default', {
                status: status
            });
        });
        autoUpdater.setFeedUrl('http://localhost:3000/checkupdate?version=' + app.getVersion());
        autoUpdater
          .on('checking-for-update', function() {
              status = 'checking';
              Fire.log("Checking for update! Now Version:" + app.getVersion());
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
          }.bind(this))
          .on('update-available', function(notes) {
              status = 'downloading';
              Fire.log('正在自动下载最新版本!');
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
          })
          .on('update-not-available', function() {
              status = 'normal';
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
              Fire.log('当前已经是最新版本!');
          })
          .on('update-downloaded', function() {
              status = 'downloaded';
              Fire.log('更新完成，是否需要重启客户端完成安装?');

              plugin.openPanel('default', {
                  status: status
              });
              plugin.sendToPanel('default', 'auto-updater:status-changed', {
                  status: status
              });
          })
          .on('error', function () {
              Fire.error(arguments[1]);
          });

        plugin.on('auto-update:start', function () {
            autoUpdater.checkForUpdates();
        });
    },
    unload: function (plugin) {
    },
};
