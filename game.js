kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });

  //Buttons

  function addButton(txt, p, f) {
  
    const bg = add([
      pos(p),
      rect(60, 30),
      origin("center"),
      color(1, 1, 1),
    ]);

    add([
      text(txt),
      pos(p),
      origin("center"),
      color(0, 0, 0),
    ]);

    bg.action(() => {
      if (bg.isHovered()) {
        bg.color = rgb(0.8, 0.8, 0.8);
        if (mouseIsClicked()) {
          f();
        }
      } else {
        bg.color = rgb(1, 1, 1);
      }
    });

  }
  function visitPage(){
    window.location='https://wonderful-ardinghelli-01f24f.netlify.app/';
}
  
  // Speed identifiers
  const MOVE_SPEED = 120;
  const JUMP_FORCE = 360;
  const BIG_JUMP_FORCE = 550;
  let CURRENT_JUMP_FORCE = JUMP_FORCE;
  const FALL_DEATH = 400;
  const ENEMY_SPEED = 20;
  
  // Game logic
  
  let isJumping = true;
  
  loadSprite("coin", "./images/coin.png");
  loadSprite("evil-shroom", "images/evil-shroom1.png");
  loadSprite("brick", "images/brick.png");
  loadSprite("block", "images/block.png");
  loadSprite("mario", "images/mario.png");
  loadSprite("mushroom", "images/mushroom.png");
  loadSprite("surprise", "images/surprise.png");
  loadSprite("unboxed", "images/unboxed.png");
  loadSprite("pipetopleft", "images/pipetopleft.png");
  loadSprite("pipetopright", "images/pipetopright.png");
  loadSprite("pipebottomleft", "images/pipebottomleft.png");
  loadSprite("pipebottomright", "images/pipebottomright.png");
  
  loadSprite("blue-block", "images/blue-block.png");
  loadSprite("blue-brick", "images/blue-brick.png");
  loadSprite("blue-steel", "images/blue-steel.png");
  loadSprite("blue-evil-shroom", "images/blue-evil-shroom.png");
  loadSprite("blue-surprise", "images/blue-surprise.png");
  
  scene("main", () => {

    
    addButton("start", vec2(100, 100), () => {
      go("game", { level: 0, score: 0 })
    });
  
    addButton("quit", vec2(100, 150), () => {
      visitPage();
    });
  
  });
  
  start("main");

  scene("game", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");
  
    const maps = [
      [
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "                                      ",
        "     %   =*=%=                        ",
        "                                      ",
        "                            -+        ",
        "                    ^   ^   ()        ",
        "==============================   =====",
      ],
      [
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£        @@@@@               x x        £",
        "£             @            x x x        £",
        "£                        x x x x  x   -+£",
        "£               z   z  x x x x x  x   ()£",
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
      ],
      [
        "                                        ",
        "                                        ",
        "                                        ",
        "                                        ",
        "                                        ",
        "        %   =*=%=                       ",
        "                 =                      ",
        "                     -+                 ",
        "      ^   ^          ()                 ",
        "===================  =========   =======",
      ],
      [
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£                                       £",
        "£        @@@@@@              x x        £",
        "£       @                  x x x        £",
        "£                        x x x x  x   -+£",
        "£      z   z           x x x x x  x   ()£",
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !!!",
      ],
      [
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "                                         ",
        "        %   =*=%=     =%=                ",
        "                 =        =  =           ",
        "                             =    -+     ",
        "      ^   ^                 ==    ()     ",
        "===================  =========   =======",
      ],
    ];
  
    const levelCfg = {
      width: 20,
      height: 20,
      "=": [sprite("block"), solid()],
      $: [sprite("coin"), "coin"],
      "%": [sprite("surprise"), solid(), "coin-surprise"],
      "*": [sprite("surprise"), solid(), "mushroom-surprise"],
      "}": [sprite("unboxed"), solid()],
      "(": [sprite("pipebottomleft"), solid(), scale(0.5)],
      ")": [sprite("pipebottomright"), solid(), scale(0.5)],
      "-": [sprite("pipetopleft"), solid(), scale(0.5), "pipe"],
      "+": [sprite("pipetopright"), solid(), scale(0.5), "pipe"],
      "^": [sprite("evil-shroom"), solid(), "dangerous"],
      "#": [sprite("mushroom"), solid(), "mushroom", body()],
      "!": [sprite("blue-block"), solid(), scale(0.5)],
      "£": [sprite("blue-brick"), solid(), scale(0.5)],
      z: [sprite("blue-evil-shroom"), solid(), scale(0.5), "dangerous"],
      "@": [sprite("blue-surprise"), solid(), scale(0.5), "coin-surprise"],
      x: [sprite("blue-steel"), solid(), scale(0.5)],
    };
  
    const gameLevel = addLevel(maps[level], levelCfg);
  
    const scoreLabel = add([
      text(score),
      pos(30, 6),
      layer("ui"),
      {
        value: score,
      },
    ]);
  
    add([text("level " + parseInt(level + 1)), pos(40, 6)]);
  
    function big() {
      let timer = 0;
      let isBig = false;
      return {
        update() {
          if (isBig) {
            CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
            timer -= dt();
            if (timer <= 0) {
              this.smallify();
            }
          }
        },
        isBig() {
          return isBig;
        },
        smallify() {
          this.scale = vec2(1);
          CURRENT_JUMP_FORCE = JUMP_FORCE;
          timer = 0;
          isBig = false;
        },
        biggify(time) {
          this.scale = vec2(2);
          timer = time;
          isBig = true;
        },
      };
    }
  
    const player = add([
      sprite("mario"),
      solid(),
      pos(30, 0),
      body(),
      big(),
      origin("bot"),
    ]);
  
    action("mushroom", (m) => {
      m.move(20, 0);
    });
  
    player.on("headbump", (obj) => {
      if (obj.is("coin-surprise")) {
        gameLevel.spawn("$", obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn("}", obj.gridPos.sub(0, 0));
      }
      if (obj.is("mushroom-surprise")) {
        gameLevel.spawn("#", obj.gridPos.sub(0, 1));
        destroy(obj);
        gameLevel.spawn("}", obj.gridPos.sub(0, 0));
      }
    });
  
    player.collides("mushroom", (m) => {
      destroy(m);
      player.biggify(6);
    });
  
    player.collides("coin", (c) => {
      destroy(c);
      scoreLabel.value++;
      scoreLabel.text = scoreLabel.value;
    });
  
    action("dangerous", (d) => {
      d.move(-ENEMY_SPEED, 0);
    });
  
    player.collides("dangerous", (d) => {
      if (isJumping) {
        destroy(d);
      } else {
        go("lose", { score: scoreLabel.value });
      }
    });
  
    player.action(() => {
      camPos(player.pos);
      if (player.pos.y >= FALL_DEATH) {
        go("lose", { score: scoreLabel.value });
      }
    });
  
    player.collides("pipe", () => {
      keyPress("down", () => {
        go("game", {
          level: (level + 1) % maps.length,
          score: scoreLabel.value,
        });
      });
    });
  
    keyDown("left", () => {
      player.move(-MOVE_SPEED, 0);
    });
  
    keyDown("right", () => {
      player.move(MOVE_SPEED, 0);
    });
  
    player.action(() => {
      if (player.grounded()) {
        isJumping = false;
      }
    });
  
    keyPress("space", () => {
      if (player.grounded()) {
        isJumping = true;
        player.jump(CURRENT_JUMP_FORCE);
      }
    });
  });
  
  
  scene("lose", ({ score }) => {
    add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
    
      addButton("back", vec2(100, 100), () => {
        go("main")
      });
  });
  
  start("game", { level: 0, score: 0 });
  
