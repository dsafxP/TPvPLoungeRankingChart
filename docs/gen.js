document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("polygon");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions based on the image
    const image = document.querySelector(".image-canvas-container img");
    canvas.width = image.clientWidth;
    canvas.height = image.clientHeight;

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

    // Draw the radar chart
    function drawRadarChart() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.67;
        const angleStep = (2 * Math.PI) / attributes.length;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get current slider values
        const values = attributes.map(attr => parseFloat(sliders[attr].value) / 100);

        // Get color and transparency
        const color = colorInput.value;
        const transparency = parseFloat(transparencyInput.value) / 100;

        // Set the polygon fill style
        ctx.fillStyle = hexToRGBA(color, transparency);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        // Save the current context before applying transformations
        ctx.save();

        // Translate to the center of the canvas
        ctx.translate(centerX, centerY);

        // Rotate the canvas
        const rotationAngle = Math.PI / 2;
        ctx.rotate(rotationAngle);

        // Translate back to the original position
        ctx.translate(-centerX, -centerY);

        // Start drawing the radar chart polygon
        ctx.beginPath();
        for (let i = 0; i < attributes.length; i++) {
            const value = values[i];
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Restore the context to avoid affecting other drawings
        ctx.restore();
    }

    // Convert hex color to RGBA format
    function hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Attach event listeners to sliders and inputs
    Object.values(sliders).forEach(slider => slider.addEventListener("input", drawRadarChart));

    colorInput.addEventListener("input", drawRadarChart);
    transparencyInput.addEventListener("input", drawRadarChart);

    // Initial draw
    drawRadarChart();
});