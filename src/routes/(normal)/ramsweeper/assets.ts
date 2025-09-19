export const tileMap = {
    "buttonClicked": [0, 0],
    "button": [1, 0],
    "ram": [2, 0],
    "pancake": [3, 0],
    "empty": [4, 0],
    "chars": {
        "1": [0, 1], "2": [1, 1], "3": [2, 1], "4": [3, 1], "0": [4, 1],
        "5": [0, 2], "6": [1, 2], "7": [2, 2], "8": [3, 2], "9": [4, 2]
    },
}

export const tileMetadata = {
    "tileSize": [32, 32]
}

export const nikoMap = {
    "normal": 0,
    "clicked": 1,
    "yay": 2,
    "noo": 3,
    "uhh": 4,
    "...": 5 // TODO: remove this mf. it's dangerous...
}

export const nikoMetadata = {
    "tileSize": [64, 64]
}