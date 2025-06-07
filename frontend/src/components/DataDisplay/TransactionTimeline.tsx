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

  const width = 900;
  const height = 400;
  const margin = { top: 40, right: 100, bottom: 80, left: 100 };

  const highRiskThreshold = 50000;
  const structuringThreshold = 9000;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalVolume / transactions.length || 0;
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
      .domain([0, maxAmount * 1.2])
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

    const xTicks = xScale.ticks(6);
    const yTicks = yScale.ticks(8);

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
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

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
      .attr("stroke", "#444")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5);

    if (maxAmount > highRiskThreshold) {
      svg
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", yScale(highRiskThreshold))
        .attr("y2", yScale(highRiskThreshold))
        .attr("stroke", "#ff4444")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "8,4")
        .attr("opacity", 0.9);

      svg
        .append("text")
        .attr("x", width - margin.right + 10)
        .attr("y", yScale(highRiskThreshold))
        .attr("dy", "-8")
        .attr("fill", "#ff4444")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("font-family", "'Space Mono', monospace")
        .text("High Risk ($50K+)");
    }

    svg
      .append("path")
      .datum(amounts)
      .attr("fill", "url(#areaGradient)")
      .attr("opacity", 0.4)
      .attr("d", areaGenerator);

    svg
      .append("path")
      .datum(amounts)
      .attr("fill", "none")
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 4)
      .attr("d", lineGenerator)
      .style("filter", "drop-shadow(0 2px 6px rgba(0, 255, 157, 0.4))");

    svg
      .selectAll("circle")
      .data(transactions)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.amount))
      .attr("r", (d) => (d.amount > highRiskThreshold ? 8 : 6))
      .attr("fill", (d) => {
        if (d.amount > highRiskThreshold) return "#ff4444";
        if (d.amount >= structuringThreshold && d.amount <= 10000)
          return "#ffaa44";
        return "#00ff9d";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", (d) =>
        d.amount > highRiskThreshold
          ? "drop-shadow(0 2px 8px rgba(255, 68, 68, 0.6))"
          : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
      )
      .on("mouseover", function (event, d) {
        select(this).transition().duration(150).attr("r", 12);
        setHoveredTransaction(d);
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = event.pageX + 15 + "px";
          tooltipRef.current.style.top = event.pageY - 15 + "px";
        }
      })
      .on("mouseout", function (event, d) {
        select(this)
          .transition()
          .duration(150)
          .attr("r", d.amount > highRiskThreshold ? 8 : 6);
        setHoveredTransaction(null);
        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      })
      .on("mousemove", function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = event.pageX + 15 + "px";
          tooltipRef.current.style.top = event.pageY - 15 + "px";
        }
      });

    const xAxis = axisBottom(xScale)
      .ticks(6)
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
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "14px")
      .style("fill", "#00ff9d")
      .style("font-weight", "bold");

    svg
      .select("g")
      .selectAll("line")
      .style("stroke", "#00ff9d")
      .style("stroke-width", 2);

    svg
      .select("g")
      .select(".domain")
      .style("stroke", "#00ff9d")
      .style("stroke-width", 2);

    svg
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#00ff9d")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("font-family", "'Space Mono', monospace")
      .text("Transaction Date");

    const yAxis = axisLeft(yScale)
      .ticks(8)
      .tickFormat((d) => {
        const value = d.valueOf();
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toLocaleString()}`;
      });

    const yAxisGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    yAxisGroup
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "14px")
      .style("fill", "#00ff9d")
      .style("font-weight", "bold");

    yAxisGroup
      .selectAll("line")
      .style("stroke", "#00ff9d")
      .style("stroke-width", 2);

    yAxisGroup
      .select(".domain")
      .style("stroke", "#00ff9d")
      .style("stroke-width", 2);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#00ff9d")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
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
      className="relative w-full"
    >
      <div className="mb-6 p-6 bg-[var(--cyber-card)]/70 rounded-xl border border-[var(--cyber-border)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--cyber-accent)] mb-2">
              Transaction Volume Timeline
            </h3>
            <p className="text-sm text-gray-300">
              Monitor transaction patterns and identify suspicious activities
              over time
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-[var(--cyber-accent)] text-lg" />
              <span className="text-white font-medium">
                Total: ${totalVolume.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiInfo className="text-blue-400 text-lg" />
              <span className="text-white font-medium">
                Avg: ${Math.round(avgTransaction).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-red-400 text-lg" />
              <span className="text-white font-medium">
                {highRiskCount} High Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-400"></div>
          <span className="text-white font-medium">Normal (&lt;$9K)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <span className="text-white font-medium">Structuring ($9K-$10K)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-400"></div>
          <span className="text-white font-medium">High Risk (&gt;$50K)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-1 border-t-3 border-dashed border-red-400"></div>
          <span className="text-white font-medium">Risk Threshold</span>
        </div>
      </div>

      <div className="relative bg-[#1a1a1a] rounded-xl border-2 border-[var(--cyber-border)] p-6 overflow-x-auto">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[800px]"
        />

        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-[#1a1a1a] border-2 border-[var(--cyber-accent)] rounded-lg p-4 shadow-2xl"
          style={{ display: "none" }}
        >
          {hoveredTransaction && (
            <div className="text-sm">
              <div className="font-bold text-[var(--cyber-accent)] mb-2 text-base">
                Transaction Details
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-300 font-medium">Date:</span>{" "}
                  <span className="text-white">
                    {new Date(hoveredTransaction.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Amount:</span>{" "}
                  <span className="text-white font-bold">
                    ${hoveredTransaction.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Risk Level:</span>{" "}
                  <span
                    className={`font-bold ${getRiskColor(
                      hoveredTransaction.amount
                    )}`}
                  >
                    {getRiskLevel(hoveredTransaction.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-[var(--cyber-card)]/50 rounded-lg border border-[var(--cyber-border)]">
        <div className="text-sm text-gray-300">
          <strong className="text-[var(--cyber-accent)]">Insights:</strong>{" "}
          {highRiskCount > 0
            ? `${highRiskCount} transactions exceed the $50K high-risk threshold. `
            : "No high-risk transactions detected. "}
          Average transaction size is{" "}
          {avgTransaction > 25000 ? "above" : "below"} normal range.
        </div>
      </div>
    </motion.div>
  );
};
