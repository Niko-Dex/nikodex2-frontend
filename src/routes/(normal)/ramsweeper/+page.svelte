<script lang="ts">
    import { onMount } from "svelte";
    import {
        tileMetadata, tileMap,
        nikoMap, nikoMetadata,

        achievements, Achievement

    } from "./assets"
    import Tiles from "$lib/assets/images/page/ramsweeper/tiles.png"
    import Nikos from "$lib/assets/images/page/ramsweeper/niko.png"
    import toast, { Toaster } from "svelte-french-toast";

    const maxRamRatio = 0.9

    let ready = $state(false)

    let container = $state() as HTMLElement
    let canvas = $state() as HTMLCanvasElement
    let ctx: CanvasRenderingContext2D | null = null
    let image: HTMLImageElement | null = null

    let resetBtnCanvas = $state() as HTMLCanvasElement
    let resetBtnCanvasCtx: CanvasRenderingContext2D | null = null
    let resetBtnImg: HTMLImageElement | null = null

    let timePassed = $state(0)
    let startTime = -1
    let timeAnim = 0

    let clearedTile = $state(0)
    let pancakesLeft = $state(0)

    let achievementShow = $state(false)

    let settings = $state({
        w: 9,
        h: 9,
        b: 10,
        scale: 1
    })
    let preset = $state("easy")
    let selectedPreset = $state("easy")

    const Tile = {
        "button": 0,
        "clicked": 1,
        "ram": 2,
        "pancake": 3,
        "1": 5,
        "2": 6,
        "3": 7,
        "4": 8,
        "5": 9,
        "6": 10,
        "7": 11,
        "8": 12,
        "empty": 13
    }

    const BoardTile = {
        "safe": 0,
        "special_safe": 2,
        "ram": 1
    }

    const TileMapping = {
        [Tile.button]: tileMap.button,
        [Tile.clicked]: tileMap.buttonClicked,
        [Tile.ram]: tileMap.ram,
        [Tile.pancake]: tileMap.pancake,
        [Tile.empty]: tileMap.empty,
        [Tile["1"]]: tileMap.chars["1"],
        [Tile["2"]]: tileMap.chars["2"],
        [Tile["3"]]: tileMap.chars["3"],
        [Tile["4"]]: tileMap.chars["4"],
        [Tile["5"]]: tileMap.chars["5"],
        [Tile["6"]]: tileMap.chars["6"],
        [Tile["7"]]: tileMap.chars["7"],
        [Tile["8"]]: tileMap.chars["8"],
    }

    const topBarHeight = 0
    let gameState = $state({
        size: [9, 9],
        ramCount: 10,
        inProgress: true,
        selected: [-1, -1],
        haveClickFirst: false
    })
    let ramPlaced = 0
    let boardOffset = [0, 0]

    let gameBoard: number[][] = []
    let gameBoardData: number[][] = []
    let gameBoardPancake: boolean[][] = []

    $effect(() => {
        switch (selectedPreset) {
            case "medium":
                settings.w = 16
                settings.h = 16
                settings.b = 40
                break
            case "hard":
                settings.w = 30
                settings.h = 16
                settings.b = 99
                break
            case "what":
                settings.w = 66
                settings.h = 66
                settings.b = 666
                break
            case "easy":
            default:
                settings.w = 9
                settings.h = 9
                settings.b = 15
                break
        }
    })

    function getAchievements() {
        const store = Number(localStorage.getItem("achievements") ?? NaN)
        if (isNaN(store)) {
            localStorage.setItem("achievements", "0")
            return 0
        }

        return store
    }

    function hasAchievement(id: Achievement) {
        let store = getAchievements()
        return (store & (1 << id)) > 0
    }

    function setAchievement(id: Achievement) {
        let store = getAchievements()
        if (!hasAchievement(id)) {
            toast.success(`Achievement Unlocked: ${achievements[id].name}!`)
        }
        store |= 1 << id
        localStorage.setItem("achievements", store.toString())
    }


    function loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((res, rej) => {
            try {
                const image = new Image()
                image.src = src
                image.onload = () => res(image)
                image.onerror = (e) => rej(e)
            } catch (e) {
                rej(e)
            }
        })
    }

    function floorToFactor(num: number, factor: number) {
        return Math.floor(num * factor) / factor;
    }

    function countTime(t: number) {
        if (startTime < 0) startTime = performance.now()
        timePassed = Math.floor((t - startTime) / 1000)
        timeAnim = requestAnimationFrame(countTime)
    }

    function getScale() {
        const urlParams = new URLSearchParams(location.search)
        const scale = Number(urlParams.get("scale") ?? NaN)
        if (isNaN(scale)) return settings.scale
        return scale
        // let [ baseW, baseH ] = [ canvas.width, canvas.height ]
        // let [ viewW, viewH ] = [ innerWidth, innerHeight ]

        // let scale = Math.min(
        //     Math.floor(viewW / baseW),
        //     Math.floor(viewH / baseH),
        // )

        // return scale
    }

    function btnState(state: keyof typeof nikoMap) {
        if (!resetBtnCanvasCtx || !resetBtnImg) return
        resetBtnCanvasCtx.clearRect(0, 0, resetBtnCanvas.width, resetBtnCanvas.height)
        resetBtnCanvasCtx.drawImage(
            resetBtnImg,
            nikoMap[state] * nikoMetadata.tileSize[0], 0,
            nikoMetadata.tileSize[0], nikoMetadata.tileSize[1],
            0, 0, nikoMetadata.tileSize[0], nikoMetadata.tileSize[1]
        )
    }

    function resizeCanvas() {
        let [ baseW, baseH ] = [ canvas.width, canvas.height ]
        const scale = getScale()

        canvas.style.width = `${baseW * scale}px`
        canvas.style.height = `${baseH * scale}px`
    }

    function autoResize() {
        settings.scale = 1
        resizeCanvas()
        // resizeElement()

        let padding = [ 0, 0 ]

        const { width, height } = container.getBoundingClientRect()
        let [ viewW, viewH ] = [ innerWidth, innerHeight ]

        let scale = Math.min(
            floorToFactor(viewW / (width + padding[0]), 5),
            floorToFactor(viewH / (height + padding[1]), 5),
        )

        settings.scale = scale
        resizeCanvas()
        // resizeElement()
    }

    function drawBoard() {
        if (!image || !ctx) return
        const tSize = tileMetadata.tileSize
        for (let i = 0; i < gameState.size[0]; i++) {
            for (let j = 0; j < gameState.size[1]; j++) {
                const tile = gameBoard[i][j]
                ctx.drawImage(
                    image,
                    TileMapping[Tile["clicked"]][0] * tSize[0], TileMapping[Tile["clicked"]][1] * tSize[1],
                    tSize[0], tSize[1],
                    i * tSize[0] + boardOffset[0], j * tSize[0] + boardOffset[1],
                    tSize[0], tSize[1],
                )
                ctx.drawImage(
                    image,
                    TileMapping[tile][0] * tSize[0], TileMapping[tile][1] * tSize[1],
                    tSize[0], tSize[1],
                    i * tSize[0] + boardOffset[0], j * tSize[0] + boardOffset[1],
                    tSize[0], tSize[1],
                )
                if (gameBoardPancake[i][j]) {
                    ctx.drawImage(
                        image,
                        TileMapping[Tile["pancake"]][0] * tSize[0], TileMapping[Tile["pancake"]][1] * tSize[1],
                        tSize[0], tSize[1],
                        i * tSize[0] + boardOffset[0], j * tSize[0] + boardOffset[1],
                        tSize[0], tSize[1],
                    )
                }
            }
        }
    }

    function countAdjacentRam(x: number, y: number) {
        let cnt = 0
        for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, gameState.size[0] - 1); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, gameState.size[1] - 1); j++) {
                if (gameBoardData[i][j] == BoardTile.ram) cnt++
            }
        }
        return cnt
    }

    function spreadClear(x: number, y: number) {
        if (x < 0 || y < 0 || x >= gameState.size[0] || y >= gameState.size[1]) return
        const cntRam = countAdjacentRam(x, y)
        const neighbor = [ [-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1] ]
        if (gameBoardPancake[x][y]) return
        if (cntRam == 0) {
            if (gameBoard[x][y] == Tile.empty) return
            clearedTile++
            gameBoard[x][y] = Tile.empty
            for (let n of neighbor) {
                spreadClear(x + n[0], y + n[1])
            }
        } else {
            if (gameBoard[x][y] != Tile.button && gameBoard[x][y] != Tile.clicked) return
            clearedTile++
            gameBoard[x][y] = Tile[String(cntRam) as keyof typeof Tile]
        }
    }

    function placeRam() {
        while (ramPlaced < gameState.ramCount) {
            const randX = Math.floor(Math.random() * gameState.size[0])
            const randY = Math.floor(Math.random() * gameState.size[1])
            if (gameBoardData[randX][randY] == BoardTile.safe) {
                gameBoardData[randX][randY] = BoardTile.ram
                ramPlaced++
            }
        }
    }

    function checkWin() {
        if (gameState.size[0] * gameState.size[1] - clearedTile <= gameState.ramCount) {
            if (gameState.ramCount == 0) {
                setAchievement(Achievement.WhereIsMyHerd)
            } else {
                switch (preset) {
                    case "easy":
                        setAchievement(Achievement.Wool)
                        break
                    case "medium":
                        setAchievement(Achievement.Tube_of_Water)
                        break
                    case "hard":
                        setAchievement(Achievement.Strange_Journal)
                        break
                    case "what":
                        setAchievement(Achievement.Lightbulb)
                        break
                }
            }

            btnState("yay")
            gameState.inProgress = false
            cancelAnimationFrame(timeAnim ?? 0)
        }
    }

    function gameOver() {
        btnState("noo")
        gameState.inProgress = false
        cancelAnimationFrame(timeAnim ?? 0)

        for (let i = 0; i < gameState.size[0]; i++) {
            for (let j = 0; j < gameState.size[1]; j++) {
                if (gameBoardData[i][j] == BoardTile.ram) {
                    gameBoard[i][j] = Tile.ram
                }
            }
        }
    }

    function checkAndUpdate(mouseClick: number, x: number, y: number) {
        if (mouseClick == 2) {
            if (gameBoardPancake[x][y]) {
                pancakesLeft++
                gameBoardPancake[x][y] = false
            } else {
                pancakesLeft--
                gameBoardPancake[x][y] = true
            }

            if (gameState.ramCount - pancakesLeft >= gameState.size[0] * gameState.size[1]) {
                btnState("uhh")
                switch (preset) {
                    case "easy":
                        setAchievement(Achievement.PanPancake)
                        break
                    case "medium":
                        setAchievement(Achievement.PancakeOverflow)
                        break
                    case "hard":
                        setAchievement(Achievement.PancakeToTheSun)
                        break
                    case "what":
                        setAchievement(Achievement.PanToTheEdgeOfUniverseCake)
                        break
                }
            } else {
                btnState("normal")
            }
            return
        }
        if (gameBoardPancake[x][y]) return
        switch (gameBoardData[x][y]) {
            case BoardTile.safe:
                spreadClear(x, y)
                break
            case BoardTile.ram:
                if (!gameState.haveClickFirst) {
                    gameBoardData[x][y] = BoardTile.special_safe
                    ramPlaced--
                    placeRam()
                    spreadClear(x, y)
                } else {
                    gameBoard[x][y] = Tile.ram
                    gameOver()
                }
                break
        }
    }

    function getTilePos(ev: MouseEvent) {
        const scale = getScale()

        const rect = canvas.getBoundingClientRect()
        let x = ev.clientX - rect.left
        let y = ev.clientY - rect.top

        x /= scale
        y /= scale

        x -= boardOffset[0]
        y -= boardOffset[1]

        const tileX = Math.floor(x / tileMetadata.tileSize[0])
        const tileY = Math.floor(y / tileMetadata.tileSize[1])
        return [tileX, tileY]
    }

    function clickDown(ev: MouseEvent) {
        if (!gameState.inProgress) return
        const [tileX, tileY] = getTilePos(ev)
        if (tileX < 0 || tileY < 0 || tileX >= gameState.size[0] || tileY >= gameState.size[1]) return
        if (gameBoard[tileX][tileY] != Tile.button) return
        gameState.selected = [tileX, tileY]
        if (ev.button == 0) {
            if (gameBoardPancake[tileX][tileY]) return
            btnState("clicked")
            gameBoard[tileX][tileY] = Tile.clicked
        }
    }

    function clickUp(ev: MouseEvent) {
        if (!gameState.inProgress) return
        btnState("normal")
        const [tileX, tileY] = getTilePos(ev)

        if (gameState.selected[0] != tileX || gameState.selected[1] != tileY) {
            try {
                if (gameBoard[gameState.selected[0]][gameState.selected[1]] != Tile.clicked) return
                gameBoard[gameState.selected[0]][gameState.selected[1]] = Tile.button
                return
            } catch (e) {}
        }
        if (tileX < 0 || tileY < 0 || tileX >= gameState.size[0] || tileY >= gameState.size[1]) return
        checkAndUpdate(ev.button, tileX, tileY)
        checkWin()

        if (!gameState.haveClickFirst) timeAnim = requestAnimationFrame(countTime)
        gameState.haveClickFirst = true
        selectedPreset = preset
    }

    function update() {
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        drawBoard()
        requestAnimationFrame(update)
    }

    function init() {
        if (!settings.w || settings.w <= 0) {
            alert("Invalid width!")
            return
        }

        if (!settings.h || settings.h <= 0) {
            alert("Invalid height!")
            return
        }

        if (!settings.b || settings.b <= 0 || settings.b > settings.w * settings.h * maxRamRatio) {
            alert("Invalid amount of Ram specified!")
            return
        }

        preset = selectedPreset

        gameState.size[0] = settings.w
        gameState.size[1] = settings.h
        gameState.ramCount = settings.b

        startTime = -1
        timePassed = 0
        clearedTile = 0
        pancakesLeft = gameState.ramCount
        gameState.haveClickFirst = false
        canvas.width = tileMetadata.tileSize[0] * gameState.size[0]
        canvas.height = tileMetadata.tileSize[1] * gameState.size[1] + topBarHeight
        gameState.inProgress = true
        gameBoard = []
        gameBoardData = []
        gameBoardPancake = []
        ramPlaced = 0

        cancelAnimationFrame(timeAnim)
        if (Math.random() < 0.01) {
            btnState("...")
            setAchievement(Achievement.Unknown)
        }
        else {
            btnState("normal")
        }
        for (let i = 0; i < gameState.size[0]; i++) {
            gameBoard.push([])
            gameBoardData.push([])
            gameBoardPancake.push([])
            for (let j = 0; j < gameState.size[1]; j++) {
                gameBoard[i].push(Tile.button)
                gameBoardData[i].push(BoardTile.safe)
                gameBoardPancake[i].push(false)
            }
        }

        placeRam()

        boardOffset = [
            (canvas.width - tileMetadata.tileSize[0] * gameState.size[0]) / 2,
            topBarHeight
        ]

        autoResize()
    }

    onMount(async () => {
        if (!hasAchievement(Achievement.Baaaaaa)) {
            setAchievement(Achievement.Baaaaaa)
        }

        ctx = canvas.getContext("2d")
        image = await loadImage(Tiles)

        resetBtnCanvasCtx = resetBtnCanvas.getContext("2d")
        resetBtnImg = await loadImage(Nikos)

        init()
        requestAnimationFrame(update)

        addEventListener("resize", () => {
            autoResize()
        })

        addEventListener("mousedown", clickDown)
        addEventListener("mouseup", clickUp)
        canvas.addEventListener("contextmenu", (ev) => ev.preventDefault())

        ready = true
    })
