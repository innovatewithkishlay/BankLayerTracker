import { scaleTime, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { line, curveMonotoneX } from "d3-shape";
import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { motion } from "framer-motion";
