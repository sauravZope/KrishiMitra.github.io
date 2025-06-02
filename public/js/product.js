// Show More Description Functionality
document.addEventListener('DOMContentLoaded', function() {
    const productDescriptions = document.querySelectorAll('.product__description');
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'description-modal';
    document.body.appendChild(modalContainer);
    
    productDescriptions.forEach(description => {
        const text = description.textContent;
        if (text.length > 150) { // Only add show more if description is long enough
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-btn';
            description.parentNode.insertBefore(showMoreBtn, description.nextSibling);
            
            showMoreBtn.addEventListener('click', () => {
                // Create modal content
                const modalContent = `
                    <div class="description-modal__content">
                        <button class="description-modal__close">&times;</button>
                        <div class="description-modal__header">
                            <h2 class="description-modal__title">${description.closest('.product-item').querySelector('.product__title').textContent}</h2>
                        </div>
                        <p class="description-modal__description">${text}</p>
                    </div>
                `;
                
                modalContainer.innerHTML = modalContent;
                modalContainer.classList.add('visible');
                
                // Add close button functionality
                const closeBtn = modalContainer.querySelector('.description-modal__close');
                closeBtn.addEventListener('click', () => {
                    modalContainer.classList.remove('visible');
                });
                
                // Close modal when clicking outside
                modalContainer.addEventListener('click', (e) => {
                    if (e.target === modalContainer) {
                        modalContainer.classList.remove('visible');
                    }
                });
            });
        }
    });
}); 