import { Application, Graphics, LineStyle, Sprite, Text, Texture } from 'pixijs';

function createGradTexture() {
  // adjust it if somehow you need better quality for very very big images
  const quality = 256;
  const canvas = document.createElement("canvas");

  canvas.width = 1;
  canvas.height = quality;

  const ctx = canvas.getContext("2d");

  // use canvas2d API to create gradient
  const grd = ctx.createLinearGradient(0, 0, 1, quality);

  grd.addColorStop(0, "rgba(255, 255, 255, 0.0)");
  grd.addColorStop(0.5, "rgba(255,255,255,0.05)");
  grd.addColorStop(1, "rgba(255,255,255,0.2)");

  ctx.fillStyle = grd; 
  ctx.fillRect(0,0,1,quality);

  return Texture.from(canvas);
}

let app;
const notes = [];
const judges = [];

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];

class Note{
  speed = 10;
  view;
  constructor(i,x,y) {
    this.view = new Graphics();
    this.view.beginFill(colors[i]);
    this.view.drawRect(0,0,120,20);
    this.view.endFill();
    this.view.y = y;
    this.view.x = x;
    this.index = i;

    app.stage.addChild(this.view);
  }

  drop(){
    this.view.y += this.speed;
    if(this.view.y >=650) this.remove();
  }

  remove(){
    app.stage.removeChild(this.view);
  }
}

class NoteJudgement{
  JUDGE_GOOD = 70;
  JUDGE_GREAT = 40;
  constructor(id,x, y){
    this.view = new Graphics();

    this.view.lineStyle(5,0xffffff);
    this.view.drawRect(0,0,120,40);
    this.view.endFill();
    this.view.y = y;
    this.view.x = x;
    this.index = id;

    app.stage.addChild(this.view);

    this.effect = new Sprite(createGradTexture());
    this.effect.position .set(x,0);
    this.effect.width = 120;
    this.effect.height = y;
    this.effect.visible = false;

    app.stage.addChild(this.effect);

    const texts = ['<', '>', '^', 'v'];
    this.text = new Text(texts[this.index],{
      fill: '#ffffff',
      fontSize: 36,
  });
  (this.text.x = x+60 - 16), (this.text.y = y+20 - 18);

  app.stage.addChild(this.text);
  }

  on(){
    this.effect.visible = true;
  }
  off(){
    this.effect.visible = false; 
  }

  checkNote(){
    console.log(notes);
    for(let i=notes.length-1; i>=0; i--){
      const note = notes[i];
      if (note.index != this.index) continue;
      if (
        note.view.y + note.view.height > this.view.y - this.JUDGE_GREAT &&
        note.view.y + note.view.height < this.view.y + this.JUDGE_GREAT
      ) {
        note.remove();
        notes.splice(i, 1);
        return 20;
      }
      if (
        note.view.y + note.view.height > this.view.y - this.JUDGE_GOOD &&
        note.view.y + note.view.height < this.view.y + this.JUDGE_GOOD
      ) {
        note.remove();
        notes.splice(i, 1);
        return 10;
      }
    }
    return 0;
  }
}

class Init {
  constructor(){

    this.timing = [];
    for(let i=0; i<1000; i++){
      this.timing.push({
        index : Math.floor(Math.random()*4), //0~3.9999
        time : i*30 + Math.random()*30,
      });
    }
    this.timing.sort((a,b) => a.time-b.time);
    this.time = 0;
    this.index = 0;
  }

  update(delta){
    this.time += delta;
    
    while(this.index < this.timing.length){
      const t = this.timing[this.index];
      console.log(this.time, this.timing[this.index].time);
      if(this.time > t.time) {
        notes.push(new Note(t.index, t.index*120, 0 ));
        this.index += 1;
      }
      else break;
    }
  }
}

class GameManager {
  constructor(){
    this.score = 0;
    for(let i=0; i<4; i++){
      judges.push(new NoteJudgement(i, i*120,600));
    }
    this.scoreText = new Text(this.score, {
      fill: '#ffffff',
      fontSize: 48,
    });
    this.scoreText.x = 600;
    this.scoreText.y = 50;
    app.stage.addChild(this.scoreText);
  }
  start(){  
    const init = new Init();
  
    app.ticker.add(delta => {
      loop(delta);
      init.update(delta);
    }); //1tick(1초에 60번)

    window.addEventListener("keydown", event =>{
      let idx; 
      switch(event.code){
        case "ArrowLeft":
          idx = 0 ;
          break;
        case "ArrowRight":
          idx = 1;
          break;
        case "ArrowUp":
          idx = 2;
          break;
        case "ArrowDown":
          idx = 3;
          break;
        default:
          return;
      }
      this.score += judges[idx].checkNote();
      this.scoreText.text = this.score;
      judges[idx].on();
    });
    window.addEventListener("keyup", event =>{
      let idx; 
      switch(event.code){
        case "ArrowLeft":
          idx = 0 ;
          break;
        case "ArrowRight":
          idx = 1;
          break;
        case "ArrowUp":
          idx = 2;
          break;
        case "ArrowDown":
          idx = 3;
          break;
        default:
          return;
      }
      judges[idx].off();
    });
  }
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  app = new Application({
    backgroundColor: 0x23272a,
    view: document.querySelector("#app"),
    width : 800,
    height: 800,
  });  
  const manager = new GameManager();
  manager.start();
})();

function loop(){
  notes.forEach(note => {
    note.drop();
  });
}