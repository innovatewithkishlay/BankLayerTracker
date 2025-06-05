declare module "react-simple-maps" {
  import React from "react";
  import { GeoJsonObject } from "geojson";

  export interface GeographyProps {
    geography: GeoJsonObject;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export const ComposableMap: React.FC<{ projection?: string }>;
  export const Geographies: React.FC<{ geography?: string }>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<{ coordinates: [number, number] }>;
  export const ZoomableGroup: React.FC;
}
