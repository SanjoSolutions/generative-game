import {
  Assets,
  CompositeTilemap,
  Database,
  Game,
  TILE_HEIGHT,
  TILE_WIDTH,
  adjustXToStep,
  adjustYToStep,
  makeMountain,
  makeRiver,
  makeRivers,
  mapHeight,
  mapWidth,
} from "@sanjo/game-engine"

if (window.IS_DEVELOPMENT) {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  )
}

async function main() {
  const database = new Database()
  await database.open()
  const game = new Game(database)
  document.body.appendChild(game.app.view as any)

  const tileMap = new CompositeTilemap()
  game.app.stage.addChild(tileMap)

  Assets.add("tileset", "tileset.json")
  Assets.add("man", "sprites/man.png")
  Assets.add("tree", "sprites/tree.png")
  Assets.add("branch", "sprites/branch.png")
  await Assets.load(["tileset", "man", "tree", "branch"])

  for (let y = 0; y < mapHeight; y += TILE_HEIGHT) {
    for (let x = 0; x < mapWidth; x += TILE_WIDTH) {
      tileMap.tile("grass.png", x, y)
    }
  }

  makeRiver(tileMap, {
    width: 64,
    from: { x: 0.6 * mapWidth, y: 0 },
    to: { x: 0.7 * mapWidth, y: mapHeight },
  })

  makeMountain(tileMap, {
    from: {
      x: adjustXToStep(1 * TILE_WIDTH),
      y: adjustYToStep(0.6 * mapHeight),
    },
    to: {
      x: adjustXToStep(0.45 * mapWidth),
      y: adjustYToStep(0.9 * mapHeight),
    },
  })

  makeRivers(tileMap, { width: mapWidth, height: mapHeight })

  await game.load()

  window.addEventListener("keydown", function (event) {
    if (event.code === "Escape") {
      event.preventDefault()
      toggleMenu()
    }
  })

  let isMenuShown = false

  function toggleMenu(): void {
    if (isMenuShown) {
      hideMenu()
    } else {
      showMenu()
    }
  }

  function showMenu(): void {
    const menuFragment = (
      document.querySelector("#menu") as HTMLTemplateElement
    ).content.cloneNode(true) as DocumentFragment

    const menu = menuFragment.querySelector(".menu")!
    const menuContainer = menuFragment.querySelector(".menu-container")!

    menuContainer.addEventListener("click", function () {
      hideMenu()
    })

    menu.addEventListener("click", function (event) {
      event.stopPropagation()
    })

    document.body.appendChild(menuFragment)

    isMenuShown = true
  }

  function hideMenu(): void {
    document.querySelector(".menu-container")?.remove()
    isMenuShown = false
  }
}

main()
