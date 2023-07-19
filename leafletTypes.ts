import { Marker  } from "leaflet";

declare class BouncingOptions {
  bounceHeight: number;
  contractHeight: number;
  bounceSpeed: number;
  contractSpeed: number;
  shadowAngle: number;
  elastic: number;
  exclusive: number;

  constructor(options: Partial<BouncingOptions>);
}

// Declare a class type that adds in methods etc. defined by leaflet.smooth_marker_bouncing
// to keep Typescript happy
export declare class BouncingMarker extends Marker {
  isBouncing(): boolean;
  bounce(): void;
  stopBouncing(): void;
  getBouncingMarkers(): Marker[];
  setBouncingOptions(options: BouncingOptions | Partial<BouncingOptions>): void;
  stopAllBouncingMarkers(): void;

  _icon: HTMLElement;
  _bouncingMotion?: {
    bouncingAnimationPlaying: boolean;
  };
}
