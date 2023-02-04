// ==UserScript==
// @name         G1h - generals.io 1v1 helper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  1v1、custotm辅助脚本，持续更新中
// @author       itray25
// @match        *://generals.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=generals.io
// @grant        O.O
// @license MIT
// ==/UserScript==

(function() {
    'use strict';
let color;
let first=1
let tileObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    window.setTimeout(function () {
      var target=mutation.target
      console.log([target.classList.length,target.classList])
      if(target.classList[1]=="general" && (target.classList[0]==color?false : true)){
        let sheet = document.styleSheets[1];
        if(first==1){
          sheet.deleteRule(0);
          first=0
        }
        target.id="gen"
        //console.log(target)
      }
    },1000)


  });
});
let gameObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (
      mutation.addedNodes.length > 0 &&
      mutation.addedNodes[0].id === "game-page"
    ) {
      tileObserver.disconnect();
      setTimeout(function () {}, 400);
      setTimeout(function () {
        console.log("loading map");

        let map = document.getElementById("gameMap");
        let tiles = map.getElementsByTagName("td");
        let col = map.getElementsByTagName("tr").length;
        let row=tiles.length/col
        let d_map = [];
        let sheet = document.styleSheets[1];
        sheet.insertRule(".imp {background-color:#006c66 !important}",0);
        sheet.insertRule("#null {background-color:#2aa !important}",1);
        //gen_index=tiles.indexOf(map.getElementsByClassName("general"))
        //console.log("gen_index")
        for (var j = 0; j < col; j++) {
          d_map.push([]);
        }
        var gen_row, gen_col;
        console.log(d_map);
        //1st loop, binarify map[effect not known]
        for (var i = 0; i < tiles.length; i++) {
          let target = tiles[i];
          let classN = target.classList;
          let t_col = Math.trunc((i * col) / tiles.length);
          let t_row = i % (tiles.length / col);
          target.id = t_col + " " + t_row;
          console.log(classN);
          if (classN[1] == "general") {
            d_map[t_col].push(2);
            gen_row = t_row;
            gen_col = t_col;
            color = classN[0]
          } else if (classN[1] == "obstacle") {
            d_map[t_col].push(1);
          } else {
            d_map[t_col].push(0);
          }

          let config = { attributes: true, childList: false, characterData: true };
          tileObserver.observe(target, config);
        }
        console.log(d_map);
        // 2nd loop, locate possible gen region
        for (i = 0; i < tiles.length; i++) {
          let target = tiles[i];
          let t_col = parseInt(target.id.split(" ")[0]);
          let t_row = parseInt(target.id.split(" ")[1]);
          //designed for 1v1
          if (
            Math.abs(t_col - gen_col) + Math.abs(t_row - gen_row) >= 15 &&
            target.classList[1] != "obstacle"
             && !((t_col==0 ? true : t_col!=0 ? d_map[t_col-1][t_row]!=0 :true)&&
             (t_col==col-1 ? true : t_col!=col-1 ? d_map[t_col+1][t_row]!=0 :true)&&
             (t_row==0 ? true : t_row!=0 ? d_map[t_col][t_row-1]!=0 :true)&&
             (t_row==row-1 ? true : t_row!=row-1 ? d_map[t_col][t_row+1]!=0 :true))
          ) {
            target.classList.add("imp");
          }
        }
      }, 100);
    }
  });
});
let gameConfig = { attributes: true, childList: true, characterData: true };
let gameTarget = document.getElementById("react-container").children[0];
gameObserver.observe(gameTarget, gameConfig);
//with regards to O.O
})();
