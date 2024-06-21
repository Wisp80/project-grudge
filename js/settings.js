const playerDefaultSettings = {
    x: 320,
    y: 80,
    width: 40,
    height: 40,
    maxJumpHeight: 200,
    currentSpeedXToTheRight: 4,
    currentSpeedXToTheLeft: -4,
    currentSpeedYUp: -4,
    currentSpeedYDown: 4,
};

const worldDefaultSettings = {
    worldGridCellSizeForNormalSpeeds: 10,
    worldGridCellSizeForHighSpeeds: 10,
};

const collisionMapImageBase64 = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABVYAAAMACAYAAADPPjzCAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4yMfEgaZUAAB49SURBVHhe7d2LcqNIgkDR1v7/P2uLrXGPSiuXdSVEJnBOBNGOtsPCPBJ0K40v//zzz/XXAgAAAADAk/7nP/8FAAAAAOBJwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEwioAAAAAQCSsAgAAAABEl1/L9feH41yvw1cBAAAAANihy2VJnNszYxUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAIBJWAQAAAAAiYRUAAAAAILr8Wq6/Pxzneh2+CgAAAABwWpfLkgn/btaG98y6f4KwCgAAAAAnt4ewOiqgfsejAAAAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACASVgEAAAAAImEVAAAAACC6/Fquvz8c53odvgoA07hclqH5MeMlAAAAn/C396JfRr8nfWYdt2TGKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAAAABAJKwCAAAAAETCKgAA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'