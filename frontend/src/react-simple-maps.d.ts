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
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<{
    projection?: string | object;
    width?: number;
    height?: number;
  }>;

  export const Geographies: React.FC<{
    geography: string | GeoJsonObject | undefined;
    children?: (props: { geographies: GeoJsonObject[] }) => React.ReactNode;
  }>;

  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const ZoomableGroup: React.FC<{
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
  }>;
}
