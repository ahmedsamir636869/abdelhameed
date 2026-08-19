(() => {
    'use strict';

    function updateSelectedFiles() {
        const fileInput = document.getElementById('quote-files');
        const description = document.getElementById('quote-files-description');
        const status = document.getElementById('quote-files-status');

        if (!fileInput || !description || !status) {
            return;
        }

        const files = Array.from(fileInput.files ?? []);

        if (files.length === 0) {
            description.hidden = false;
            status.hidden = true;
            status.replaceChildren();

            return;
        }

        const count = document.createElement('span');
        count.className = 'quote-file-selection-count';
        count.textContent = `${files.length} file${files.length === 1 ? '' : 's'} selected:`;

        const names = document.createDocumentFragment();

        files.forEach((file) => {
            const name = document.createElement('span');
            name.className = 'quote-file-selection-name';
            name.textContent = file.name;
            names.append(name);
        });

        description.hidden = true;
        status.hidden = false;
        status.replaceChildren(count, names);
    }

    function initialiseQuoteFileSelection() {
        const fileInput = document.getElementById('quote-files');

        if (!fileInput) {
            return function () {};
        }

        fileInput.addEventListener('change', updateSelectedFiles);
        updateSelectedFiles();

        return function () {
            fileInput.removeEventListener('change', updateSelectedFiles);
        };
    }

    window.__abdelhamidEffects = window.__abdelhamidEffects || {};
    window.__abdelhamidEffects['/assets/js/quote.js'] = initialiseQuoteFileSelection;
})();
