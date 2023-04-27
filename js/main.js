var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload ()
{
    this.load.setPath('assets/flappy-bird-assets-master/')
    this.load.image('bird', 'sprites/bluebird-midflap.png');
    this.load.image('pipe', 'sprites/pipe-green.png');
    this.load.audio('jump', 'audio/wing.wav');
}

function create ()
{
    //this.add.image(200, 245, 'sky');

    bird = this.physics.add.sprite(100, 245, 'bird');
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);

    jumpSound = this.sound.add('jump');

    pipes = this.physics.add.group();

    timer = this.time.addEvent({ delay: 1500, callback: addRowOfPipes, callbackScope: this, loop: true });

    scoreText = this.add.text(20, 20, '0', { fontSize: '30px', fill: '#fff' });

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.physics.add.collider(bird, pipes, hitPipe, null, this);
}

function update ()
{
    if (bird.y < 0 || bird.y > 490)
    {
        restartGame.call(this);
    }

    if(this.keySpace.isDown){
        jump.call(this);
    }

    bird.angle += 1;

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
    scoreText.setText('');
    bird.setTint(0xff0000);
    restartGame();
}

function restartGame()
{
    score = 0;
    scoreText.setText('Game Over');
    pipes.clear(true, true);
    bird.destroy();
    timer.destroy();
    this.input.keyboard.enabled = false;
    this.time.addEvent({ delay: 3000, callback: () => {
            this.scene.restart();
        }, callbackScope: this, loop: false });
}

function addOnePipe (x, y)
{
    var pipe = pipes.create(x, y, 'pipe');
    pipe.setImmovable(true);
    pipe.setVelocityX(-200);

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
}

function addRowOfPipes ()
{
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++)
    {
        if (i === hole || i === hole + 1) continue;

        addOnePipe(400, i * 60 + 10);

        score += 1;
        scoreText.setText(score);
    }
}