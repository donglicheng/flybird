function Game (ctx, bird, pipe, land, mountain,img) {
	this.ctx = ctx;
	this.bird = bird;
	this.pipeArr = [pipe];
	this.land = land;
	this.mountain = mountain;
	this.timer = null;
	this.iframe = 0;
	this.init();
	this.img = img;
	this.start = document.getElementById("start");
}

// 初始化
Game.prototype.init = function() {
	this.start();
	this.bindEvent();
}
// 渲染山峰
Game.prototype.renderMountain = function() {
	var img = this.mountain.img;
	// console.log(img);
	this.mountain.x -= this.mountain.step;
	if(this.mountain.x < -img.width) {
		this.mountain.x = 0;
	}
	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);



	// this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	// this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	// this.ctx.drawImage(img, this.mountain.x + img.width*2, this.mountain.y);
}
// 渲染地面
Game.prototype.renderLand = function() {
	var img = this.land.img;
	this.land.x -= this.land.step;
	if(this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img,this.land.x, this.land.y);
	this.ctx.drawImage(img,this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img,this.land.x + img.width*2, this.land.y)
}
// 游戏开始
Game.prototype.start = function() {
	var me = this;
	this.timer = setInterval(function() {
		me.iframe++;
		me.clear();
		me.renderMountain();
		me.renderLand();
		me.renderBird();
		if(!(me.iframe % 10)) {
			me.bird.fly();
		}
		me.bird.fallDown();
		me.movePipe();
		me.renderPipe();
		if(!(me.iframe % 65)) {
			me.createPipe();
		}
		me.clearPipe();
		me.renderBirdPoints();
		me.renderPipePoints();
		me.checkBoom();
	},20)
}
// 清屏
Game.prototype.clear = function() {
	this.ctx.clearRect(0,0,360,512);
}
// 绑定事件
Game.prototype.bindEvent = function() {
	var me = this;
	this.ctx.canvas.onclick = function() {
		me.bird.goUp();
	}
}
// 渲染鸟
Game.prototype.renderBird = function() {
	var img = this.bird.img;
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	var deg = this.bird.state === "d" ? Math.PI / 180*this.bird.speed : -Math.PI/180*this.bird.speed;
	this.ctx.rotate(deg);
	console.log(this.bird.state);
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();
}
// 渲染管子
Game.prototype.renderPipe = function(){
	var me = this;
	this.pipeArr.forEach(function(value, index) {
		var img_up = value.pipe_up;
		var img_x = 0;
		var img_y = img_up.height - value.up_height;
		var img_w = img_up.width;
		var img_h = value.up_height; 
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = value.up_height;
		me.ctx.drawImage(img_up,img_x,img_y,img_w,img_h,canvas_x,canvas_y,canvas_w,canvas_h);
		// 下管子
		var img_down = value.pipe_down;
		var img_down_x = 0;
		var img_down_y = 0;
		var img_down_w = img_down.width;
		var img_down_h = value.down_height; 
		var img_canvas_x = me.ctx.canvas.width - value.step * value.count;
		var img_canvas_y = canvas_h + 150;
		var img_canvas_w = img_down.width;
		var img_canvas_h = value.down_height;
		me.ctx.drawImage(img_down,img_down_x,img_down_y,img_down_w,img_down_h,img_canvas_x,img_canvas_y,img_canvas_w,img_canvas_h);
	})

}
// 管子移动
Game.prototype.movePipe = function() {
	// 备份this
	var me = this;
	this.pipeArr.forEach(function(value) {
		value.count++;
	})
}
Game.prototype.createPipe = function() {
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);
}
// 消除多余管子
Game.prototype.clearPipe = function() {
	for (var i = 0;i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		if(pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width){
			this.pipeArr.splice(i, 1);
			return;
		}
	}
}
Game.prototype.renderBirdPoints = function() {
	var bird_A = {
		x: -this.bird.img.width / 2 + 5 + this.bird.x,
		y: -this.bird.img.height / 2 + 5 + this.bird.y
	}
	var bird_B = {
		x: bird_A.x + this.bird.img.width - 16,
		y: bird_A.y

	}
	var bird_C = {
		x: bird_A.x,
		y: bird_A.y + this.bird.img.height - 16
	}
	var bird_D = {
		x: bird_B.x,
		y: bird_C.y
	}

	this.ctx.beginPath();
	this.ctx.moveTo(bird_A.x, bird_A.y);
	this.ctx.lineTo(bird_B.x, bird_B.y);
	this.ctx.lineTo(bird_D.x, bird_D.y);
	this.ctx.lineTo(bird_C.x, bird_C.y);
	this.ctx.closePath();
	this.ctx.strokeStyle = "transparent";
	this.ctx.stroke();
}
Game.prototype.renderPipePoints = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		var pipe_A = {
			x: pipe.x - pipe.step *  pipe.count,
			y: 0
		}
		var pipe_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: 0
		}
		var pipe_C = {
			x: pipe_A.x,
			y: pipe_A.y + pipe.up_height
		}
		var pipe_D = {
			x: pipe_B.x,
			y: pipe_A.y + pipe.up_height
		}
		this.ctx.beginPath();
		this.ctx.moveTo(pipe_A.x,pipe_A.y);
		this.ctx.lineTo(pipe_B.x,pipe_B.y);
		this.ctx.lineTo(pipe_D.x,pipe_D.y);
		this.ctx.lineTo(pipe_C.x,pipe_C.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "transparent";
		this.ctx.stroke();


		var pipe_down_A = {
			x: pipe.x - pipe.step *  pipe.count,
			y: pipe.up_height +150
		}
		var pipe_down_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: pipe.up_height +150
		}
		var pipe_down_C = {
			x: pipe_A.x,
			y: 400
		}
		var pipe_down_D = {
			x: pipe_B.x,
			y: 400
		}
		this.ctx.beginPath();
		this.ctx.moveTo(pipe_down_A.x,pipe_down_A.y);
		this.ctx.lineTo(pipe_down_B.x,pipe_down_B.y);
		this.ctx.lineTo(pipe_down_D.x,pipe_down_D.y);
		this.ctx.lineTo(pipe_down_C.x,pipe_down_C.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "transparent";
		this.ctx.stroke();
	}
}
// 碰撞检测
Game.prototype.checkBoom = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		var pipe_A = {
			x: pipe.x - pipe.step *  pipe.count,
			y: 0
		}
		var pipe_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: 0
		}
		var pipe_C = {
			x: pipe_A.x,
			y: pipe_A.y + pipe.up_height
		}
		var pipe_D = {
			x: pipe_B.x,
			y: pipe_C.y 
		}

		var pipe_down_A = {
			x: pipe.x - pipe.step *  pipe.count,
			y: pipe.up_height +150
		}
		var pipe_down_B = {
			x: pipe_A.x + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: pipe_A.x,
			y: 400
		}
		var pipe_down_D = {
			x: pipe_B.x,
			y: 400
		}
		var bird_A = {
			x: -this.bird.img.width /2 + 6 +this.bird.x,
			y: -this.bird.img.height /2 + 6 +this.bird.y
		}
		var bird_B = {
			x: bird_A.x + this.bird.img.width -12,
			y: bird_A.y
		}
		var bird_C = {
			x: bird_A.x ,
			y: bird_A.y + this.bird.img.height -12
		}
		var bird_D = {
			x: bird_B.x ,
			y: bird_A.y + this.bird.img.height -12
		}
		// console.log(this.bird.y);
		if(bird_B.x >= pipe_C.x && bird_B.y <= pipe_C.y && bird_A.x <= pipe_D.x) {
			this.gameOver();
			console.log(bird_B.x,pipe_C.x,bird_B.y,pipe_C.y,bird_A.x,pipe_D.x);

		}
		if(bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_A.x <= pipe_down_B.x) {
			this.gameOver();
			console.log(bird_D.x,pipe_down_A.x,bird_D.y,pipe_down_A.y , bird_A.x,pipe_down_B.x);
		}
		if(this.bird.y <= 6){
			// this.bird.y = 6
			this.gameOver();

		}
		if(this.bird.y >= 400){
			
			this.gameOver();

		}
	}
}
Game.prototype.gameOver = function() {
	clearInterval(this.timer);
	// var img_s = "images/text_game_over.png";
	this.ctx.drawImage(this.img,78,229,204,54);
	setTimeout(function(){
		this.start.style = "block";
	}, 2000)
}













