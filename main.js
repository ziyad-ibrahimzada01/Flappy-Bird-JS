const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const bird = {x:50, y:canvas.height/2 - 20, width:60, height:40, vy:0, ay:800 }
const columns = []
const GAP = 150
const COLUMN_VELOCITY = -200
const COLUMN_DISTANCE = 300
let isEnd = false
const images = {
  bg: new Image(),
  bird: new Image(),
  column: new Image(),
}
images.bg.src = "images/bg.png"
images.bird.src = "images/bird.png"
images.column.src = "images/column.png"
images.bird.onload = () => {
  bird.width = images.bird.naturalWidth / 10
  bird.height = images.bird.naturalHeight / 10
}


function addColumnPair(){
    const h = random(10, canvas.height - 10 -GAP)
    columns.push(
        {
            x:canvas.width,
            y:0,
            width:50, 
            height:h

        },
        {
            x:canvas.width,
            y:GAP + h,
            width:50, 
            height:canvas.height - h - GAP

        }
    )
}
function random(a,  b){
    return Math.floor(Math.random()*(b-a+1))+a
}
function isCollision(a, b) {
  return !(
    b.y + b.height < a.y ||
    a.x + a.width < b.x ||
    a.y + a.height < b.y ||
    b.x + b.width < a.x
  )
}

let prevTime = performance.now()
function gameLoop(now = performance.now()){
    const dt = (now - prevTime)/1000
    prevTime = now
    
    update(dt)
    render()
    if(!isEnd){

        window.requestAnimationFrame(gameLoop)
    }
    
    
}
function update(dt){
    bird.vy+= bird.ay*dt
    bird.y += bird.vy*dt
   if(bird.y<0){
    isEnd = true
   }
   if (bird.y + bird.height > canvas.height) {
  isEnd = true
  bird.y = canvas.height - bird.height
}

    for(const column of columns){
        column.x += COLUMN_VELOCITY*dt
        if (isCollision(bird, column)) {
      isEnd = true;
    }
    }
    const lastColumn = columns.at(-1)
    if(canvas.width - lastColumn.x>COLUMN_DISTANCE){
        addColumnPair()
    }
    const firstColumn = columns.at(0)
  if (firstColumn.x < -100) {
    columns.shift()
    columns.shift()
  }
}
function render(){
    ctx.fillStyle = "lightblue"
    ctx.drawImage (images.bg, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "yellow"
    ctx.drawImage (images.bird, bird.x, bird.y, bird.width, bird.height)
    for(const column of columns){
        ctx.fillStyle = "green"
    ctx.drawImage (images.column, column.x, column.y, column.width, column.height)
    }
    if (isEnd) {
    ctx.font = "50px Courier"
    ctx.fillStyle = "red"
    ctx.fillText("Game over", 10, 100)
  }
}
document.addEventListener("keydown", function (e){
    bird.vy  =-400

})
document.addEventListener("click",  function (e){
    bird.vy  =-400

})
addColumnPair()

gameLoop()

