const URI = "https://localhost:7132/api/Users";

Vue.createApp({
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: null,
            successMessage: null
        };
    },
    methods: {
        async signUpUser() {
            
            this.errorMessage = null;
            this.successMessage = null;

            
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Passwords do not match";
                return;
            }

            try {
                await axios.post(URI, {
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

               
                this.errorMessage = null;
                this.successMessage = "Account created successfully!";

                
                this.username = '';
                this.email = '';
                this.password = '';
                this.confirmPassword = '';

            } catch (error) {
                
                this.successMessage = null;
                this.errorMessage = "Failed to create account: " + (error.response?.data || error.message);
            }
        }
    }
}).mount("#app");
