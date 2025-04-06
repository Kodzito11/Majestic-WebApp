const URI = "https://localhost:7132/api/Users"; // API Link

Vue.createApp({
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: null,
            successMessage: null,
            passwordStrength: null
        };
    },
    watch: {
        password(newVal) {
            this.evaluatePasswordStrength(newVal);
        }
    },
    methods: {
        async signUpUser() {
            this.errorMessage = null;
            this.successMessage = null;
        
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match";
                return;
            }
        
            const payload = {
                username: this.username,
                email: this.email,
                password: this.password
            };
        
            try {
                const response = await axios.post(URI, payload);
                this.successMessage = "Account created successfully!";
                this.username = '';
                this.email = '';
                this.password = '';
                this.confirmPassword = '';
            } catch (error) {
                this.successMessage = null;
                // Sikrer, at vi håndterer fejlen korrekt og viser en relevant besked
                if (error.response) {
                    // Check if the response data directly contains the message
                    if (error.response.data && typeof error.response.data === 'string') {
                        this.errorMessage = error.response.data;
                    } else if (error.response.data && error.response.data.detail) {
                        // If the response has a detail property, often used in APIs
                        this.errorMessage = error.response.data.detail;
                    } else {
                        this.errorMessage = "An error occurred: " + error.response.statusText;
                    }
                } else {
                    this.errorMessage = "Failed to create account: " + (error.message || 'Unknown error');
                }
            }
        },
        evaluatePasswordStrength(password) {
            const length = password.length;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChars = /\W/.test(password);
            let strength = 0;

            if (length >= 8) strength += 1;
            if (hasUpperCase) strength += 1;
            if (hasLowerCase) strength += 1;
            if (hasNumbers) strength += 1;
            if (hasSpecialChars) strength += 1;

            switch (strength) {
                case 1:
                case 2:
                    this.passwordStrength = 'Very Weak';
                    break;
                case 3:
                    this.passwordStrength = 'Weak';
                    break;
                case 4:
                    this.passwordStrength = 'Medium';
                    break;
                case 5:
                    this.passwordStrength = 'Strong';
                    break;
                default:
                    this.passwordStrength = null;
            }
        }
    }
}).mount("#app");
