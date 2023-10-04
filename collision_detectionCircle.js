const canvas=document.querySelector("canvas")
const c=canvas.getContext("2d")
canvas.height=window.innerHeight
canvas.width=window.innerWidth

const colorArr=[
    "#2185C5",
    "#7ECEFD",
    // "#FFF6CF",
    "#FF7F66",
]



function Circle(x,y,dx,dy,r){
    this.x=x
    this.y=y
    this.dx=dx
    this.dy=dy
    this.r=r
    this.minRadius=30
    this.maxRadius=60
    this.randomColor=colorArr[Math.floor(Math.random()*colorArr.length)]
    this.mass=Math.floor(Math.random()*5+1)
    this.opacity=0
    this.draw= function(){
        c.beginPath()
        c.arc(this.x,this.y,this.r,0,Math.PI*2,false)
        c.save()
        c.globalAlpha=this.opacity
        c.fillStyle=this.randomColor
        c.fill()
        c.restore()
        c.strokeStyle=this.randomColor
        c.stroke()
    }
    this.changeDirection= function(){

            // to check if max/min width of screen is hit
        if((this.x+this.r)>=innerWidth|| (this.x-this.r)<=0){
            this.dx=-this.dx// reverse dir
        }
        if(this.y+this.r>=innerHeight||this.y-this.r<=0){
            this.dy=-this.dy // reverse dir
        }     
    }
    this.animate=function(circleArr){    
        this.draw()
        this.x+=this.dx
        this.y+=this.dy
        this.referenceParticle(circleArr)
        this.changeDirection()        
        this.resize()  
        
    }
    this.resize=function(){

        //to check cirlce within mouse range i.e., with x and y axis AND to check how large circle can be maxed
        if(Math.abs(mouse.x-this.x)<80 && Math.abs(mouse.y-this.y)<80 && this.r<this.maxRadius && this.opacity<0.5){
        // if(mouse.x<this.x && this.r<this.maxRadius && mouse.y>=this.y && mouse.y<=this.y+20  ){
        // this.r+=2
        //to increase opcity on hover
            this.opacity=0.4
        // console.log(Math.abs(mouse.x-this.x))
        }
        // for size decrease
        // else if(this.r>this.minRadius){
        // this.r-=1          
        // }

        // for colour decrease after hover is over
        else if(this.opacity>0){
            this.opacity-=0.2
            this.opacity=Math.max(0,this.opacity)
        }
    }
    this.referenceParticle=(circleArr)=>{
        for(let j=0;j<circleArr.length;j++){
            if(this===circleArr[j]) continue
            if(isColliding(distanceBetween(this.x,this.y,circleArr[j].x,circleArr[j].y),this.r)){
                // this.dx=-this.dx
                // this.dy=-this.dy
                // console.log("collided!");
                resolveCollision(this,circleArr[j])
        }
    }
}

}

// Utilities
function distanceBetween(a,b,x,z){
    return (Math.sqrt(Math.pow((x-a),2) + Math.pow((z-b),2)))
}
 
function isColliding(x,r){
    if(x < (2*r))
        return true
    else
        return false

}
function rotate(dx,dy,angle){
    const rotatedVelocity={
        x: dx*Math.cos(angle)-dy*Math.sin(angle),
        y: dx*Math.sin(angle)+dy*Math.cos(angle),
    }
    return rotatedVelocity
}


function resolveCollision(circleArr,otherCirlceArr){

    const xVelocityDiff = circleArr.dx - otherCirlceArr.dx;
    const yVelocityDiff = circleArr.dy - otherCirlceArr.dy;

    const xDist = circleArr.x - otherCirlceArr.x;
    const yDist = circleArr.y - otherCirlceArr.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist <= 0) {
        
        const angle= -Math.atan2(otherCirlceArr.y-circleArr.y, otherCirlceArr.x-circleArr.x)

        const u1= rotate(circleArr.dx,circleArr.dy,angle)
        const u2= rotate(otherCirlceArr.dx,otherCirlceArr.dy,angle)

        const m1=circleArr.mass
        const m2=otherCirlceArr.mass

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        const originalv1=rotate(v1.x,v1.y,-angle)
        const originalv2=rotate(v2.x,v2.y,-angle)

        circleArr.dx=originalv1.x
        circleArr.dy=originalv1.y

        otherCirlceArr.dx=originalv2.x
        otherCirlceArr.dy=originalv2.y
    }
}



const mouse={
    x:undefined,
    y:undefined,
}
window.addEventListener("mousemove",function(e){
    // console.log(e.x);
    mouse.x=e.x
    mouse.y=e.y
}
)

// Set your desired number of circle 
const circleRadius=20
const maxCirclesHorizontal = Math.floor(window.innerWidth / (2 * circleRadius));
const maxCirclesVertical = Math.floor(window.innerHeight / (2 * circleRadius));
const maxCircles = Math.min(maxCirclesHorizontal, maxCirclesVertical);

let circleArr=[]
for(let i=0;i<=6*maxCircles;i++){
    const r=circleRadius
    let x=Math.floor(Math.random()*(innerWidth-2*r+1)+r)
    let y=Math.floor(Math.random()*(innerHeight-2*r+1)+r)
    const dx=Math.floor((Math.random()-0.5)*10)
    const dy=Math.floor((Math.random()-0.5)*10)
    if(i!==0){
        for(let j=0;j<circleArr.length;j++){
            if(isColliding(distanceBetween(x,y,circleArr[j].x,circleArr[j].y),r)){
                 x=Math.floor(Math.random()*(innerWidth-2*r+1)+r)
                 y=Math.floor(Math.random()*(innerHeight-2*r+1)+r)
                 j=-1;
        }
    } 
  }
    circleArr.push(new Circle(x,y,dx,dy,r))   
}

function animation(){
    requestAnimationFrame(animation)
    c.clearRect(0,0,innerWidth,innerHeight)
    circleArr.forEach((eachCircle)=>{
        eachCircle.animate(circleArr)    
    })

}
animation()