import GameEvents from "../../constants/GameEvents";

import PlaceManager from "../../managers/placeManager/core/PlaceManager";
import GameObjectManager from "../../managers/gameObjectsManager/GameObjectManager";

import Bg from "../game/Bg";
import Character from "../game/characters/Character";
import Ai from "../game/characters/Ai";

import { IROContextCfg } from "../../types";

export default class Level1 {
  private context: IROContextCfg;
  private gameObjectManager: GameObjectManager;

  private bg: Bg;
  private character: Character;
  private ai: Ai;
  private placeManager: PlaceManager;

  constructor(context: IROContextCfg, gameObjectManager: GameObjectManager) {
    this.context = context;
    this.gameObjectManager = gameObjectManager;
  }

  async create() {
    this.context.app.stage.emit(GameEvents.ZOOM_CAMERA, { zoom: 1 });

    this.bg = this.gameObjectManager.create(new Bg(this.context)) as Bg;
    this.character = this.gameObjectManager.create(
      new Character(this.context)
    ) as Character;
    this.ai = this.gameObjectManager.create(
      new Ai(this.context, this.character)
    ) as Ai;
    this.placeManager = new PlaceManager(this.context, this.gameObjectManager);
    this.context.app.stage.on(GameEvents.START_GAME, this.onStartGame, this);
  }

  remove() {
    this.context.app.stage.off(GameEvents.START_GAME, this.onStartGame, this);
    this.context.app.stage.emit(GameEvents.CLEAR_GAME_OBJECT, [
      this.bg,
      this.character,
      this.ai,
    ]);
    this.placeManager.remove();
  }

  private onStartGame() {
    this.placeManager.onSpawnPlaceObject();
  }
}
