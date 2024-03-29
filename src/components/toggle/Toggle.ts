import { Container } from "pixi.js";
import { Tween } from "tweedle.js";

import { Component } from "../core/Component";

import GameEvents from "../../constants/GameEvents";

import { IROToggleCfg } from "./types";

export class Toggle extends Component {
  constructor(parent: Container) {
    super(parent);

    this.parent.on(GameEvents.TOGGLE_ACTIVE, this.onToggle, this);
  }

  override onRemove() {
    this.parent.off(GameEvents.TOGGLE_ACTIVE, this.onToggle, this);
  }

  private onToggle({ active, alpha, time = 0, callback }: IROToggleCfg) {
    if (time) {
      if (alpha === undefined) {
        if (active) {
          this.parent.visible = active;
        }

        new Tween(this.parent)
          .to({ alpha: Number(active) }, time)
          .onComplete(() => {
            if (!active) {
              this.parent.visible = active;
            }

            callback instanceof Function && callback();
          })
          .start();
      } else {
        new Tween(this.parent)
          .to({ alpha }, time)
          .onComplete(() => {
            callback instanceof Function && callback();
          })
          .start();
      }
    } else {
      if (active === undefined) {
        this.parent.alpha = alpha;
      } else {
        this.parent.alpha = Number(active);
        this.parent.visible = active;
      }

      callback instanceof Function && callback();
    }
  }
}
