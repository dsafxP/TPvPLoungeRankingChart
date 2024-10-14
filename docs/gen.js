const canvas = document.getElementById('radarChart')
const ctx = canvas.getContext('2d');

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

const getGrade = (score) => {
  if (score >= 100) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "A-";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "B-";
  if (score >= 40) return "C+";
  if (score >= 30) return "C";
  if (score >= 20) return "C-";
  
  return "D+";
};

// Initialize the radar chart
let radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: [
            'Aim & Tracking',
            'Swapping & Reflexes',
            'Movement & Positioning',
            'Game Sense',
            'Consistency',
            'Long Range',
            'Mid Range',
            'Close Range',
            'Aggression',
            'Defense'
        ],
        datasets: [{
            label: 'Stats',
            data: [
                sliders.aimTracking.value,
                sliders.swappingReflexes.value,
                sliders.movementPositioning.value,
                sliders.gameSense.value,
                sliders.consistency.value,
                sliders.longRange.value,
                sliders.midRange.value,
                sliders.closeRange.value,
                sliders.aggression.value,
                sliders.defense.value
            ],
            backgroundColor: tinycolor("#ff0000").setAlpha(0.25).toRgbString(),
            borderColor: '#ff0000',
            borderWidth: 2,
        }]
    },
    options: {
        scale: {
            r: {
                pointLabels: {
                    font: {
                        weight: 'bold'
                    }
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        scales: {
            r: {
                ticks: {
                    // Callback function to customize tick labels
                    callback: function(value, index, values) {
                        return `${value} ${getGrade(value)}`; 
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    afterLabel: function(context) {
                        return `Grading: ${getGrade(context.formattedValue)}`;
                    }
                }
            }
        }
    }
});

function updateChart() {
    // Get values from the sliders
    const dataValues = [
        sliders.aimTracking.value,
        sliders.swappingReflexes.value,
        sliders.movementPositioning.value,
        sliders.gameSense.value,
        sliders.consistency.value,
        sliders.longRange.value,
        sliders.midRange.value,
        sliders.closeRange.value,
        sliders.aggression.value,
        sliders.defense.value
    ];

    // Get color and transparency
    const color = colorInput.value;
    const transparency = transparencyInput.value;

    const backgroundColor = tinycolor(color).setAlpha(transparency).toRgbString();
    const borderColor = tinycolor(color).toHexString(); // Ensure full color for the border

    // Update the chart data and appearance
    radarChart.data.datasets[0].data = dataValues;
    radarChart.data.datasets[0].backgroundColor = backgroundColor;
    radarChart.data.datasets[0].borderColor = borderColor;

    // Redraw the chart
    radarChart.update();
}

async function copyChart() {
    try {
        // Get the data URL of the canvas
        const dataUrl = radarChart.canvas.toDataURL('image/png');

        // Fetch the image data as a blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Create a clipboard item
        const item = new ClipboardItem({
            'image/png': blob
        });

        // Write the clipboard item to the clipboard
        await navigator.clipboard.write([item]);
        alert('Chart copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}