</script>
<Toaster></Toaster>
<div class="flex flex-col gap-4 w-min m-4 no-antialias mx-auto max-w-full px-4" bind:this={container}>
    <h1 class="h1-txt-size text-center">Ramsweeper!</h1>
    <div class="flex gap-2 justify-center items-center">
        <label>
            Presets
            <select class="min-w-[48px] w-full p-2 border-1" bind:value={selectedPreset} disabled={gameState.haveClickFirst}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="what">Good luck :3 (not recommended for weak devices)</option>
                <option value="custom">Custom...</option>
            </select>
        </label>
        <label>
            Width
            <input type="number" class="min-w-[48px] w-full p-2" bind:value={settings.w} disabled={selectedPreset != "custom"}>
        </label>
        <label>
            Height
            <input type="number" class="min-w-[48px] w-full p-2" bind:value={settings.h} disabled={selectedPreset != "custom"}>
        </label>
        <label>
            Rams
            <input type="number" class="min-w-[48px] w-full p-2" bind:value={settings.b} disabled={selectedPreset != "custom"}>
        </label>
    </div>
    <div class="flex justify-between items-center px-8 text-3xl sm:text-4xl md:text-5xl">
        <p>{pancakesLeft.toString().padStart(3, '0')}</p>
        <button
        class="box-content bg-[#693353] border-4 border-t-[#9e4c7e] border-l-[#9e4c7e] border-b-[#3d1830] border-r-[#3d1830] active:bg-[#3d1830] active:border-t-[#18072b] active:border-l-[#18072b] active:border-b-[#693353] active:border-r-[#693353]"
        aria-label="Start game"
        onclick={init}
        >
            <canvas bind:this={resetBtnCanvas} width={nikoMetadata.tileSize[0]} height={nikoMetadata.tileSize[1]}></canvas>
        </button>
        <p>{timePassed.toString().padStart(3, '0')}</p>
    </div>
    <div class="max-w-screen overflow-x-auto">
        <p class="text-sm">you may need to scroll if you device is small --&gt;</p>
        <canvas width="360" height="360" bind:this={canvas} class="mx-auto"></canvas>
    </div>
    <div class="flex gap-4">
        <button class="btn grow" onclick={() => { achievementShow = true }}>Achievements</button>
    </div>
</div>

{#if ready && achievementShow}
<div class="fixed w-screen h-screen top-0 left-0 z-5 bg-black/75 flex justify-center">
    <div class="border-4 border-(--theme-color) p-4 bg-black flex gap-4 max-w-[1200px] mx-8 my-auto overflow-auto max-h-screen w-full flex-col">
        <div class="flex justify-between items-center">
            <h1 class="h1-txt-size">Achievements</h1>
            <div>
                <button class="btn" onclick={() => { localStorage.removeItem("achievements"); achievementShow = false }}>Reset</button>
                <button class="btn" onclick={() => { achievementShow = false }}>Close</button>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            {#each Object.keys(achievements).map(v => Number(v)) as id}
                <div class="border-4 border-(--theme-color) p-4">
                    {#if achievements[id].hidden && !hasAchievement(id)}
                    <h2 class="h2-txt-size">{hasAchievement(id) ? "✅" : "❌"} <em>[hidden]</em></h2>
                    <p><em>Details for this achievement will be revealed once unlocked.</em></p>
                    {:else}
                    <h2 class="h2-txt-size">{hasAchievement(id) ? "✅" : "❌"} {achievements[id].name}</h2>
                    <p>{achievements[id].description}</p>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
{/if}