// src/game.js
import { levels, currentLevelIndex, getCurrentLevel, goToNextLevel, resetLevels } from './levels/levelManager.js';

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#f0f0f0',
    parent: 'game-container',
    scene: [LevelSelectScene, GameScene]
};

let game = new Phaser.Game(config);

function LevelSelectScene() {
    Phaser.Scene.call(this, { key: 'LevelSelectScene' });
}
LevelSelectScene.prototype = Object.create(Phaser.Scene.prototype);
LevelSelectScene.prototype.constructor = LevelSelectScene;

LevelSelectScene.prototype.preload = function () {
    this.load.image('bg', 'assets/images/background_placeholder.png');
    this.load.audio('click', 'assets/sounds/click.mp3');
};

LevelSelectScene.prototype.create = function () {
    this.add.image(180, 320, 'bg').setScale(0.5);
    this.clickSound = this.sound.add('click');
    this.add.text(100, 50, 'Select a Level', { fontSize: '24px', fill: '#000' });

    levels.forEach((level, i) => {
        const btn = this.add.text(150, 120 + i * 40, `Level ${level.id}`, {
            fontSize: '20px', fill: '#007bff'
        }).setInteractive();

        btn.on('pointerdown', () => {
            this.clickSound.play();
            currentLevelIndex = i;
            this.scene.start('GameScene');
        });

        // Add hover effect to level buttons
        btn.on('pointerover', () => {
            btn.setStyle({ fill: '#ff6347' });
        });
        btn.on('pointerout', () => {
            btn.setStyle({ fill: '#007bff' });
        });
    });
};

function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

let mickey;
let goalZone;

GameScene.prototype.preload = function () {
    this.load.image('mickey', 'assets/images/mickey_placeholder.png');
    this.load.image('bg', 'assets/images/background_placeholder.png');
    this.load.audio('success', 'assets/sounds/success.mp3');
    this.load.audio('click', 'assets/sounds/click.mp3');
};

GameScene.prototype.create = function () {
    const level = getCurrentLevel();

    this.add.image(180, 320, 'bg').setScale(0.5);

    this.successSound = this.sound.add('success');
    this.clickSound = this.sound.add('click');

    goalZone = this.add.rectangle(level.goal.x, level.goal.y, 50, 50, 0x00ff00, 0.3);

    mickey = this.add.image(level.mickeyStart.x, level.mickeyStart.y, 'mickey').setInteractive();
    this.input.setDraggable(mickey);

    // Add Mickey bounce effect
    this.tweens.add({
        targets: mickey,
        y: '+=10',
        duration: 300,
        yoyo: true,
        repeat: -1
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    // Add Home Button
    const homeBtn = this.add.text(10, 10, '🏠 Home', {
        fontSize: '18px', fill: '#000', backgroundColor: '#fff', padding: { x: 5, y: 2 }
    }).setInteractive();

    homeBtn.on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('LevelSelectScene');
    });

    // Add Reset Button
    const resetBtn = this.add.text(280, 10, '🔄 Reset', {
        fontSize: '18px', fill: '#000', backgroundColor: '#fff', padding: { x: 5, y: 2 }
    }).setInteractive();

    resetBtn.on('pointerdown', () => {
        this.clickSound.play();
        this.scene.restart();
    });
};

GameScene.prototype.update = function () {
    if (Phaser.Geom.Intersects.RectangleToRectangle(mickey.getBounds(), goalZone.getBounds())) {
        this.successSound.play();
        if (goToNextLevel()) {
            this.scene.restart();
        } else {
            alert('Congratulations! You finished all levels!');
            resetLevels();
            this.scene.start('LevelSelectScene');
        }
    }
};
