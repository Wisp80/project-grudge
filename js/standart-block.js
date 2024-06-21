function StandartBlock(x, y, width, height, characterID) {
    this.character = new Character(
        x, y,
        width, height,
        new Animation('./src/blocks/standart-blocks/standart-block', 6), new Animation('./src/blocks/standart-blocks/backwards/standart-block', 6),
        characterID
    );

    this.absoluteSpeed = 4;
    this.isBlockMoving = false;

    this.prepareStandartBlockData = function () {
        let blockFieldsOfView = {
            'down': { // farX, closeX, farY, closeY
                farX: this.character.x + this.character.width,
                closeX: this.character.x,
                farY: world.collisionMapHeight - this.character.height,
                closeY: this.character.y + this.character.height
            },

            'up': { // farX, closeX, farY, closeY
                farX: this.character.x + this.character.width,
                closeX: this.character.x,
                farY: this.character.y,
                closeY: 0
            },

            'right': { // farX, closeX, farY, closeY
                farX: world.collisionMapWidth,
                closeX: this.character.x + this.character.width,
                farY: this.character.y + this.character.height,
                closeY: this.character.y
            },

            'left': { // farX, closeX, farY, closeY
                farX: this.character.x,
                closeX: 0,
                farY: this.character.y + this.character.height,
                closeY: this.character.y
            }
        };

        for (const fieldDirection in blockFieldsOfView) {
            if (helper.checkIntersectionBetweenTwoNotRotatedRectangles(
                player.character.x + player.character.width, blockFieldsOfView[fieldDirection].closeX,
                player.character.x, blockFieldsOfView[fieldDirection].farX,
                player.character.y + player.character.height, blockFieldsOfView[fieldDirection].closeY,
                player.character.y, blockFieldsOfView[fieldDirection].farY
            ) && !this.isBlockMoving) {
                this.isBlockMoving = true;

                switch (fieldDirection) {
                    case 'down': {
                        this.character.currentSpeedY = this.absoluteSpeed;
                        break;
                    };

                    case 'up': {
                        this.character.currentSpeedY = -1 * this.absoluteSpeed;
                        break;
                    };

                    case 'right': {
                        this.character.currentSpeedX = this.absoluteSpeed;
                        break;
                    };

                    case 'left': {
                        this.character.currentSpeedX = -1 * this.absoluteSpeed;
                        break;
                    };

                    default:
                        break;
                };
            };
        };

        if (this.character.currentSpeedX === 0 && this.character.currentSpeedY === 0) {
            this.isBlockMoving = false;
        };

        if (!game.finished) { this.character.prepareCharacterData() };
    };

    this.draw = function () { this.character.draw() };
};

const standartBlocks = {
    standartBlocksList: [
        new StandartBlock(100, 400, 36, 36, 1),
        new StandartBlock(400, 330, 36, 36, 2),
    ],

    prepareStandartBlocksData: function () {
        for (let i = 0; i < standartBlocks.standartBlocksList.length; i++) { standartBlocks.standartBlocksList[i].prepareStandartBlockData() };
    }
};