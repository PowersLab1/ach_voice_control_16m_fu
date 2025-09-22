import React, { Component } from "react";
import PropTypes from "prop-types";
import RATINGS_1_SRC from "../media/rating_keydown_1.png";
import RATINGS_2_SRC from "../media/rating_keydown_2.png";
import RATINGS_3_SRC from "../media/rating_keydown_3.png";
import RATINGS_4_SRC from "../media/rating_keydown_4.png";
import RATINGS_5_SRC from "../media/rating_keydown_5.png";
import FIX_CROSS_DEFAULT from "../media/fixation_cross.png";
import FIX_CROSS_GREEN from "../media/fixation_cross_green.png";
import FIX_CROSS_RED from "../media/fixation_cross_red.png";
import "./Trial.css";

var _ = require("lodash");
var SimplexNoise = require("simplex-noise");

const CANVAS_LENGTH = 256;

// Map rating numbers to their corresponding image sources
const ratingToImgSrc = {
  0: "", // Default: no image
  1: RATINGS_1_SRC,
  2: RATINGS_2_SRC,
  3: RATINGS_3_SRC,
  4: RATINGS_4_SRC,
  5: RATINGS_5_SRC,
};

// Map fixation cross color names to their image sources
const fixationCrossSrc = {
  default: FIX_CROSS_DEFAULT,
  green: FIX_CROSS_GREEN,
  red: FIX_CROSS_RED,
};

/**
 * VisualStimulus
 *
 * Renders a visual stimulus for an experimental trial, including:
 * - A dynamic visual pattern (checkerboard or stripes, both with configurable colors)
 * - An optional rating image overlay
 * - An optional fixation cross (color and visibility configurable)
 *
 * Props:
 * - showContrast: bool, whether to show the visual pattern
 * - patternType: string, 'checkerboard' or 'stripes'
 * - checkerboardColors: [string, string], colors for the pattern
 * - showRatings: bool, whether to display the rating image
 * - currentRating: number, which rating image to show (1-5)
 * - crossColor: string, color of the fixation cross ('default', 'green', 'red')
 * - showFixation: bool, whether to show the fixation cross
 * - stripeOrientation: string, orientation of stripes ('diagonal-right', 'diagonal-left', 'horizontal', 'vertical')
 * - stripeFrequency: number, controls stripe density
 */
class VisualStimulus extends Component {
  constructor(props) {
    super(props);
  }

  // Convert hex color to RGB values
  hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  drawCanvas() {
    this.resizeCanvas();

    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    if (!this.props.showContrast) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // Get colors from props or use defaults
    const [color1, color2] = this.props.checkerboardColors || [
      "#8B4513",
      "#000000",
    ];
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    // Choose pattern type based on props
    if (this.props.patternType === "stripes") {
      this.drawStripes(ctx, w, h, rgb1, rgb2);
    } else {
      // Default to checkerboard
      this.drawCheckerboard(ctx, w, h, rgb1, rgb2);
    }
  }

  /**
   * Draws a checkerboard pattern
   */
  drawCheckerboard(ctx, w, h, rgb1, rgb2) {
    // Number of tiles horizontally and vertically
    const nCols = 16;
    const nRows = 10;

    const tileWidth = w / nCols;
    const tileHeight = h / nRows;

    const imgdata = ctx.getImageData(0, 0, w, h);
    const data = imgdata.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const tileX = Math.floor(x / tileWidth);
        const tileY = Math.floor(y / tileHeight);
        const useColor = tileX % 2 === tileY % 2 ? rgb1 : rgb2;
        const idx = (y * w + x) * 4;
        data[idx + 0] = useColor[0];
        data[idx + 1] = useColor[1];
        data[idx + 2] = useColor[2];
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  /**
   * Draws a stripe pattern with the specified orientation
   */
  drawStripes(ctx, w, h, rgb1, rgb2) {
    const imgdata = ctx.getImageData(0, 0, w, h);
    const data = imgdata.data;
    const frequency = this.props.stripeFrequency || 14;

    // Function to calculate stripe value based on orientation
    const getStripeValue = (x, y) => {
      switch (this.props.stripeOrientation) {
        case "diagonal-left":
          // Top-left to bottom-right
          return Math.abs(
            Math.floor(Math.sin((2 * Math.PI * frequency * (x - y)) / 1000)),
          );
        case "horizontal":
          // Horizontal stripes
          return Math.abs(
            Math.floor(Math.sin((2 * Math.PI * frequency * y) / 1000)),
          );
        case "vertical":
          // Vertical stripes
          return Math.abs(
            Math.floor(Math.sin((2 * Math.PI * frequency * x) / 1000)),
          );
        default:
          // Default is diagonal-right (bottom-left to top-right)
          return Math.abs(
            Math.floor(Math.sin((2 * Math.PI * frequency * (x + y)) / 1000)),
          );
      }
    };

    // Draw the stripe pattern pixel by pixel
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const useColor = getStripeValue(x, y) ? rgb1 : rgb2;
        data[idx + 0] = useColor[0];
        data[idx + 1] = useColor[1];
        data[idx + 2] = useColor[2];
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgdata, 0, 0);
  }

