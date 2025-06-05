import { ResponsiveLine } from "@nivo/line";

interface AnomalySparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export const AnomalySparkline = ({
  data,
  width = 128,
  height = 48,
}: AnomalySparklineProps) => {
  const formattedData = [
    {
      id: "anomalies",
      data: data.map((y, index) => ({ x: index, y })),
    },
  ];

  return (
    <div style={{ width, height }}>
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={null}
        enableGridX={false}
        enableGridY={false}
        colors={["#00ff9d"]}
        lineWidth={2}
        pointSize={0}
        useMesh={false}
        enableArea={true}
        areaOpacity={0.15}
        isInteractive={false}
      />
    </div>
  );
};
