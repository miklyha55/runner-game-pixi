import { Container } from "pixi.js";
import * as TWEEDLE from "tweedle.js";
import { Camera } from "../camera/Camera";
import GameScene from "../scenes/GameScene";
import HudScene from "../scenes/HudScene";
import LoadingScene from "../scenes/LoadingScene";
import GameEvents from "../constants/events/GameEvents";
import { Resolution } from "../constants/app";
import { ICustomApplicationCfg, IROContextCfg } from "../types";
import GameObjectStorage from "../managers/gameObjectsManager/GameObjectStorage";
import GameObjectManager from "../managers/gameObjectsManager/GameObjectManager";
import RenderStorage from "../managers/renderManager/RenderStorage";
import { jsons } from "../configs/loader";

export default class Game extends Container {
  loadScene: LoadingScene;
  gameScene: GameScene;
  hudScene: HudScene;
  context: IROContextCfg;
  gameObjectStorage: GameObjectStorage;
  renderStorage: RenderStorage;

  constructor(app: ICustomApplicationCfg) {
    super();

    app.width = Resolution.width;
    app.height = Resolution.height;
    app.deltaScale = Math.max(innerWidth / app.width, innerHeight / app.height);

    this.context = {
      app,
      jsons,
    };

    this.loadScene = new LoadingScene();
    this.renderStorage = new RenderStorage(this.context);
    this.gameObjectStorage = new GameObjectStorage(this.context);

    this.gameScene = new GameScene(this.context);
    this.hudScene = new HudScene(this.context);

    this.gameScene.gameObjectManager = new GameObjectManager(this.context);
    this.hudScene.gameObjectManager = new GameObjectManager(this.context);

    app.ticker.add((dt: Number) => {
      app.stage.emit(GameEvents.TICKER, dt);
      TWEEDLE.Group.shared.update(app.ticker.deltaMS);
    });
  }

  async init() {
    this.addChild(this.loadScene);

    await this.loadScene.create();

    this.removeChild(this.loadScene);
    this.loadScene.destroy();

    this.addChild(this.gameScene);
    this.addChild(this.hudScene);

    this.gameScene.camera = new Camera(this.context, this.gameScene);

    this.context.app.stage.emit(GameEvents.FOLLOW_CAMERA, {
      target: this,
      isUpdateOnlyResize: true,
      callback: () => {
        document.getElementById("loader_screen").remove();
      },
    });

    this.gameScene.create();
    this.hudScene.create();
  }
}
