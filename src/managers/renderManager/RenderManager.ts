import { Container } from "pixi.js";

import GameEvents from "../../constants/GameEvents";
import { RenderGameTypesCfg } from "./constants/RenderGameTypes";
import { RenderHudTypesCfg } from "./constants/RenderHudTypes";

import { IROContextCfg } from "../../types";

export default class RenderManager {
  private readonly renderLayerTypes: RenderGameTypesCfg | RenderHudTypesCfg;
  private readonly renderLayers: Container[];
  private readonly container: Container;
  private readonly context: IROContextCfg;

  constructor(
    context: IROContextCfg,
    container: Container,
    renderLayerTypes: RenderGameTypesCfg | RenderHudTypesCfg
  ) {
    this.renderLayerTypes = renderLayerTypes;
    this.renderLayers = [];
    this.container = container;
    this.context = context;

    this.createLayers();
  }

  private createLayers() {
    for (const key in this.renderLayerTypes) {
      if (Object.hasOwnProperty.call(this.renderLayerTypes, key)) {
        const container: Container = new Container();

        container.name = key;

        this.container.addChild(container);
        this.renderLayers.push(container);

        this.context.app.stage.emit(GameEvents.SET_RENDER_LAYER, container);
      }
    }
  }
}
