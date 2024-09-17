document.addEventListener("DOMContentLoaded", function() {
    const polygonCanvas = document.getElementById("polygon");
    const polygonCtx = polygonCanvas.getContext("2d");
    const rulerCanvas = document.getElementById("ruler");
    const rulerCtx = rulerCanvas.getContext("2d");

    // Set canvas dimensions based on the image
    const image = document.querySelector(".image-canvas-container img");
    polygonCanvas.width = image.clientWidth;
    polygonCanvas.height = image.clientHeight;
    rulerCanvas.width = image.clientWidth;
    rulerCanvas.height = image.clientHeight;

    // Sliders for the radar chart
    const sliders = {
        aimTracking: document.getElementById("aimTracking"),
        swappingReflexes: document.getElementById("swappingReflexes"),
        movementPositioning: document.getElementById("movementPositioning"),
        gameSense: document.getElementById("gameSense"),
        consistency: document.getElementById("consistency"),
        longRange: document.getElementById("longRange"),
        midRange: document.getElementById("midRange"),
        closeRange: document.getElementById("closeRange"),
        aggression: document.getElementById("aggression"),
        defense: document.getElementById("defense")
    };

    const colorInput = document.getElementById("colorSelector");
    const transparencyInput = document.getElementById("transparency");

    // Radar chart attributes
    const attributes = [
        "aimTracking",
        "swappingReflexes",
        "movementPositioning",
        "gameSense",
        "consistency",
        "longRange",
        "midRange",
        "closeRange",
        "aggression",
        "defense"
    ];

    // Draw the radar chart and the ruler
    function draw() {
        const centerX = polygonCanvas.width / 2;
        const centerY = polygonCanvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.69;
        const angleStep = (2 * Math.PI) / attributes.length;

        // Clear both canvases
        polygonCtx.clearRect(0, 0, polygonCanvas.width, polygonCanvas.height);
        rulerCtx.clearRect(0, 0, rulerCanvas.width, rulerCanvas.height);

        // Get current slider values
        const values = attributes.map(attr => parseFloat(sliders[attr].value) / 100);

        // Calculate total percentage for the ruler
        const totalPercentage = values.reduce((sum, value) => sum + value, 0) * 10;

        // Get color and transparency
        const color = colorInput.value;
        const transparency = parseFloat(transparencyInput.value) / 100;

        // Set the polygon fill style
        polygonCtx.fillStyle = hexToRGBA(color, transparency);
        polygonCtx.strokeStyle = color;
        polygonCtx.lineWidth = 2;

        // Save the current context before applying transformations
        polygonCtx.save();

        // Translate to the center of the canvas
        polygonCtx.translate(centerX, centerY);

        // Rotate the canvas
        const rotationAngle = Math.PI / 2;
        polygonCtx.rotate(rotationAngle);

        // Translate back to the original position
        polygonCtx.translate(-centerX, -centerY);

        // Start drawing the radar chart polygon
        polygonCtx.beginPath();
        for (let i = 0; i < attributes.length; i++) {
            const value = values[i];
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);

            if (i === 0) {
                polygonCtx.moveTo(x, y);
            } else {
                polygonCtx.lineTo(x, y);
            }
        }
        polygonCtx.closePath();
        polygonCtx.fill();
        polygonCtx.stroke();

        // Restore the context to avoid affecting other drawings
        polygonCtx.restore();

        // Draw the ruler based on the total percentage
        drawRuler(totalPercentage, color, transparency);
    }

    // Draw the ruler
    function drawRuler(percentage, color, transparency) {
        const rulerHeight = rulerCanvas.height;
        const filledHeight = (rulerHeight * percentage) / 100;

        // Set fill style for the ruler
        rulerCtx.fillStyle = hexToRGBA(color, transparency);

        // Draw the filled part of the ruler
        rulerCtx.fillRect(0, rulerHeight - filledHeight, rulerCanvas.width, filledHeight);
    }

    // Convert hex color to RGBA format
    function hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Attach event listeners to sliders and inputs
    Object.values(sliders).forEach(slider => slider.addEventListener("input", draw));
    colorInput.addEventListener("input", draw);
    transparencyInput.addEventListener("input", draw);

    // Initial draw
    draw();
});