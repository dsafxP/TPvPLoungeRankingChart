toggleSliderValues();

function updateSliderValue(slider, spanId) {
    const detailsEnabled = document.getElementById('details').checked;
    const span = document.getElementById(spanId);
    span.textContent = slider.value;
    
    if (detailsEnabled) {
        span.style.display = 'inline';
    } else {
        span.style.display = 'none';
    }
}

function toggleSliderValues() {
    const detailsEnabled = document.getElementById('details').checked;
    const sliderValues = document.querySelectorAll('.slider-value');
    
    sliderValues.forEach(span => {
        if (detailsEnabled) {
            span.style.display = 'inline';  // Show values if Details is checked
        } else {
            span.style.display = 'none';  // Hide values if Details is unchecked
        }
    });
}