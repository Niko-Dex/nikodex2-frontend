export const tileMap = {
    "buttonClicked": [0, 0],
    "button": [1, 0],
    "ram": [2, 0],
    "pancake": [3, 0],
    "empty": [4, 0],
    "shovel": [4, 1],
    "chars": {
        "1": [0, 1], "2": [1, 1], "3": [2, 1], "4": [3, 1],
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

export enum Achievement {
    Baaaaaa = 1,
    Wool = 2,
    Tube_of_Water = 3,
    Strange_Journal = 4,
    Lightbulb = 5,
    PanPancake = 6,
    PancakeOverflow = 7,
    PancakeToTheSun = 8,
    PanToTheEdgeOfUniverseCake = 9,
    Unknown = 10,
    WhereIsMyHerd = 11,
}

export const achievements: { [ x: number ]: { name: string, description: string, hidden: boolean } } = {
    [Achievement.Baaaaaa]: {
        "name": "Baaaaaa",
        "description": "Finding the game",
        "hidden": false
    },
    [Achievement.Wool]: {
        "name": "Wool",
        "description": "Win a game of Ramsweeper in Easy difficulty",
        "hidden": false
    },
    [Achievement.Tube_of_Water]: {
        "name": "Tube of Water",
        "description": "Win a game of Ramsweeper in Medium difficulty",
        "hidden": false
    },
    [Achievement.Strange_Journal]: {
        "name": "Strange Journal",
        "description": "Win a game of Ramsweeper in Hard difficulty",
        "hidden": true
    },
    [Achievement.Lightbulb]: {
        "name": "Lightbulb",
        "description": "Win a game of Ramsweeper in 'Good Luck' (aka. Very Hard) difficulty",
        "hidden": true
    },
    [Achievement.PanPancake]: {
        "name": "Pan-Pancake",
        "description": "You can never have too many pancakes!",
        "hidden": false
    },
    [Achievement.PancakeOverflow]: {
        "name": "Pancake Overflow",
        "description": "Moar Pancakes!!!",
        "hidden": true
    },
    [Achievement.PancakeToTheSun]: {
        "name": "Pancake to the Sun",
        "description": "Even MOAR Pancakes!!!!!",
        "hidden": true
    },
    [Achievement.PanToTheEdgeOfUniverseCake]: {
        "name": "Pan-ToTheEdgeOfTheUniverse-cake!",
        "description": "p a n c a k e s",
        "hidden": true
    },
    [Achievement.Unknown]: {
        "name": "...",
        "description": "...",
        "hidden": true
    },
    [Achievement.WhereIsMyHerd]: {
        "name": "Where's my herd?!",
        "description": "And where did all my Ram gone???",
        "hidden": false
    }
}