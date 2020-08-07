var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var width = 700;
var height = 320;
gameover=new Image;gameover.src="res/gameover.png";


var audio3 = new Audio('res/jump.mp3');
function playJumpAudio() {
	audio3.play();
}

function drawObject(object) {
	var currentImageIndex = counter % object.images.length;
	var currentImage = object.images[currentImageIndex];
	//Draw of canvas
	try {
		ctx.drawImage(currentImage, object.x - (object.width / 2), object.y - (object.height / 2), object.width, object.height);
	} catch (er) { }
	if (1 === object.repeatX) {
		ctx.drawImage(currentImage, object.width + object.x - (object.width / 2), object.y - (object.height / 2), object.width, object.height);
	}
}

var dragonImages = [];

var dragonImageUrls = ["https://user-images.githubusercontent.com/64878501/89603161-1c493b00-d886-11ea-8443-596ae02092ad.png", "https://user-images.githubusercontent.com/64878501/89603221-4864bc00-d886-11ea-81c8-bed666f80d8a.png", "https://user-images.githubusercontent.com/64878501/89603266-616d6d00-d886-11ea-8774-1a779fb36ef3.png", "https://user-images.githubusercontent.com/64878501/89603312-7d710e80-d886-11ea-959e-a05d49b96eae.png"];
for (var i = 0; i < dragonImageUrls.length; i++) {
	var image = new Image();
	image.src = dragonImageUrls[i];
	dragonImages.push(image);
}

var dragon = {};
dragon.images = dragonImages;
dragon.width = 50;
dragon.height = 50;
dragon.x = 100;
dragon.y = 280;
dragon.speedX = 10;
dragon.speedY = 0;
var gravity = 2.01;
game_over = false;

dragon.move = function () {
	console.log(this.speedY);
	this.speedY = this.speedY + gravity;
	this.y = this.y + this.speedY;
	if (this.y > 280) {
		this.y = 280;
		this.speedY = 0;
	}
}

var clouds = [];
var cloudImage = new Image();
cloudImage.src = "https://user-images.githubusercontent.com/64878501/89603357-98dc1980-d886-11ea-8d9e-beb55fcacf39.png";

function getCloud() {

	var cloud = {};
	cloud.images = [cloudImage];
	cloud.width = 50;
	cloud.height = 30;
	cloud.x = width;
	cloud.y = 30 + Math.random() * 75;
	cloud.isActive = true;
	cloud.speedX = -4 - (Math.random() * 4);
	cloud.speedY = 0;

	cloud.move = function () {
		this.x = this.x + this.speedX;
		if (this.x < -100) {
			this.isActive = false;
		}
	}

	return cloud;
}

var hurdles = [];
var hurdleImage = new Image();
hurdleImage.src = "https://user-images.githubusercontent.com/64878501/89603432-bf01b980-d886-11ea-8b7b-94418931ce39.png";

var score = 0;
function getHurdle() {

	var hurdle = {};
	hurdle.images = [hurdleImage];
	hurdle.width = 30;
	hurdle.height = 70;
	hurdle.x = width;
	hurdle.y = height - hurdle.height / 2 - 15;
	hurdle.isActive = true;
	hurdle.speedX = -9;
	hurdle.speedY = 0;

	hurdle.move = function () {
		this.x = this.x + this.speedX;
		if (this.x < -100) {
			this.isActive = false;
		}
	}

	return hurdle;
}


var landImage = new Image();
landImage.src = "res/img2.png";
var land = {};
land.width = 1900;
land.height = 420;
land.images = [landImage];
land.x = land.width / 2;
land.y = height -212;
land.speedX = -10;
land.speedY = 0;
land.repeatX = 1;
land.move = function () {
	this.x = this.x + this.speedX;
	if (this.x < -this.width / 2) {
		this.x += this.width;
	}
}

function isColliding(b1, b2) {
    if (Math.abs(b1.x - b2.x) <=30 &&(b2.y - b1.y) <=30) {
		clearInterval(f);

		return true;
    } 
    return false;
}
var counter = 0;
function update() {
	counter++;
	score += 5;
	if (!game_over&&counter % 30 == 0) {
		var cloud = getCloud();
		clouds.push(cloud);
	}

	if (!game_over&&counter % 89 == 0) {
		var hurdle = getHurdle();
		hurdles.push(hurdle);
	}
	if (!game_over&&counter % 149 == 0) {
		var hurdle = getHurdle();
		hurdles.push(hurdle);
	}
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, width, height);

	ctx.font = "30px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Score:" + parseInt(score / 10), width - 180, 50);

	dragon.move();
	drawObject(dragon);

	var cloudsFinal = [];
	for (var i = 0; i < clouds.length; i++) {
		var cloud = clouds[i];

		cloud.move();
		drawObject(cloud);

		if (!game_over&&cloud.isActive == true) {
			cloudsFinal.push(cloud);
		}
	}
	clouds = cloudsFinal;

	var hurdlesFinal = [];
	for (var i = 0; i < hurdles.length; i++) {
		var hurdle = hurdles[i];
		if(isColliding(dragon,hurdle)){
			game_over=true;
			audio.pause();
			audio1.play();
			ctx.drawImage(gameover,10,-75,700,500);
			ctx.font = "30px Verdana";
			ctx.fillText(" Score : "+ parseInt(score / 10),250,65);
		}
		else{
			hurdle.move();
			drawObject(hurdle);
		}

		if (!game_over&&hurdle.isActive == true) {
			hurdlesFinal.push(hurdle);
		}
	}
	hurdles = hurdlesFinal;


	if(!game_over){
		land.move();
		drawObject(land);

	}
}

var isMusicPlaying = false;
var isMusicPlaying1 = false;
var audio = new Audio('res/music.mp3');
var audio1 = new Audio('res/gameover.mp3');

document.addEventListener("keydown", function (event) {
	if (event.keyCode == 32) {
		if (dragon.y == 280) {
			playJumpAudio();
			dragon.speedY = -20;
		}
	}
	if(!game_over&&!isMusicPlaying) {
		isMusicPlaying = true;
		audio.play();
	}
});
var f=setInterval(update, 50);