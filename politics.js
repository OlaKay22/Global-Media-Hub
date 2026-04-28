document.addEventListener('DOMContentLoaded', () => {
    // Geographic Filtering Logic for Local News Sidebar
    const regionSelect = document.getElementById('region-select');
    const newsItems = document.querySelectorAll('.local-story');

    if (regionSelect && newsItems.length > 0) {
        regionSelect.addEventListener('change', (e) => {
            const selectedRegion = e.target.value;

            newsItems.forEach(item => {
                const itemRegion = item.getAttribute('data-region');
                
                // If "all" is selected or the region matches the selected value
                if (selectedRegion === 'all' || itemRegion === selectedRegion) {
                    item.style.display = 'block';
                    // Optional: add a tiny fade-in effect
                    item.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});
