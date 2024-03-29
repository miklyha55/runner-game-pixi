import { Container } from "pixi.js";
import GameEvents from "../../constants/GameEvents";
import { Component } from "../../components/core/Component";
import GameObjectManager from "./GameObjectManager";
import { IROContextCfg } from "../../types";

export default class GameObject extends Container {
  name: string;
  gameObjectManager: GameObjectManager;

  renderLayer: string;
  components: Component[];
  context: IROContextCfg;

  constructor(context: IROContextCfg) {
    super();

    this.renderLayer = "";
    this.components = [];
    this.context = context;

    context.app.stage.on(GameEvents.TICKER, this.onUpdate, this);
  }

  remove() {
    this.context.app.stage.off(GameEvents.TICKER, this.onUpdate, this);

    this.components.forEach((component) => {
      component.remove();
    });
    this.components = [];

    this.onRemove();
    this.destroy();
  }

  onCreate() {}

  getComponentByName(name: string) {
    return this.components.find((component) => component.name === name);
  }

  protected onRemove() {}
  protected onUpdate(dt: number) {}
}
