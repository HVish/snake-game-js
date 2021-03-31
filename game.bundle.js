(()=>{"use strict";var t=function(t){return t.join()};const e=function(){function e(t,e,i){this.frameWidth=0,this.frameHeight=0,this.ctx=t,this.canvasWidth=e,this.canvasHeight=i}return e.create=function(t,i,n){return e.instance?e.instance:new e(t,i,n)},e.getXCoordinate=function(t){return t*e.unit+e.OFFSET_X},e.getYCoordinate=function(t){return t*e.unit+e.OFFSET_Y},e.prototype.draw=function(){var t=this.canvasWidth,i=this.canvasHeight;this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,t,i);var n=e.unit;e.MAX_X=Math.floor((t-2*n)/e.unit)-1,this.frameWidth=(e.MAX_X+1)*e.unit,e.MAX_Y=Math.floor((i-2*n)/e.unit)-1,this.frameHeight=(e.MAX_Y+1)*e.unit,e.OFFSET_X=(t-this.frameWidth)/2,e.OFFSET_Y=(t-this.frameWidth)/2,this.ctx.strokeStyle="#fff",this.ctx.strokeRect(e.OFFSET_X,e.OFFSET_Y,this.frameWidth,this.frameHeight),this.makeBorderWall()},e.prototype.drawBrick=function(i){var n=i[0],o=i[1],r=e.getXCoordinate(n),a=e.getYCoordinate(o);this.ctx.fillStyle="rgba(255, 0, 0, 0.8)",this.ctx.fillRect(r,a,e.unit,e.unit),this.ctx.strokeStyle="#fff",this.ctx.strokeRect(r,a,e.unit,e.unit),e.occupiedCellMap[t([n,o])]=!0},e.prototype.makeBorderWall=function(){for(var t=0;t<=e.MAX_X;t++)this.drawBrick([t,0]),this.drawBrick([t,e.MAX_Y]);for(var i=1;i<e.MAX_Y;i++)this.drawBrick([0,i]),this.drawBrick([e.MAX_X,i])},e.unit=20,e.OFFSET_X=0,e.OFFSET_Y=0,e.MIN_X=0,e.MAX_X=0,e.MIN_Y=0,e.MAX_Y=0,e.occupiedCellMap={},e.instance=void 0,e}();function i(t,e){return t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t+1))+t}var n,o=function(t,e){for(var i=0,n=e.length,o=t.length;i<n;i++,o++)t[o]=e[i];return t};!function(t){t[t.NORTH=0]="NORTH",t[t.EAST=1]="EAST",t[t.SOUTH=2]="SOUTH",t[t.WEST=3]="WEST"}(n||(n={}));var r=new Audio("/snake-game-js/assets/eat.wav");r.preload="auto";var a=new Audio("/snake-game-js/assets/out.wav");a.preload="auto";var s=[[4,1],[3,1],[2,1],[1,1]];const h=function(){function h(t,e){this.direction=n.EAST,this.food=[-1,-1],this.canTurn=!0,this.body=o([],s),this.ctx=t,this.callbacks=e}return h.create=function(t,e){return h.instance?h.instance:new h(t,e)},h.prototype.reset=function(){var t=this;this.body.forEach((function(e){t.drawCell(e,{clear:!0})})),this.drawCell(this.food,{clear:!0}),this.canTurn=!0,this.direction=n.EAST,this.food=[-1,-1],this.body=o([],s),this.draw()},h.prototype.drawCell=function(i,n){var o=i[0],r=i[1],a=t([o,r]),s=e.getXCoordinate(o)+2,h=e.getXCoordinate(r)+2,c=e.unit-4;if(null==n?void 0:n.clear)return this.ctx.fillStyle="#000",this.ctx.fillRect(s,h,c,c),this.ctx.strokeStyle="#000",this.ctx.strokeRect(s,h,c,c),void(e.occupiedCellMap[a]=!1);this.ctx.fillStyle=(null==n?void 0:n.fillStyle)||"rgba(0, 255, 0, 0.8)",this.ctx.fillRect(s,h,c,c),e.occupiedCellMap[a]=!0},h.prototype.draw=function(){var t=this,e=this.food,i=e[0],n=e[1];-1===i&&-1===n?this.makeFood():this.makeFood(this.food),this.body.forEach((function(e){t.drawCell(e)}))},h.prototype.addCell=function(t){this.body.unshift(t),this.drawCell(t)},h.prototype.makeFood=function(n){if(!n)do{n=[i(e.MIN_X+1,e.MAX_X-1),i(e.MIN_Y+1,e.MAX_Y-1)],this.food=n}while(e.occupiedCellMap[t(n)]);this.drawCell(this.food,{fillStyle:"rgba(255, 255, 0, 0.8)"})},h.prototype.getNextHead=function(){var t=this.body[0],e=t[0],i=t[1];switch(this.direction){case n.EAST:return[e+1,i];case n.WEST:return[e-1,i];case n.NORTH:return[e,i-1];case n.SOUTH:return[e,i+1];default:return[e,i]}},h.prototype.eatFoodIfAvailable=function(){var t=this.food,e=t[0],i=t[1],n=this.body[0],o=n[0],a=n[1];o===e&&a===i&&(r.play(),this.addCell(this.getNextHead()),this.makeFood(),this.callbacks.ateFood())},h.prototype.checkIfDead=function(){var i=this.food,n=i[0],o=i[1],r=this.getNextHead(),a=r[0],s=r[1];return!(n===a&&o===s||!e.occupiedCellMap[t([a,s])]||(this.kill(),0))},h.prototype.kill=function(){var t=this;a.play(),this.body.forEach((function(e,i){t.drawCell(e,{clear:!0}),0===i?t.drawCell(e,{fillStyle:"rgba(255, 0, 0, 0.5)"}):t.drawCell(e,{fillStyle:"rgba(110, 110, 110, 0.8)"})})),this.callbacks.killed()},h.prototype.move=function(){var t=this.checkIfDead();if(t)return!0;this.eatFoodIfAvailable();var e=this.body.pop();this.drawCell(e,{clear:!0});var i=this.getNextHead();return this.addCell(i),this.canTurn=!0,t},h.prototype.turn=function(t){var e;if(this.canTurn){var i=((e={})[n.NORTH]={left:n.WEST,right:n.EAST,up:n.NORTH,down:n.NORTH},e[n.EAST]={up:n.NORTH,down:n.SOUTH,left:n.EAST,right:n.EAST},e[n.SOUTH]={left:n.WEST,right:n.EAST,up:n.SOUTH,down:n.SOUTH},e[n.WEST]={up:n.NORTH,down:n.SOUTH,left:n.WEST,right:n.WEST},e)[this.direction][t];this.direction!==i&&(this.direction=i,this.canTurn=!1)}},h}();var c;!function(t){t[t.ONE=1]="ONE",t[t.TWO=2]="TWO",t[t.THREE=3]="THREE",t[t.FOUR=4]="FOUR"}(c||(c={}));const l=function(){function t(t){var i=this;this.draw=function(){i.canvas.setAttribute("width",i.canvasWidth.toString()),i.canvas.setAttribute("height",i.canvasHeight.toString()),i.frame.draw(),i.snake.draw()},this.score=40,this.level=c.ONE,this.timer=void 0,this.shouldReset=!1,this.incrementScore=function(){i.score+=10,i.options.onScoreUpdate&&i.options.onScoreUpdate(i.score),i.score%100==0&&i.levelUp()},this.handleGameOver=function(){i.shouldReset=!0},this.handleKeyPress=function(t){if(!t.defaultPrevented){switch(t.code){case"ArrowRight":i.snake.turn("right");break;case"ArrowLeft":i.snake.turn("left");break;case"ArrowUp":i.snake.turn("up");break;case"ArrowDown":i.snake.turn("down");break;case"Space":i.togglePause()}t.preventDefault()}};var n=document.querySelector("#game-board");if(!n)throw new Error("Game board canvas not found!");var o=n.getContext("2d");if(!o)throw new Error("Unable to get 2d context!");this.ctx=o,this.canvas=n,this.options=t,this.canvasWidth=t.width,this.canvasHeight=t.height,this.frame=e.create(this.ctx,this.canvasWidth,this.canvasHeight),this.snake=h.create(this.ctx,{ateFood:this.incrementScore,killed:this.handleGameOver}),this.draw(),window.addEventListener("resize",this.draw),window.addEventListener("keydown",this.handleKeyPress,!0)}return t.init=function(e){return t.instance?t.instance:new t(e)},t.prototype.reset=function(){this.score=40,this.level=c.ONE,this.snake.reset(),this.shouldReset=!1},t.prototype.play=function(){var t=this;if(!this.timer){this.shouldReset&&this.reset();var e=250-50*this.level;console.log({delay:e,level:this.level}),this.timer=setInterval((function(){t.snake.move()&&(t.pause(),t.options.onGameOver&&t.options.onGameOver())}),e),this.options.onPlay&&this.options.onPlay(this.score)}},t.prototype.pause=function(){this.timer&&(clearInterval(this.timer),this.timer=void 0,this.options.onPause&&this.options.onPause())},t.prototype.togglePause=function(){this.timer?this.pause():this.play()},t.prototype.levelUp=function(){this.level<5&&(this.pause(),this.level++,this.play())},t}();var d="sg_+sdlkfj234fsd1!@#$";function u(t){var e=document.getElementById("score");e&&(e.innerHTML=t.toString())}function f(t){var e=document.getElementById("highScore");e&&(e.innerHTML=t.toString())}!function(){var t={width:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,height:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},e=t.width,i=t.height,n=localStorage.getItem(d)||40;f(n),u(40);var o=l.init({height:i,width:.75*e,onPlay:u,onScoreUpdate:function(t){t>=n&&(n=t,localStorage.setItem(d,t.toString()),f(n)),u(t)}});document.addEventListener("visibilitychange",(function(){document.hidden&&o.pause()}))}()})();
//# sourceMappingURL=game.bundle.js.map