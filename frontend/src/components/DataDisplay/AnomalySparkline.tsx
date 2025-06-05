import { Sparkline } from "@nivo/sparkline";

interface AnomalySparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export const AnomalySparkline = ({
  data,
  width = 128,
  height = 48,
}: AnomalySparklineProps) => (
  <div style={{ width, height }}>
    <Sparkline
      data={data}
      width={width}
      height={height}
      curve="natural"
      colors={["#00ff9d"]}
    />
  </div>
);
