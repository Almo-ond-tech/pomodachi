modeInput.addEventListener('change', () => { 
    body.classList.toggle('light-mode', modeInput.checked);
    modeTitle.textContent = modeInput.checked ? 'Neopolitan' : 'Mint Choco';
});