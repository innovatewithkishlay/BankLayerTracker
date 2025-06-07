import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeographicMapProps {
  transactions: Array<{
    metadata?: {
      ipCountry?: string;
    };
    amount?: number;
  }>;
}

interface PositionState {
  coordinates: [number, number];
  zoom: number;
}

export const GeographicMap = ({ transactions }: GeographicMapProps) => {
  const [position, setPosition] = useState<PositionState>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Process transaction data by country
  const countryCounts = transactions.reduce((acc, tx) => {
    const country = tx.metadata?.ipCountry?.toUpperCase();
    if (country) {
      acc[country] = (acc[country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const countryAmounts = transactions.reduce((acc, tx) => {
    const country = tx.metadata?.ipCountry?.toUpperCase();
    if (country && tx.amount) {
      acc[country] = (acc[country] || 0) + tx.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(countryCounts), 1);
  const colorScale = scaleSequential(interpolateYlOrRd).domain([0, maxCount]);

  const handleMoveEnd = useCallback((newPosition: PositionState) => {
    setPosition(newPosition);
  }, []);

  const resetZoom = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const zoomIn = () => {
    if (position.zoom < 4) {
      setPosition((prev) => ({ ...prev, zoom: prev.zoom * 1.5 }));
    }
  };

  const zoomOut = () => {
    if (position.zoom > 1) {
      setPosition((prev) => ({ ...prev, zoom: prev.zoom / 1.5 }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-[#0A001A] rounded-xl border-2 border-[#00ff9d]/30 overflow-hidden"
    >
      {/* Header with Statistics */}
      <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#17002E]/95 to-[#17002E]/80 px-4 py-3 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
        <h3 className="text-[#00ff9d] font-bold text-sm font-mono mb-2">
          Global Transaction Map
        </h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Countries:</span>
            <span className="text-[#00ff9d] font-mono">
              {Object.keys(countryCounts).length}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Transactions:</span>
            <span className="text-[#00ff9d] font-mono">
              {transactions.length}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-300">Max/Country:</span>
            <span className="text-[#00ff9d] font-mono">{maxCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-[#17002E] border-2 border-[#00ff9d]/50 rounded-lg flex items-center justify-center text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors"
          disabled={position.zoom >= 4}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-[#17002E] border-2 border-[#00ff9d]/50 rounded-lg flex items-center justify-center text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors"
          disabled={position.zoom <= 1}
        >
          −
        </button>
        <button
          onClick={resetZoom}
          className="w-10 h-10 bg-[#17002E] border-2 border-[#00ff9d]/50 rounded-lg flex items-center justify-center text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors text-xs"
        >
          ⌂
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-gradient-to-l from-[#17002E]/95 to-[#17002E]/80 px-3 py-3 rounded-lg border border-[#00ff9d]/30 backdrop-blur-sm">
        <h4 className="text-[#00ff9d] font-bold text-xs mb-2 font-mono">
          Transaction Intensity
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-yellow-200 to-red-600 rounded"></div>
            <span className="text-gray-300">High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-[#17002E] border border-[#00ff9d]/30 rounded"></div>
            <span className="text-gray-300">No Activity</span>
          </div>
        </div>
      </div>

      {/* Country Info Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-20 left-4 z-20 bg-[#17002E] border border-[#00ff9d] rounded-lg p-3 max-w-xs">
          <div className="text-[#00ff9d] font-bold text-sm mb-1">
            {hoveredCountry}
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Transactions:</span>
              <span className="text-white">
                {countryCounts[hoveredCountry] || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white">
                ${(countryAmounts[hoveredCountry] || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full">
        <ComposableMap
          projectionConfig={{
            scale: 147,
            rotate: [0, 0, 0],
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={4}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A2;
                  const count = countryCounts[countryCode] || 0;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={count > 0 ? colorScale(count) : "#17002E"}
                      stroke="#00ff9d"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.3s ease",
                        },
                        hover: {
                          fill: count > 0 ? "#00ff9d" : "#17002E",
                          stroke: "#00ff9d",
                          strokeWidth: 1,
                          outline: "none",
                          filter: "drop-shadow(0 0 8px rgba(0, 255, 157, 0.6))",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onMouseEnter={() =>
                        count > 0 && setHoveredCountry(geo.properties.NAME)
                      }
                      onMouseLeave={() => setHoveredCountry(null)}
                    />
                  );
                })
              }
            </Geographies>

            {/* Transaction Markers */}
            {Object.entries(countryCounts).map(([countryCode, count]) => {
              const coordinates = getCountryCoordinates(countryCode);
              if (!coordinates || count === 0) return null;

              return (
                <Marker key={countryCode} coordinates={coordinates}>
                  <circle
                    r={Math.sqrt(count) * 2 + 3}
                    fill="#00ff9d"
                    fillOpacity={0.6}
                    stroke="#00ff9d"
                    strokeWidth={1}
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(0, 255, 157, 0.8))",
                    }}
                  />
                  <text
                    x={0}
                    y={0}
                    fontSize={10}
                    fill="#ffffff"
                    className="font-mono font-bold"
                    textAnchor="middle"
                    dy="0.35em"
                  >
                    {count}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Loading state */}
      {transactions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#00ff9d] font-mono">
            Loading transaction data...
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Helper function for country coordinates
const getCountryCoordinates = (
  countryCode: string
): [number, number] | null => {
  const coordinates: Record<string, [number, number]> = {
    US: [-95.7129, 37.0902],
    IN: [78.9629, 20.5937],
    CN: [104.1954, 35.8617],
    GB: [-3.436, 55.3781],
    DE: [10.4515, 51.1657],
    FR: [2.2137, 46.2276],
    JP: [138.2529, 36.2048],
    BR: [-51.9253, -14.235],
    AU: [133.7751, -25.2744],
    CA: [-106.3468, 56.1304],
    RU: [105.3188, 61.524],
    ZA: [22.9375, -30.5595],
    MX: [-102.5528, 23.6345],
    AR: [-63.6167, -38.4161],
    EG: [30.8025, 26.8206],
    NG: [8.6753, 9.082],
    KE: [37.9062, -0.0236],
    TH: [100.9925, 15.87],
    SG: [103.8198, 1.3521],
    AE: [53.8478, 23.4241],
  };

  return coordinates[countryCode] || null;
};
