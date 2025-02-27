import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import * as d3 from "d3";

const GitContributionGraph: React.FC = () => {
  const chartRef = useRef(null);

  // Function to generate random commit data
  const generateRandomCommitData = () => {
    const types = ["Python", "JavaScript", "CSS", "Other"];
    return types.map((type) => ({
      type,
      count: Math.floor(Math.random() * 50), // Random count up to 50
    }));
  };

  // State to hold commit type data
  const [commitTypeData, setCommitTypeData] = useState(
    generateRandomCommitData(),
  );

  // Calculate the total commits for the current month
  const currentMonthCommits = commitTypeData.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    // Define a refined color palette
    const refinedColors = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2"];
    const color = d3
      .scaleOrdinal()
      .domain(commitTypeData.map((d) => d.type))
      .range(refinedColors);

    // Define pie layout
    const pie = d3.pie<any>().value((d) => d.count);
    const data_ready = pie(commitTypeData);

    // Create arc generator with a much thinner donut (inner radius = 90% of outer)
    const arc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius);

    // Select the svg element and create a centered group
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw donut chart segments
    svg
      .selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.type) as string)
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0.85);

    // Add center text for total commits
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("font-size", "80px")
      .style("font-family", "Roboto")
      .style("font-weight", "bold")
      .style("fill", "white")
      .text(currentMonthCommits);

    // Cleanup on re-render
    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [commitTypeData, currentMonthCommits]);

  // For testing: update data on each render (you may remove this in production)
  useEffect(() => {
    setCommitTypeData(generateRandomCommitData());
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "white" }}>Commits</h3>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default GitContributionGraph;
