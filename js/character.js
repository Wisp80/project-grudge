function Character(x, y, width, height, runningSpriteRight, runningSpriteLeft) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentSpeedX = 0;
    this.currentDirectionXForDrawing = 'right';
    this.currentDirectionX = 'right'; // is not used at this point
    this.currentDirectionY = 'down'; // is not used at this point
    this.currentSpeedY = 0;
    this.runningSpriteRight = runningSpriteRight;
    this.runningSpriteLeft = runningSpriteLeft;
    this.leadingEdgeX = 0;
    this.trailingEdgeX = 0;

    this.prepareCharacterData = function () {
        this.defineDirectionXForDrawing();
        this.applyMovementX();
        this.applyMovementY();
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    this.calculateIntersection = function (predictedPosition, worldGridCell) { // function to calculate data about an intersection
        const currentIntersection = {};

        currentIntersection.x = predictedPosition.x >= worldGridCell[0] ? predictedPosition.x : worldGridCell[0]; // X-coordinate

        currentIntersection.farX = predictedPosition.x + predictedPosition.width <= worldGridCell[0] + worldGridCell[2] ?
            predictedPosition.x + predictedPosition.width : worldGridCell[0] + worldGridCell[2]; // far X-coordinate

        currentIntersection.y = predictedPosition.y >= worldGridCell[1] ? predictedPosition.y : worldGridCell[1]; // Y-coordinate

        currentIntersection.farY = predictedPosition.y + predictedPosition.height <= worldGridCell[1] + worldGridCell[3] ?
            predictedPosition.y + predictedPosition.height : worldGridCell[1] + worldGridCell[3]; // far Y-coordinate

        currentIntersection.width = currentIntersection.farX - currentIntersection.x; // width
        currentIntersection.height = currentIntersection.farY - currentIntersection.y; // height

        return currentIntersection;
    };

    this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell = function (currentIntersection, worldGridCell) { // function to check if any pixel inside an intersection is a solid one
        const pixelCount = (currentIntersection.width + 1) * (currentIntersection.height + 1);

        for (let i = 0; i < pixelCount; i++) { // iterate through every pixel
            const x = currentIntersection.x + i % (currentIntersection.width + 1);
            const y = currentIntersection.y + Math.floor(i / (currentIntersection.width + 1));

            for (let cellSolidPixel of worldGridCell[5]) { // iterate through every solid pixel in the cell
                if (cellSolidPixel.x === x && cellSolidPixel.y === y) { return true }; // check if a pixel in the intersection is a solid one
            };
        };

        return false;
    };

    this.checkPixelCollisionBetweenCurrentIntersectionAndGridCellOld1 = function (currentIntersection, worldGridCell) { // function to check if any pixel inside an intersection is a solid one
        for (let k = currentIntersection.x; k <= currentIntersection.x + currentIntersection.width; k++) { // iterate through X-Axis from left to right
            for (let l = currentIntersection.y; l <= currentIntersection.y + currentIntersection.height; l++) { // iterate through Y-Axis from top to bottom
                for (let value of worldGridCell[5]) { // iterate through every solid pixel in the cell
                    if (value.x === k && value.y === l) { return true }; // check if a pixel in the intersection is a solid one
                };
            };
        };

        return false;
    };

    this.prepareDataAboutTheCellsCharacterCollidesWith = function (position) {
        let firstRowID = Math.trunc(position.y / world.worldGridCellSize);
        let firstColumnID = Math.trunc(position.x / world.worldGridCellSize);
        let lastRowID;
        let lastColumnID;
        const rowsIDs = [];
        const columnsIDs = [];

        if ((position.y + position.height) % world.worldGridCellSize === 0) {
            lastRowID = ((position.y + position.height) / world.worldGridCellSize) - 1;
        } else {
            lastRowID = Math.trunc((position.y + position.height) / world.worldGridCellSize);
        };

        if ((position.x + position.width) % world.worldGridCellSize === 0) {
            lastColumnID = ((position.x + position.width) / world.worldGridCellSize) - 1;
        } else {
            lastColumnID = Math.trunc((position.x + position.width) / world.worldGridCellSize);
        };

        for (let i = firstRowID; i <= lastRowID; i++) { rowsIDs.push(i) };
        for (let i = firstColumnID; i <= lastColumnID; i++) { columnsIDs.push(i) };

        return {
            rowsIDs: rowsIDs,
            columnsIDs: columnsIDs
        };
    };

    this.applyMovementX = function () { // the ninth non-bugged version, simplified a lot of moments, stable 58-59 fps?
        let nextX = this.x + this.currentSpeedX; // raw prediction of next X
        let isPredictedXChanged = false; // if our raw prediction of next X has changed or not

        if (this.currentSpeedX !== 0) { // if we have any X-movement
            if (Math.abs(this.currentSpeedX) > this.width) { // in order to prevent from teleportation through objects we check if our speed is greater than our width
                let predictedHorizontalWayToTheRight = null; // variable for our predicted way to the right
                let predictedHorizontalWayToTheLeft = null; // variable for our predicted way to the left

                if (this.currentSpeedX > 0) { // if we move to the right, we prepare data about the way we are going to make
                    predictedHorizontalWayToTheRight = {
                        x: this.x + this.width,
                        y: this.y,
                        width: this.currentSpeedX - this.width,
                        height: this.height
                    };
                };

                if (this.currentSpeedX < 0) { // if we move to the left, we prepare data about the way we are going to make
                    predictedHorizontalWayToTheLeft = {
                        x: this.x - Math.abs(this.currentSpeedX) + this.width,
                        y: this.y,
                        width: Math.abs(this.currentSpeedX) - this.width,
                        height: this.height
                    };
                };

                let chosenPredictedWay = predictedHorizontalWayToTheRight ? predictedHorizontalWayToTheRight : predictedHorizontalWayToTheLeft; // choose one of the predicted ways
                const { rowsIDs, columnsIDs } = this.prepareDataAboutTheCellsCharacterCollidesWith(chosenPredictedWay); // prepare data about the cells we collide with in order to ignore checking every cell
                const cellCount = (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1) * (columnsIDs[columnsIDs.length - 1] - columnsIDs[0] + 1);

                for (let i = 0; i < cellCount; i++) { // iterate through every cell we collide with
                    const row = rowsIDs[0] + i % (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1);
                    const col = columnsIDs[0] + Math.floor(i / (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1));

                    if (world.worldGrid.length !== 0 && world.worldGrid[row][col][4] === true) { // check if the cell contains any solid pixels
                        let currentIntersection = this.calculateIntersection(chosenPredictedWay, world.worldGrid[row][col]); // we use data about solid pixels only in intersection between the predicted way and the cell in order to ignore checking every solid pixel in the cell

                        if (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                            while (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                                chosenPredictedWay.x -= Math.sign(this.currentSpeedX);
                                currentIntersection = this.calculateIntersection(chosenPredictedWay, world.worldGrid[row][col]);
                            };

                            nextX = predictedHorizontalWayToTheRight ? predictedHorizontalWayToTheRight.x + predictedHorizontalWayToTheRight.width - this.width : predictedHorizontalWayToTheLeft.x;
                            isPredictedXChanged = true;
                        };
                    };
                };
            };

            if (!isPredictedXChanged) { // if we have not changed our raw prediction of next X yet
                const predictedHorizontalPosition = { // predict our position
                    x: nextX,
                    y: this.y,
                    width: this.width,
                    height: this.height
                };

                const { rowsIDs, columnsIDs } = this.prepareDataAboutTheCellsCharacterCollidesWith(predictedHorizontalPosition); // prepare data about the cells we collide with in order to ignore checking every cell
                const cellCount = (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1) * (columnsIDs[columnsIDs.length - 1] - columnsIDs[0] + 1);

                for (let i = 0; i < cellCount; i++) { // iterate through every cell we collide with
                    const row = rowsIDs[0] + i % (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1);
                    const col = columnsIDs[0] + Math.floor(i / (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1));

                    if (world.worldGrid.length !== 0 && world.worldGrid[row][col][4] === true) { // check if if the cell contains any solid pixels
                        let currentIntersection = this.calculateIntersection(predictedHorizontalPosition, world.worldGrid[row][col]); // we use data about solid pixels only in intersection between the predicted position and the cell in order to ignore checking every solid pixel in the cell

                        if (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                            while (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                                predictedHorizontalPosition.x -= Math.sign(this.currentSpeedX);
                                currentIntersection = this.calculateIntersection(predictedHorizontalPosition, world.worldGrid[row][col]);
                            };

                            nextX = predictedHorizontalPosition.x;
                            isPredictedXChanged = true;
                        };
                    };
                };
            };
        };

        if (isPredictedXChanged) { this.currentSpeedX = 0 }; // if we have changed our raw prediction of next X, then it means that we hit a solid object, so we need to stop
        this.x = nextX;
    };

    this.applyMovementY = function () { // the ninth non-bugged version, simplified a lot of moments, stable 58-59 fps?
        let nextY = this.y + this.currentSpeedY; // raw prediction of next Y
        let isPredictedYChanged = false; // if our raw prediction of next Y has changed or not

        if (this.currentSpeedY !== 0) { // if we have any Y-movement         
            if (Math.abs(this.currentSpeedY) > this.height) { // in order to prevent from teleportation through objects we check if our speed is greater than our height
                let predictedVerticalWayDown = null; // variable for our predicted way down
                let predictedVerticalWayUp = null; // variable for our predicted way up

                if (this.currentSpeedY > 0) { // if we move down, we prepare data about the way we are going to make
                    predictedVerticalWayDown = {
                        x: this.x,
                        y: this.y + this.height,
                        width: this.width,
                        height: this.currentSpeedY - this.height
                    };
                };

                if (this.currentSpeedY < 0) { // if we move up, we prepare data about the way we are going to make
                    predictedVerticalWayUp = {
                        x: this.x,
                        y: this.y - Math.abs(this.currentSpeedY) + this.height,
                        width: this.width,
                        height: Math.abs(this.currentSpeedY) - this.height
                    };
                };

                let chosenPredictedWay = predictedVerticalWayDown ? predictedVerticalWayDown : predictedVerticalWayUp; // choose one of the predicted ways
                const { rowsIDs, columnsIDs } = this.prepareDataAboutTheCellsCharacterCollidesWith(chosenPredictedWay); // prepare data about the cells we collide with in order to ignore checking every cell
                const cellCount = (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1) * (columnsIDs[columnsIDs.length - 1] - columnsIDs[0] + 1);

                for (let i = 0; i < cellCount; i++) { // iterate through every cell we collide with
                    const row = rowsIDs[0] + i % (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1);
                    const col = columnsIDs[0] + Math.floor(i / (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1));

                    if (world.worldGrid.length !== 0 && world.worldGrid[row][col][4] === true) { // check if the cell contains any solid pixels
                        let currentIntersection = this.calculateIntersection(chosenPredictedWay, world.worldGrid[row][col]); // we use data about solid pixels only in intersection between the predicted way and the cell in order to ignore checking every solid pixel in the cell

                        if (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                            while (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                                chosenPredictedWay.y -= Math.sign(this.currentSpeedY);
                                currentIntersection = this.calculateIntersection(chosenPredictedWay, world.worldGrid[row][col]);
                            };

                            nextY = predictedVerticalWayDown ? predictedVerticalWayDown.y + predictedVerticalWayDown.height - this.height : predictedVerticalWayUp.y;
                            isPredictedYChanged = true;
                        };
                    };
                };
            };

            if (!isPredictedYChanged) { // if we have not changed our raw prediction of next Y yet
                const predictedVerticalPosition = { // predict our position
                    x: this.x,
                    y: nextY,
                    width: this.width,
                    height: this.height
                };

                const { rowsIDs, columnsIDs } = this.prepareDataAboutTheCellsCharacterCollidesWith(predictedVerticalPosition); // prepare data about the cells we collide with in order to ignore checking every cell
                const cellCount = (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1) * (columnsIDs[columnsIDs.length - 1] - columnsIDs[0] + 1);

                for (let i = 0; i < cellCount; i++) { // iterate through every cell we collide with
                    const row = rowsIDs[0] + i % (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1);
                    const col = columnsIDs[0] + Math.floor(i / (rowsIDs[rowsIDs.length - 1] - rowsIDs[0] + 1));

                    if (world.worldGrid.length !== 0 && world.worldGrid[row][col][4] === true) { // check if if the cell contains any solid pixels
                        let currentIntersection = this.calculateIntersection(predictedVerticalPosition, world.worldGrid[row][col]); // we use data about solid pixels only in intersection between the predicted position and the cell in order to ignore checking every solid pixel in the cell

                        if (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                            while (this.checkPixelCollisionBetweenCurrentIntersectionAndGridCell(currentIntersection, world.worldGrid[row][col])) {
                                predictedVerticalPosition.y -= Math.sign(this.currentSpeedY);
                                currentIntersection = this.calculateIntersection(predictedVerticalPosition, world.worldGrid[row][col]);
                            };

                            nextY = predictedVerticalPosition.y;
                            isPredictedYChanged = true;
                        };
                    };
                };
            };
        };

        if (isPredictedYChanged) { // if we have changed our raw prediction of next Y, then it means that we hit a solid object, so we need to stop
            this.currentSpeedY = 0;
        };

        this.y = nextY;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    this.findIfCharacterIsMovingX = function () { return this.currentSpeedX !== 0 };
    this.findIfCharacterIsMovingY = function () { return this.currentSpeedY !== 0 };

    this.findLeadingEdgeXOfCharacter = function () {
        if (this.currentSpeedX < 0) { return this.leadingEdgeX = this.x }
        else { return this.leadingEdgeX = this.x + this.width };
    };

    this.defineDirectionX = function () { // is not used at this point
        if (this.currentSpeedX > 0) { this.currentDirectionX = 'right' }
        else if (this.currentSpeedX < 0) { this.currentDirectionX = 'left' }
        else { this.currentDirectionX = 'noXdirection' };
    };

    this.defineDirectionY = function () { // is not used at this point
        if (this.currentSpeedY > 0) { this.currentDirectionY = 'down' }
        else if (this.currentSpeedY < 0) { this.currentDirectionY = 'up' }
        else { this.currentDirectionY = 'noYdirection' };
    };

    this.drawHitbox = function (drawAtX) {
        ctx.strokeStyle = 'rgb(234, 0, 255)';
        ctx.lineWidth = 1;
        ctx.strokeRect(drawAtX, this.y, this.width, this.height);
    };

    this.drawSpawnPosition = function () {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(playerDefaultSettings.x, 0);
        ctx.lineTo(playerDefaultSettings.x, 480);
        ctx.stroke();
    };

    this.drawPredictedWays = function (drawAtX) {
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        ctx.strokeRect(drawAtX + this.width, this.y, playerDefaultSettings.currentSpeedXToTheRight - this.width, this.height); // ⇒
        ctx.strokeRect(drawAtX - Math.abs(playerDefaultSettings.currentSpeedXToTheLeft) + this.width, this.y, Math.abs(playerDefaultSettings.currentSpeedXToTheLeft) - this.width, this.height); // ⇐
        ctx.strokeRect(drawAtX, this.y + this.height, this.width, worldDefaultSettings.gravity - this.height); // ⇓
        ctx.strokeRect(drawAtX, this.y - Math.abs(playerDefaultSettings.currentSpeedY) + this.height, this.width, Math.abs(playerDefaultSettings.currentSpeedY) - this.height); // ⇑
    };

    this.defineDirectionXForDrawing = function () {
        if (this.currentSpeedX > 0) { this.currentDirectionXForDrawing = 'right' }
        else if (this.currentSpeedX < 0) { this.currentDirectionXForDrawing = 'left' };
    };

    this.draw = function () {
        let drawAtX = this.x - world.distanceTravelledFromSpawnPoint;

        /*Проверяем не прошел ли игрок дальше точки спавна в левую сторону, и если так, то двигаем изображения персонажа.*/
        drawAtX = drawAtX > this.x ? this.x : drawAtX;

        /*Проверяем не находится ли игрок в конце уровня в правой стороне, и если так, то двигаем изображения персонажа.*/
        if (world.findIfPlayerIsAtLevelEnd()) {
            drawAtX = world.screenWidth - (world.levelImage.width - world.distanceTravelledFromSpawnPoint - (this.x - world.distanceTravelledFromSpawnPoint));
        };

        let sprite = null;

        if (this.currentDirectionXForDrawing === 'right') { sprite = this.runningSpriteRight }
        else if (this.currentDirectionXForDrawing === 'left') { sprite = this.runningSpriteLeft };

        if (!game.finished) {
            this.drawHitbox(drawAtX);
            // this.drawSpawnPosition();
            // this.drawPredictedWays(drawAtX);

            if (this.findIfCharacterIsMovingY()) {
                sprite.drawFrame(4, drawAtX, this.y, this.width, this.height);
            } else if (this.findIfCharacterIsMovingX()) {
                sprite.drawAnimation(game.ticks, drawAtX, this.y, this.width, this.height);
            } else {
                sprite.drawFrame(1, drawAtX, this.y, this.width, this.height);
            };
        };
    };

    this.collidesWith = function (other) {
        if (this.x >= other.x &&
            this.x <= other.x + other.width &&
            this.y >= other.y &&
            this.y <= other.y + other.height) {
            return true;
        };

        return false;
    };

    this.checkPixelCollisionUpDownLeftRight = function (x, y, width, height) { // is not used at this point
        for (let i = x; i <= x + width; i++) {
            for (let j = y; j <= y + height; j++) {
                if (world.findIfPixelIsSolidSurface(i, j)) {
                    return { x: i, y: j };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionUpDownRightLeft = function (x, y, width, height) { // is not used at this point
        for (let i = x + width; i >= x; i--) {
            for (let j = y; j <= y + height; j++) {
                if (world.findIfPixelIsSolidSurface(i, j)) {
                    return { x: i, y: j };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionDownUpLeftRight = function (x, y, width, height) { // is not used at this point
        for (let i = x; i <= x + width; i++) {
            for (let j = y + height; j >= y; j--) {
                if (world.findIfPixelIsSolidSurface(i, j)) {
                    return { x: i, y: j };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionDownUpRightLeft = function (x, y, width, height) { // is not used at this point
        for (let i = x + width; i >= x; i--) {
            for (let j = y + height; j >= y; j--) {
                if (world.findIfPixelIsSolidSurface(i, j)) {
                    return { x: i, y: j };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionLeftRightUpDown = function (x, y, width, height) {
        for (let i = y; i <= y + height; i++) {
            for (let j = x; j <= x + width; j++) {
                if (world.findIfPixelIsSolidSurface(j, i)) {
                    return { x: j, y: i };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionLeftRightDownUp = function (x, y, width, height) {
        for (let i = y + height; i >= y; i--) {
            for (let j = x; j <= x + width; j++) {
                if (world.findIfPixelIsSolidSurface(j, i)) {
                    return { x: j, y: i };
                };
            };
        };

        return null;
    };

    this.checkPixelCollisionRightLeftDownUp = function (x, y, width, height) {
        for (let i = y + height; i >= y; i--) {
            for (let j = x + width; j >= x; j--) {
                if (world.findIfPixelIsSolidSurface(j, i)) {
                    return { x: j, y: i };
                };
            };
        };

        return null;
    }
};