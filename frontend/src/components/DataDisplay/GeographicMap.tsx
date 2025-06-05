import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type { GeoJsonObject } from "geojson";
import { motion } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TransactionLocation {
  countryCode: string;
  count: number;
}

interface GeographicMapProps {
  transactions: Array<{
    metadata?: {
      ipCountry?: string;
    };
  }>;
}

export const GeographicMap = ({ transactions }: GeographicMapProps) => {
  // Process transaction data
  const countryCounts = transactions.reduce((acc, tx) => {
    const country = tx.metadata?.ipCountry?.toUpperCase();
    if (country) {
      acc[country] = (acc[country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(countryCounts), 1);
  const colorScale = scaleSequential(interpolateYlOrRd).domain([0, maxCount]);

  return (
    <div className="h-[400px] w-full relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-cyber-green rounded-xl overflow-hidden"
      >
        <ComposableMap projection="geoMercator">
          <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const count = countryCounts[geo.properties.isoA2] || 0;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo as GeoJsonObject}
                      fill={count > 0 ? colorScale(count) : "#17002E"}
                      stroke="#00ff9d"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#00ff9d", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Transaction markers */}
            {Object.entries(countryCounts).map(([countryCode, count]) => (
              <Marker
                key={countryCode}
                coordinates={[
                  geoCodes[countryCode]?.lng || 0,
                  geoCodes[countryCode]?.lat || 0,
                ]}
              >
                <circle
                  r={Math.sqrt(count) * 2}
                  fill="#00ff9d"
                  fillOpacity={0.5}
                  stroke="#00ff9d"
                  strokeWidth={0.5}
                />
                <text
                  x={4}
                  y={4}
                  fontSize={10}
                  fill="#00ff9d"
                  className="font-mono"
                >
                  {countryCode}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>
    </div>
  );
};

// Sample country coordinates - extend this list as needed
const geoCodes: Record<string, { lat: number; lng: number }> = {
  US: { lat: 37.0902, lng: -95.7129 },
  IN: { lat: 20.5937, lng: 78.9629 },
  CN: { lat: 35.8617, lng: 104.1954 },
  // Add more countries as needed
};
