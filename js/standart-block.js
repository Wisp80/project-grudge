function StandartBlock(x, y, width, height) {
    this.character = new Character(
        x, y,
        width, height,
        new Animation('./src/tiger/tiger', 5), new Animation('./src/tiger/backwards/tiger.backwards', 5)
    );

    this.prepareStandartBlockData = function () {
        let isBlockMoving = false;

        let fourWaysFromBlock = [
            wayDown = { // farX, closeX, farY, closeY
                farX: this.character.x + this.character.width,
                closeX: this.character.x,
                farY: world.collisionMapHeight - this.character.height,
                closeY: this.character.y + this.character.height,
                name: 'wayDown'
            },

            // wayUp = { // farX, closeX, farY, closeY
            //     farX: this.character.x + this.character.width,
            //     closeX: this.character.x,
            //     farY: this.character.y,
            //     closeY: 0,
            //     name: 'wayUp'
            // },

            // wayRight = { // farX, closeX, farY, closeY
            //     farX: world.collisionMapWidth,
            //     closeX: this.character.x + this.character.width,
            //     farY: this.character.y + this.character.height,
            //     closeY: this.character.y,
            //     name: 'wayRight'
            // },

            // wayLeft = { // farX, closeX, farY, closeY
            //     farX: this.character.x,
            //     closeX: 0,
            //     farY: this.character.y + this.character.height,
            //     closeY: this.character.y,
            //     name: 'wayLeft'
            // }
        ];

        for (let i = 0; i < fourWaysFromBlock.length; i++) {
            // if (this.character.currentSpeedY === 0 && this.character.currentSpeedx === 0) {
                
            // };

            if (helper.checkIntersectionBetweenTwoNotRotatedRectangles(
                player.character.x + player.character.width, fourWaysFromBlock[i].closeX,
                player.character.x, fourWaysFromBlock[i].farX,
                player.character.y + player.character.height, fourWaysFromBlock[i].closeY,
                player.character.y, fourWaysFromBlock[i].farY
            )) {
                if (fourWaysFromBlock[i].name === 'wayDown') {
                    this.character.currentSpeedY = 3;
                } else if (fourWaysFromBlock[i].name === 'wayUp') {
                    this.character.currentSpeedY = -3;
                } else if (fourWaysFromBlock[i].name === 'wayRight') {
                    this.character.currentSpeedX = 3;
                } else if (fourWaysFromBlock[i].name === 'wayLeft') {
                    this.character.currentSpeedX = -3;
                };

                // isBlockMoving = true;
            } else {
                if (fourWaysFromBlock[i].name === 'wayDown' || fourWaysFromBlock[i].name === 'wayUp') {
                    this.character.currentSpeedY = 0;
                } else if (fourWaysFromBlock[i].name === 'wayRight' || fourWaysFromBlock[i].name === 'wayLeft') {
                    this.character.currentSpeedX = 0;
                };
            };
        };

        console.log(isBlockMoving);

        if (!game.finished) { this.character.prepareCharacterData() };
    };

    this.draw = function () { this.character.draw() };
};

const standartBlocks = {
    standartBlocksList: [
        new StandartBlock(500, 100, 20, 20),
    ],

    prepareStandartBlocksData: function () {
        for (let i = 0; i < standartBlocks.standartBlocksList.length; i++) { standartBlocks.standartBlocksList[i].prepareStandartBlockData() };
    }
};