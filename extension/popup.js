const API_BASE_URL = 'http://127.0.0.1:5000';

class ExtensionApp {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }

    initializeElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('length-value');
        this.uppercaseCheck = document.getElementById('uppercase');
        this.lowercaseCheck = document.getElementById('lowercase');
        this.numbersCheck = document.getElementById('numbers');
        this.specialCheck = document.getElementById('special');
        this.easyRememberCheck = document.getElementById('easy-remember');
        this.generatePasswordBtn = document.getElementById('generate-password');
        this.passwordResult = document.getElementById('password-result');
        this.generatedPassword = document.getElementById('generated-password');
        this.copyPasswordBtn = document.getElementById('copy-password');
        this.fakeDataChecks = {
            name: document.getElementById('fake-name'),
            address: document.getElementById('fake-address'),
            phoneNumber: document.getElementById('fake-phone'),
            email: document.getElementById('fake-email'),
            age: document.getElementById('fake-age'),
            dni: document.getElementById('fake-dni')
        };
        this.generateFakeDataBtn = document.getElementById('generate-fake-data');
        this.fakeDataResult = document.getElementById('fake-data-result');
        this.fakeDataList = document.getElementById('fake-data-list');
        this.status = document.getElementById('status');
    }

    bindEvents() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
        });
        this.generatePasswordBtn.addEventListener('click', () => this.generatePassword());
        this.copyPasswordBtn.addEventListener('click', () => this.copyPassword());
        this.generateFakeDataBtn.addEventListener('click', () => this.generateFakeData());
        [
            this.lengthSlider,
            this.uppercaseCheck,
            this.lowercaseCheck,
            this.numbersCheck,
            this.specialCheck,
            this.easyRememberCheck
        ].forEach(element => {
            element.addEventListener('change', () => this.saveSettings());
        });
    }

    switchTab(tabName) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    async generatePassword() {
        try {
            this.showStatus('Generating password...', 'info');
            const settings = {
                length: parseInt(this.lengthSlider.value),
                includeUppercase: this.uppercaseCheck.checked,
                includeLowercase: this.lowercaseCheck.checked,
                includeNumbers: this.numbersCheck.checked,
                includeSpecialCharacters: this.specialCheck.checked,
                isEasyToRemember: this.easyRememberCheck.checked
            };
            const response = await fetch(`${API_BASE_URL}/request_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate password');
            }
            const data = await response.json();
            this.generatedPassword.value = data.password;
            this.passwordResult.classList.remove('hidden');
            this.showStatus('Password generated successfully!', 'success');
        } catch (error) {
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }

    async generateFakeData() {
        try {
            this.showStatus('Generating fake data...', 'info');
            const selectedData = {};
            Object.keys(this.fakeDataChecks).forEach(key => {
                selectedData[key] = this.fakeDataChecks[key].checked;
            });
            selectedData.userLanguage = navigator.language || 'en-US';
            const response = await fetch(`${API_BASE_URL}/api/generate_fake_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate fake data');
            }
            const data = await response.json();
            this.displayFakeData(data);
            this.showStatus('Fake data generated successfully!', 'success');
        } catch (error) {
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }

    displayFakeData(data) {
        this.fakeDataList.innerHTML = '';
        Object.entries(data).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${key}:</strong> ${value}`;
            this.fakeDataList.appendChild(item);
        });
        this.fakeDataResult.classList.remove('hidden');
    }

    async copyPassword() {
        try {
            await navigator.clipboard.writeText(this.generatedPassword.value);
            this.showStatus('Password copied to clipboard!', 'success');
            this.copyPasswordBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyPasswordBtn.textContent = 'Copy';
            }, 2000);
        } catch (error) {
            this.showStatus('Failed to copy password', 'error');
        }
    }

    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                this.status.textContent = '';
                this.status.className = 'status';
            }, 3000);
        }
    }

    saveSettings() {
        const settings = {
            length: this.lengthSlider.value,
            uppercase: this.uppercaseCheck.checked,
            lowercase: this.lowercaseCheck.checked,
            numbers: this.numbersCheck.checked,
            special: this.specialCheck.checked,
            easyRemember: this.easyRememberCheck.checked
        };
        chrome.storage.local.set({ passwordSettings: settings });
    }

    loadSettings() {
        chrome.storage.local.get(['passwordSettings'], (result) => {
            if (result.passwordSettings) {
                const settings = result.passwordSettings;
                this.lengthSlider.value = settings.length || 12;
                this.lengthValue.textContent = this.lengthSlider.value;
                this.uppercaseCheck.checked = settings.uppercase !== false;
                this.lowercaseCheck.checked = settings.lowercase !== false;
                this.numbersCheck.checked = settings.numbers !== false;
                this.specialCheck.checked = settings.special || false;
                this.easyRememberCheck.checked = settings.easyRemember || false;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ExtensionApp();
});
