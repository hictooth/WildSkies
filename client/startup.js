var _cnglobal = {}

var config = {
  width: 900,
  height: 600,
  params: {
    "disableContextMenu": true,
    "backgroundcolor": "ffffff",
    "bordercolor": "ffffff",
    "textcolor": "000000",
    "pluginspage": "https://unity3d.com/unitywebplayer.html",
    "logoimage": "./loadimage.png"
  }
}

var filePath = "./i.cdn.turner.com/toon/games/dragons/wild-skies/main.unity3d"

window.onload = function () {
  _cnglobal.unityObj = new UnityObject2(config);
  _cnglobal.unityObj.initPlugin(document.getElementById('game-swf'), filePath);
}
