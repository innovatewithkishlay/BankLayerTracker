import { scaleTime, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { line, curveMonotoneX } from "d3-shape";
import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { motion } from "framer-motion";

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
  const width = 800;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  useEffect(() => {
    if (!transactions.length || !svgRef.current) return;

    const dates = transactions.map((t) => new Date(t.date));
    const amounts = transactions.map((t) => t.amount);

    // Convert dates to timestamps for min/max calculation
    const timestamps = dates.map((d) => d.getTime());
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain([0, Math.max(...amounts)])
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = line<number>()
      .curve(curveMonotoneX)
      .x((d, i) => xScale(dates[i]))
      .y((d) => yScale(d));

    const svg = select(svgRef.current);

    // Clear previous elements
    svg.selectAll("*").remove();

    // Draw line
    svg
      .append("path")
      .datum(amounts)
      .attr("fill", "none")
      .attr("stroke", "#00ff9d")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Draw transaction markers
    svg
      .selectAll("circle")
      .data(transactions)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.amount))
      .attr("r", 3)
      .attr("fill", (d) => (d.amount > 50000 ? "#ff4444" : "#00ff9d"))
      .attr("stroke", "#0A001A")
      .attr("stroke-width", 1);

    // X Axis
    const xAxis = axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => {
        const date = new Date(d.valueOf());
        return date.toLocaleDateString();
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr("color", "#00ff9d")
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "10px");

    // Y Axis
    const yAxis = axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `$${d.toLocaleString()}`);
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .attr("color", "#00ff9d")
      .selectAll("text")
      .style("font-family", "'Space Mono', monospace")
      .style("font-size", "10px");
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient
            id="timelineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#00ff9d" />
            <stop offset="100%" stopColor="#ff4444" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
