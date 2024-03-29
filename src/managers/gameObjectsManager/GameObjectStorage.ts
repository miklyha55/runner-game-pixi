import GameObject from "./GameObject";
import GameEvents from "../../constants/GameEvents";
import { IROContextCfg } from "../../types";

export default class GameObjectStorage {
  private gameObjects: GameObject[];

  constructor(context: IROContextCfg) {
    this.gameObjects = [];

    context.app.stage.on(
      GameEvents.GET_GAME_OBJECT,
      this.onGetGameObject,
      this
    );
    context.app.stage.on(
      GameEvents.SET_GAME_OBJECT,
      this.onSetGameObject,
      this
    );
    context.app.stage.on(
      GameEvents.CLEAR_GAME_OBJECT,
      this.onClearGameObject,
      this
    );
  }

  private onSetGameObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
  }

  private onGetGameObject(
    name: string,
    callback: (gameObject: GameObject) => void
  ) {
    callback instanceof Function &&
      callback(this.gameObjects.find((gameObject) => gameObject.name === name));
  }

  private onClearGameObject(removedGameObjects: GameObject[]) {
    removedGameObjects.forEach((removedGameObject) => {
      this.gameObjects.forEach((gameObject, index) => {
        if (gameObject === removedGameObject) {
          this.gameObjects.splice(index, 1);
          gameObject.remove();
        }
      });
    });
  }
}
