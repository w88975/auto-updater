!function(){var a=require("remote"),b=a.require("app"),c=a.require("auto-updater");Polymer({version:"",playAnimate:!1,created:function(){this.version=b.getVersion()},domReady:function(){console.log("status = "+this.argv.status)},checkUpdate:function(){Fire.sendToCore("auto-update:start")},ipcStatusChanged:function(a){var b=a.detail.status;console.log("status changed = "+b)},animation:function(){this.$.svgForStroke.style.display="block",this.playAnimate=!0,this.$.logo.animate([{width:"45px"},{width:"40px"}],{duration:200}),this.$.logo.style.width="40px"},install:function(){c.quitAndInstall()}})}();