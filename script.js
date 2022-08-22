window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas-one")
  const ctx = canvas.getContext("2d")
  canvas.width = 500
  canvas.height = 500

  class InputHandler {
    constructor(game) {
      this.game = game
      window.addEventListener("keydown", (event) => {
        if (
          (event.key === "ArrowDown" || event.key === "ArrowUp") &&
          this.game.keys.indexOf(event.key) === -1
        ) {
          this.game.keys.push(event.key)
        } else if (event.key === " ") {
          this.game.player.shootTop()
        }
      })
      window.addEventListener("keyup", (event) => {
        if (this.game.keys.indexOf(event.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
        }
      })
    }
  }
  class Projectile {
    constructor(game, x, y) {
      this.game = game
      this.x = x
      this.y = y
      this.width = 10
      this.height = 3
      this.speed = 3
      this.markedForDestruction = false
    }
    update() {
      this.x += this.speed
      if (this.x > this.game.width * 0.8) this.markedForDestruction = true
    }
    draw(context) {
      context.fillStyle = "yellow"
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  class Particle {}
  class Player {
    constructor(game) {
      this.game = game
      this.width = 120
      this.height = 190
      this.x = 20
      this.y = 120
      this.speedY = 0
      this.maxSpeed = 3
      this.projectiles = []
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed
      else if (this.game.keys.includes("ArrowDown")) this.speedY = this.maxSpeed
      else this.speedY = 0
      this.y += this.speedY
      //handle projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update()
      })
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDestruction
      )
    }
    draw(context) {
      context.fillStyle = "green"
      context.fillRect(this.x, this.y, this.width, this.height)
      this.projectiles.forEach((projectile) => {
        projectile.draw(context)
      })
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        )
        this.game.ammo--
      }
    }
  }
  class Enemy {}
  class Layer {}
  class Background {}
  class UI {}
  class Game {
    constructor(width, height) {
      this.width = width
      this.height = height
      this.player = new Player(this)
      this.input = new InputHandler(this)
      this.keys = []
      this.ammo = 20
      this.maxAmmo = 50
      this.ammoTimer = 0
      this.ammoInterval = 500
    }
    update(deltaTime) {
      this.player.update()
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++
        this.ammoTimer = 0
      } else {
        this.ammoTimer += deltaTime
      }
    }
    draw(context) {
      this.player.draw(context)
    }
  }

  const game = new Game(canvas.width, canvas.height)
  let lastTime = 0
  // animation loop
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update(deltaTime)
    game.draw(ctx)
    requestAnimationFrame(animate)
  }
  animate(0)
})
