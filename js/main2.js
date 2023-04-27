var config = {
    type: Phaser.AUTO,
    width: 288*4,
    height: 512,
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var bird;
var pipes;
var score = 0;
var scoreText;
var timer;
var jumpSound;
var birdHeight;
var gameover = false;
var bgs;
var bases;

function preload ()
{
    this.load.setPath('assets/')
    this.load.image('bird', 'sprites/bluebird-midflap.png');
    this.load.image('pipe', 'sprites/pipe-green.png');
    this.load.image('background', 'sprites/background-day.png');
    this.load.audio('jump', 'audio/wing.wav');
    this.load.image('base', 'sprites/base.png');
}

function create ()
{
    bgs = this.add.group()
    bases = this.add.group();

    for(let i =0;i<7;i++) {
        let bg = this.physics.add.sprite(288/2  +  i * 288, 512 / 2, 'background');
        bg.body.allowGravity = false
        bg.setVelocityX(-200);
        bgs.add(bg);
    }

    bird = this.physics.add.sprite(100, 245, 'bird');

    for(let i = 0;i < 7;i++) {
        let base = this.physics.add.sprite(336 / 2 + i * 336, this.physics.world.bounds.height - 112 / 2, 'base');
        base.body.allowGravity = false
        base.setVelocityX(-200);
        base.setImmovable(true)
        bases.add(base)
    }
    birdHeight = bird.body.height;
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);

    jumpSound = this.sound.add('jump');

    pipes = this.add.group()

    timer = this.time.addEvent({ delay: 1500,callback: addRowOfPipes, callbackScope: this, loop: true });

    scoreText = this.add.text(20, 20, '0', { fontSize: '30px', fill: '#fff' });

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.physics.add.collider(bird, pipes, hitPipe, null, this);
    this.physics.add.collider(bird, bases, hitPipe, null, this);
}

function update ()
{
    if (bird.y < 0 || bird.y > 490)
    {
       // gameOver.call(this);
    }

    bgs.children.entries.forEach(bg=>{
        if(bg.x + bg.body.width/2 < 0){
            var maxX = 0
            for(let b of bgs.children.entries){
                if(b.x > maxX){
                    maxX = b.x
                }
            }
            bg.x = maxX + bg.body.width;
        }
    })

    bases.children.entries.forEach(bg=>{
        if(bg.x + bg.body.width/2 < 0){
            var maxX = 0
            for(let b of bases.children.entries){
                if(b.x > maxX){
                    maxX = b.x
                }
            }
            bg.x = maxX + bg.body.width;
        }
    })

    if(this.keySpace.isDown){
        if(gameover){
            gameover = false;
            this.scene.restart()
        }else {
            jump.call(this);
        }
    }

    if(!gameover) {
        bird.angle += 1;
    }

    //console.log(pipes.children)

    if((bird.y +  birdHeight / 2) >= this.physics.world.bounds.height){
        gameOver.call(this)
    }

    pipes.children.entries.forEach(pipe=>{
        if(!pipe.calcScore && bird.x >= pipe.x + pipe.body.width/2 - bird.body.width/2){
            score+=0.5;
            scoreText.setText(score)
            pipe.calcScore = true
        }
    })

}

function jump ()
{
    if (bird.body)
    {
        console.log('jump.')
        bird.body.setVelocityY(-400);
        console.log(this)
        this.tweens.add({
            targets: bird,
            props: { angle: -20 },
            duration: 100,
            ease: 'Power0',
            yoyo: false,
            repeat: 0
        });

        jumpSound.play();
    }
}

function hitPipe()
{
    this.physics.pause();
    //scoreText.setText('0');
    bird.setTint(0xff0000);
    gameOver.call(this);
}

function gameOver()
{
    score = 0;
    //scoreText.setText('Game Over');
    //pipes.clear(true, true);
    //bird.destroy();
    timer.destroy();
    this.physics.pause();
    //this.input.keyboard.enabled = false;
    gameover = true;
    // this.time.addEvent({ delay: 3000, callback: () => {
    //         this.scene.restart();
    //     }, callbackScope: this, loop: false });
}

function addOnePipe (x, y)
{
    var pipe = this.physics.add.sprite(x, y, 'pipe');
    //pipe.setCollideWorldBounds(true);
    pipe.setBounce(0);
   pipe.body.allowGravity = false
    //pipe.setImmovable(true)
    pipe.setVelocityX(-200);
    //console.log(pipe)
    pipe.setImmovable(true);
    //pipe.setVelocityX(-200);

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

    pipes.add(pipe)

    return pipe
}

function addRowOfPipes ()
{
    //var hole = Math.floor(Math.random() * 5) + 1;


    //let group = this.add.group();
    let topPipe = addOnePipe.call(this, 1500, 0);
    //topPipe.y = Phaser.Math.Between(-topPipe.body.height/2 * 0.7, topPipe.body.height/2)
   // topPipe.setOrigin(0.5, 0)
    //topPipe.y = 0
    //console.log(topPipe.y)
    //topPipe.texture.source[0].height;
    //var topPipeTextureHeight = topPipe.height;
   // var hole = Phaser.Math.Between(1, 5);
    //var topPipeHeight = Phaser.Math.Between(topPipeTextureHeight * 0.3, topPipeTextureHeight);
    //topPipe.setOrigin(0.5, 0.5)
    //topPipe.scaleY = 1
    topPipe.angle = 180
    //topPipe.body.height = 11
    //group.add(topPipe);
    console.log(topPipe.y)
    let worldHeight = this.physics.world.bounds.height;
    console.log(worldHeight)
    //worldHeight - (topPipe.y + topPipe.body.height/2) +
    console.log(bird.body)
    let minHole = worldHeight - (topPipe.y + topPipe.body.height/2) - topPipe.body.height + 5 * bird.body.height
    let maxHole = minHole + topPipe.body.height * 0.3
    let hole = Phaser.Math.Between(minHole, maxHole);
    let bottomPipe = addOnePipe.call(this, 1500,  topPipe.y + topPipe.body.height + hole, false);
    //var bottomPipeHeight = this.physics.world.bounds.height - (topPipeHeight + 150 + topPipeTextureHeight);
    //bottomPipe.y = this.physics.world.bounds.height - bottomPipeHeight;
    //group.add(bottomPipe);
    //pipes.push(group)







    //addOnePipe.call(this, 400, 50);

    // for (var i = 0; i < 2; i++)
    // {
    //     if (i === hole || i === hole + 1) continue;
    //
    //
    //
    //     score += 1;
    //     scoreText.setText(score);
    // }
}