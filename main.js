import { Application, Graphics, LineStyle } from 'pixijs';

let app;
const notes = [];
const judges = [];

class Note{
  view;
  constructor() {
    this.view = new Graphics();
    this.view.beginFill(0xff0000);
    this.view.drawRect(0,0,120,20);
    this.view.endFill();
    this.view.y = 200;
    this.view.x = 500;

    app.stage.addChild(this.view);
  }

  drop(){
    this.view.y += 7;
  }

  remove(){
    app.stage.removeChild(this.view);
  }
}

class NoteJudgement{
  constructor(id){
    this.view = new Graphics();

    this.view.lineStyle(5,0xffffff);
    this.view.drawRect(0,0,120,20);
    this.view.endFill();
    this.view.y = 800;
    this.view.x = id * 120 + 300;

    app.stage.addChild(this.view);
  }

  checkNote(){
    console.log(notes);
    for(let i=notes.length-1; i>=0; i--){
      const note = notes[i];
      console.log(note);
      if (
        note.view.y + note.view.height > this.view.y - 100 &&
        note.view.y + note.view.height < this.view.y + 100
      ) {
        note.remove();
        notes.splice(i, 1);
      }
    }
  }
}

class Init {
  constructor(){
    this.timing = [
      {
        time: 60,
      },
      {
        time: 120,
      },
      {
        time: 180,
      },
      {
        time: 240,
      },
      {
        time: 300,
      },
      {
        time: 360,
      },
    ]
    this.time = 0;
    this.index = 0;
  }

  update(delta){
    this.time += delta;
    
    while(this.index < this.timing.length){
      console.log(this.time, this.timing[this.index].time);
      if(this.time > this.timing[this.index].time) {
        notes.push(new Note());
        this.index += 1;
      }
      else break;
    }
  }
}

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  app = new Application({
    backgroundColor: 0x23272a,
    resizeTo: window,
    view: document.querySelector("#app"),
  });

  for(let i=0; i<4; i++){
    judges.push(new NoteJudgement(i));
  }

  const judge = new NoteJudgement();

  window.addEventListener("keydown", event =>{
    if(event.code == "Space"){
      judge.checkNote();
    }
  })

  notes.push(new Note());

  const init = new Init();

  app.ticker.add(delta => {
    loop(delta);
    init.update(delta);
  }); //1tick(1초에 60번)
})();

function loop(){
  notes.forEach(note => {
    note.drop();
  });
}