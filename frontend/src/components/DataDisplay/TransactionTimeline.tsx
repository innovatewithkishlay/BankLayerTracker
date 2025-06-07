import { scaleTime, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { line, curveMonotoneX, area } from "d3-shape";
import { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { motion } from "framer-motion";
import { FiInfo, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";

interface TransactionTimelineProps {
  transactions: Array<{
    date: string;
    amount: number;
  }>;
}

export const TransactionTimeline = ({
  transactions,
}: TransactionTimelineProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredTransaction, setHoveredTransaction] = useState<any>(null);
  const width = 800;
  const height = 350;
  const margin = { top: 40, right: 80, bottom: 60, left: 80 };

  const highRiskThreshold = 50000;
  const structuringThreshold = 9000;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalVolume / transactions.length;
  const highRiskCount = transactions.filter(
    (t) => t.amount > highRiskThreshold
  ).length;

  useEffect(() => {
    if (!transactions.length || !svgRef.current) return;

    const dates = transactions.map((t) => new Date(t.date));
    const amounts = transactions.map((t) => t.amount);

    const timestamps = dates.map((d) => d.getTime());
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));
    const maxAmount = Math.max(...amounts);

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain([0, maxAmount * 1.1])
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = line<number>()
      .curve(curveMonotoneX)
      .x((d, i) => xScale(dates[i]))
      .y((d) => yScale(d));

    const areaGenerator = area<number>()
      .curve(curveMonotoneX)
      .x((d, i) => xScale(dates[i]))
      .y0(height - margin.bottom)
      .y1((d) => yScale(d));

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const xTicks = xScale.ticks(5);
    const yTicks = yScale.ticks(6);

    svg
      .selectAll(".grid-line-x")
      .data(xTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line-x")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.3);

    svg
      .selectAll(".grid-line-y")
      .data(yTicks)
      .enter()
      .append("line")
      .attr("class", "grid-line-y")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.3);

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", yScale(highRiskThreshold))
      .attr("y2", yScale(highRiskThreshold))
      .attr("stroke", "#ff4444")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.8);

    svg
      .append("text")
      .attr("x", width - margin.right + 5)
      .attr("y", yScale(highRiskThreshold))
      .attr("dy", "-5")
      .attr("fill", "#ff4444")
      .attr("font-size", "12px")
      .attr("font-family", "'Space Mono', monospace")
      .text("High Risk ($50K+)");

    svg
      .append("path")
      .datum(amounts)
      .attr("fill", "url(#areaGradient)")
      .attr("opacity", 0.3)
      .attr("d", areaGenerator);

    svg
      .append("path")
      .datum(amounts)
      .attr("fill", "none")
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator)
      .style("filter", "drop-shadow(0 2px 4px rgba(0, 255, 157, 0.3))");

    svg
      .selectAll("circle")
      .data(transactions)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.amount))
      .attr("r", (d) => (d.amount > highRiskThreshold ? 6 : 4))
      .attr("fill", (d) => {
        if (d.amount > highRiskThreshold) return "#ff4444";
        if (d.amount >= structuringThreshold && d.amount <= 10000)
          return "#ffaa44";
        return "#00ff9d";
      })
      .attr("stroke", "#0A001A")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", (d) =>
        d.amount > highRiskThreshold
          ? "drop-shadow(0 2px 8px rgba(255, 68, 68, 0.5))"
          : "none"
      )
      .on("mouseover", function (event, d) {
        select(this).transition().duration(150).attr("r", 8);
        setHoveredTransaction(d);
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = event.pageX + 10 + "px";
          tooltipRef.current.style.top = event.pageY - 10 + "px";
        }
      })
      .on("mouseout", function (event, d) {
        select(this)
          .transition()
          .duration(150)
          .attr("r", d.amount > highRiskThreshold ? 6 : 4);
        setHoveredTransaction(null);
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      })
      .on("mousemove", function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = event.pageX + 10 + "px";
          tooltipRef.current.style.top = event.pageY - 10 + "px";
        }
      });

    const xAxis = axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => {
        const date = new Date(d.valueOf());
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr("color", "#00ff9d")
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .attr("font-size", "14px")
      .attr("font-family", "'Space Mono', monospace")
      .text("Transaction Date");

    const yAxis = axisLeft(yScale)
      .ticks(6)
      .tickFormat((d) => {
        if (d >= 1000) return `$${(d / 1000).toFixed(0)}K`;
        return `$${d.toLocaleString()}`;
      });

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .attr("color", "#00ff9d")
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "12px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .attr("font-size", "14px")
      .attr("font-family", "'Space Mono', monospace")
      .text("Transaction Amount");

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height - margin.bottom)
      .attr("x2", 0)
      .attr("y2", margin.top);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00ff9d")
      .attr("stop-opacity", 0);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00ff9d")
      .attr("stop-opacity", 0.6);
  }, [transactions]);

  const getRiskLevel = (amount: number) => {
    if (amount > highRiskThreshold) return "High Risk";
    if (amount >= structuringThreshold && amount <= 10000) return "Structuring";
    return "Normal";
  };

  const getRiskColor = (amount: number) => {
    if (amount > highRiskThreshold) return "text-red-400";
    if (amount >= structuringThreshold && amount <= 10000)
      return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="mb-6 p-4 bg-[var(--cyber-card)]/50 rounded-lg border border-[var(--cyber-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--cyber-accent)] mb-2">
              Transaction Volume Timeline
            </h3>
            <p className="text-sm text-gray-400">
              Monitor transaction patterns and identify suspicious activities
              over time
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-[var(--cyber-accent)]" />
              <span>Total: ${totalVolume.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiInfo className="text-blue-400" />
              <span>Avg: ${Math.round(avgTransaction).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-red-400" />
              <span>{highRiskCount} High Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span>Normal (&lt;$9K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Structuring ($9K-$10K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span>High Risk (&gt;$50K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-red-400"></div>
          <span>Risk Threshold</span>
        </div>
      </div>

      <div className="relative bg-[var(--cyber-bg)] rounded-lg border border-[var(--cyber-border)] p-4">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        />
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-[var(--cyber-card)] border border-[var(--cyber-border)] rounded-lg p-3 shadow-lg"
          style={{ display: "none" }}
        >
          {hoveredTransaction && (
            <div className="text-sm">
              <div className="font-bold text-[var(--cyber-accent)] mb-1">
                Transaction Details
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(hoveredTransaction.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-gray-400">Amount:</span> $
                  {hoveredTransaction.amount.toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-400">Risk Level:</span>{" "}
                  <span className={getRiskColor(hoveredTransaction.amount)}>
                    {getRiskLevel(hoveredTransaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-[var(--cyber-card)]/30 rounded-lg border border-[var(--cyber-border)]">
        <div className="text-xs text-gray-400">
          <strong>Insights:</strong>{" "}
          {highRiskCount > 0
            ? `${highRiskCount} transactions exceed the $50K high-risk threshold. `
            : "No high-risk transactions detected. "}
          Average transaction size is $
          {avgTransaction > 25000 ? "above" : "below"} normal range.
        </div>
      </div>
    </motion.div>
  );
};
