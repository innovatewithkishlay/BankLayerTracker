// src/types/react-simple-maps.d.ts
declare module "react-simple-maps" {
  import React from "react";
  import { GeoJsonObject, Geometry } from "geojson";

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

  type GeoFeature = GeoJsonObject & {
    rsmKey: string;
    properties: {
      isoA2: string;
      [key: string]: any;
    };
  };

  export const ComposableMap: React.FC<{
    projection?: string | object;
    width?: number;
    height?: number;
    children?: React.ReactNode;
  }>;

  export const Geographies: React.FC<{
    geography: string | GeoJsonObject | undefined;
    children: (props: { geographies: GeoFeature[] }) => React.ReactNode;
  }>;

  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<{
    coordinates: [number, number];
    children?: React.ReactNode;
  }>;
  export const ZoomableGroup: React.FC<{
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
  }>;
}
