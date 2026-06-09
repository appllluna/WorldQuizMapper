declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, CSSProperties } from 'react';

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
  }

  export interface GeographyFeature {
    rsmKey: string;
    id: string | number;
    properties: Record<string, unknown>;
    geometry: unknown;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: GeographyFeature[] }) => ReactNode;
  }

  export interface GeographyStyleObject {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
  }

  export interface GeographyProps {
    geography: GeographyFeature;
    style?: {
      default?: GeographyStyleObject;
      hover?: GeographyStyleObject;
      pressed?: GeographyStyleObject;
    };
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
