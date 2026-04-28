document.addEventListener('DOMContentLoaded', () => {
    // Interactive Poll Logic
    const pollContainer = document.getElementById('dilemma-poll');
    
    if (pollContainer) {
        const options = pollContainer.querySelectorAll('.poll-option');
        let hasVoted = false;

        // Mock data for the poll results
        const pollResults = {
            'split': 45,
            'inviter': 35,
            'other': 20
        };

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (hasVoted) return; // Prevent multiple votes
                hasVoted = true;

                pollContainer.classList.add('voted');
                
                // Highlight the selected option
                this.classList.add('selected');

                // Animate the progress bars and show percentages
                options.forEach(opt => {
                    const voteKey = opt.getAttribute('data-vote');
                    const percentage = pollResults[voteKey];
                    
                    const progressBar = opt.querySelector('.poll-progress');
                    const percentageText = opt.querySelector('.poll-percentage');

                    // Set the width for the animation
                    progressBar.style.width = percentage + '%';
                    
                    // Display the text
                    percentageText.textContent = percentage + '%';
                    percentageText.style.opacity = '1';
                });
            });
        });
    }
});