  /**
   * Resizes the canvas to fill the window.
   */
  resizeCanvas() {
    const canvas = document.getElementById("c");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Draw the pattern when the component mounts.
   */
  componentDidMount() {
    this.drawCanvas();
  }

  /**
   * Redraw the pattern if props change.
   */
  componentDidUpdate(prevProps) {
    this.drawCanvas();
  }

  /**
   * Renders the component UI:
   * - Rating image (if showRatings)
   * - Overlay to darken background (if showRatings)
   * - Pattern canvas
   * - Fixation cross image (if showFixation)
   */
  render() {
    return (
      <div>
        {/* Rating image overlay, shown if showRatings is true */}
        <img
          src={ratingToImgSrc[this.props.currentRating]}
          width={CANVAS_LENGTH}
          height={CANVAS_LENGTH}
          className="center"
          style={{
            zIndex: 101,
            width: "95vh",
            height: "50vh",
            backgroundColor: "black",
            visibility: this.props.showRatings ? "visible" : "hidden",
          }}
        />
        {/* Black overlay to darken background when ratings are shown */}
        <div
          style={{
            zIndex: 100,
            backgroundColor: "black",
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            visibility: this.props.showRatings ? "visible" : "hidden",
          }}
        ></div>
        {/* Canvas for pattern or black background */}
        <canvas
          id="c"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        ></canvas>
        {/* Fixation cross image, centered and shown if showFixation is true */}
        <img
          src={fixationCrossSrc[this.props.crossColor || "default"]}
          alt="Fixation Cross"
          className="fixation-cross"
          style={{
            zIndex: 10,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "142px",
            height: "142px",
            visibility: this.props.showFixation ? "visible" : "hidden",
          }}
        />
      </div>
    );
  }
}

// Default prop values for the component
VisualStimulus.defaultProps = {
  showContrast: false, // Pattern off by default
  showRatings: false, // Ratings image off by default
  contrast: 0,
  crossColor: "default", // Default fixation cross color
  showFixation: true, // Show fixation cross by default
  checkerboardColors: ["#4E2E0F", "#404040"], // Deep brown and soft dark gray
  patternType: "checkerboard", // Default to checkerboard pattern
  stripeOrientation: "diagonal-right", // Default stripe orientation
  stripeFrequency: 14, // Default stripe frequency
};

// Prop types for validation and documentation
VisualStimulus.propTypes = {
  showContrast: PropTypes.bool.isRequired, // Whether to show the pattern
  showRatings: PropTypes.bool, // Whether to show ratings image
  currentRating: PropTypes.number, // Which rating image to show
  contrast: PropTypes.number,
  crossColor: PropTypes.oneOf(["default", "green", "red"]), // Fixation cross color
  showFixation: PropTypes.bool, // Whether to show fixation cross
  checkerboardColors: PropTypes.arrayOf(PropTypes.string), // Pattern colors
  patternType: PropTypes.oneOf(["checkerboard", "stripes"]), // Pattern type
  stripeOrientation: PropTypes.oneOf([
    "diagonal-right",
    "diagonal-left",
    "horizontal",
    "vertical",
  ]), // Stripe orientation
  stripeFrequency: PropTypes.number, // Controls stripe density
};

export default VisualStimulus;
