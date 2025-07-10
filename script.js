document.addEventListener('DOMContentLoaded', function () {
    const contactButton = document.getElementById('contactButton');
    const contactMessage = document.getElementById('contactMessage');
    const getRecommendationBtn = document.getElementById('getRecommendationBtn');
    const recommendationModal = document.getElementById('recommendationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const generateRecommendationBtn = document.getElementById('generateRecommendationBtn');
    const recommendationResult = document.getElementById('recommendationResult');
    const recommendationText = document.getElementById('recommendationText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // --- Contact Button Logic ---
    if (contactButton) {
        contactButton.addEventListener('click', function () {
            contactMessage.classList.remove('hidden');
            // In a real application, this would open Google Maps or a contact form.
            // Example: window.open('https://www.google.com/maps/search/?api=1&query=Your+Address+Near+Sattur', '_blank');
        });
    }

    // --- Section Fade-in Animation Logic for Text Content ---
    const sections = document.querySelectorAll('section:not(.hero-bg):not(.info-bar-section):not(.marquee-container)');
    const options = {
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        observer.observe(section);
    });

    // --- Image Fade-in/Scale Animation Logic for Section Images ---
    const sectionImages = document.querySelectorAll('.section-image');
    const imageOptions = {
        threshold: 0.3 // Trigger when 30% of the image is visible
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Optional: reset animation when out of view
                // entry.target.classList.remove('is-visible');
            }
        });
    }, imageOptions);

    sectionImages.forEach(image => {
        imageObserver.observe(image);
    });

    // --- Testimonial Card Animation Logic ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialOptions = {
        threshold: 0.2 // Trigger when 20% of the card is visible
    };

    const testimonialObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, testimonialOptions);

    testimonialCards.forEach(card => {
        card.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        testimonialObserver.observe(card);
    });


    // --- Recommendation Modal Logic ---
    getRecommendationBtn.addEventListener('click', () => {
        recommendationModal.classList.remove('hidden');
        // Apply fade-in animation to modal content
        setTimeout(() => {
            recommendationModal.querySelector('.modal-content').classList.add('animate-fade-in');
            recommendationModal.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
        }, 10); // Small delay to ensure hidden is removed first
    });

    closeModalBtn.addEventListener('click', () => {
        recommendationModal.querySelector('.modal-content').classList.add('animate-fade-out');
        recommendationModal.querySelector('.modal-content').classList.remove('animate-fade-in');
        setTimeout(() => {
            recommendationModal.classList.add('hidden');
            recommendationModal.querySelector('.modal-content').classList.remove('animate-fade-out');
            recommendationModal.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
        }, 500); // Match animation duration
    });

    // --- Gemini API Call for Recommendation ---
    generateRecommendationBtn.addEventListener('click', async () => {
        const budget = document.getElementById('budget').value;
        const effect = document.getElementById('effect').value;
        const celebrationType = document.getElementById('celebrationType').value;

        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        recommendationResult.classList.remove('hidden'); // Ensure result area is visible
        recommendationText.innerHTML = ''; // Clear previous results

        const prompt = `As a firecracker expert for Codlyf Firecrackers near Sattur, Tamil Nadu, suggest a personalized firecracker package for Diwali.
                User preferences:
                - Budget: ${budget}
                - Preferred Effect: ${effect}
                - Celebrating With: ${celebrationType}

                Please provide a creative and appealing recommendation, including specific types of firecrackers (e.g., '100-shot aerial display', 'colorful ground chakras', 'safe sparklers for kids'). Keep it concise and festive, around 2-3 paragraphs.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = { contents: chatHistory };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                recommendationText.innerHTML = text.replace(/\n/g, '<br>'); // Display text, preserving newlines
            } else {
                recommendationText.innerHTML = 'Sorry, I could not generate a recommendation at this time. Please try again!';
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            recommendationText.innerHTML = 'An error occurred while fetching the recommendation. Please try again later.';
        } finally {
            loadingIndicator.classList.add('hidden'); // Hide loading indicator
            // Hide modal after generation
            recommendationModal.querySelector('.modal-content').classList.add('animate-fade-out');
            recommendationModal.querySelector('.modal-content').classList.remove('animate-fade-in');
            setTimeout(() => {
                recommendationModal.classList.add('hidden');
                recommendationModal.querySelector('.modal-content').classList.remove('animate-fade-out');
                recommendationModal.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
            }, 500);
        }
    });
});