import { dynamicInfo } from "../types/event";

export class MovePacmanEvent extends Event {
  dynamicInfo: dynamicInfo;

  constructor(type: string, dynamicInfo: dynamicInfo) {
    super(type);
    this.dynamicInfo = dynamicInfo;
  }
}
export const movePacmanEvent = new MovePacmanEvent("movePacmanEvent", null);
