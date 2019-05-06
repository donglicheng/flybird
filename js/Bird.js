function Bird(imgArr,x,y) {
	this.imgArr = imgArr;
	this.index = parseInt(Math.random() * imgArr.length);
	this.img = this.imgArr[this.index];
	this.x = x;
	this.y = y;
	this.state = "d";
	this.speed = 0;	
}
// 鸟的翅膀
Bird.prototype.fly = function() {
	this.index++;
	if(this.index > this.imgArr.length - 1) {
		this.index = 0;
	}
	this.img = this.imgArr[this.index];
}
// 鸟下降
Bird.prototype.fallDown = function() {
	if(this.state == "d") {
		this.speed++;
		this.y += Math.sqrt(this.speed);
	} else {
		this.speed--;
		if (this.speed == 0) {
			this.state = "d";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}
// 鸟上升
Bird.prototype.goUp = function() {
	this.speed = 20;
	this.state = "u";
}
