// Resume Builder - Edit Mode and Auto-Save

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editToggle = document.getElementById('edit-toggle');
    const editPanel = document.getElementById('edit-panel');
    const closePanel = document.getElementById('close-panel');
    const resumePage = document.getElementById('resume-page');
    const resetBtn = document.getElementById('reset-resume');
    const printBtn = document.getElementById('print-resume');
    const toggleText = editToggle.querySelector('.toggle-text');

    // State
    let isEditing = false;

    // Default resume content for reset
    const defaultContent = {
        'preview-name': 'Aditya Jaiswal',
        'preview-title': 'Senior Software Engineer',
    };

    // Toggle edit mode
    editToggle.addEventListener('click', function() {
        isEditing = !isEditing;
        
        if (isEditing) {
            editToggle.classList.add('active');
            resumePage.classList.add('editing');
            toggleText.textContent = 'Editing';
            openPanel();
        } else {
            editToggle.classList.remove('active');
            resumePage.classList.remove('editing');
            toggleText.textContent = 'Edit';
            closePanelHandler();
        }
    });

    // Close panel
    closePanel.addEventListener('click', closePanelHandler);

    function openPanel() {
        editPanel.classList.add('open');
    }

    function closePanelHandler() {
        editPanel.classList.remove('open');
    }

    // Print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Reset functionality
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
            localStorage.removeItem('resume-content');
            location.reload();
        }
    });

    // Auto-save functionality
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    // Load saved content from localStorage
    function loadSavedContent() {
        const savedContent = localStorage.getItem('resume-content');
        if (savedContent) {
            try {
                const content = JSON.parse(savedContent);
                editableElements.forEach(function(el) {
                    const id = el.id || el.className;
                    if (content[id]) {
                        el.innerHTML = content[id];
                    }
                });
            } catch (e) {
                console.error('Error loading saved content:', e);
            }
        }
    }

    // Save content to localStorage
    function saveContent() {
        const content = {};
        editableElements.forEach(function(el) {
            const id = el.id || el.className;
            content[id] = el.innerHTML;
        });
        localStorage.setItem('resume-content', JSON.stringify(content));
    }

    // Debounce function for auto-save
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Auto-save on input
    const autoSave = debounce(function() {
        saveContent();
        console.log('Content saved automatically');
    }, 1000);

    // Add input listeners to all editable elements
    editableElements.forEach(function(el) {
        el.addEventListener('input', autoSave);
        
        // Prevent default link behavior when editing
        if (el.tagName === 'A') {
            el.addEventListener('click', function(e) {
                if (!isEditing) {
                    e.preventDefault();
                }
            });
        }
    });

    // Handle paste - strip formatting
    editableElements.forEach(function(el) {
        el.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveContent();
            alert('Resume saved!');
        }
        
        // Ctrl+P to print
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
        
        // Escape to close panel
        if (e.key === 'Escape' && isEditing) {
            closePanelHandler();
        }
    });

    // Initialize
    loadSavedContent();

    console.log('Resume Builder initialized');
    console.log('Press Ctrl+S to save, Ctrl+P to print');
});