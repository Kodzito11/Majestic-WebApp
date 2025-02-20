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
                    password: this.password,
                    role: 0             
                });
                this.successMessage = "User created successfully!";
            } catch (error) {
                this.errorMessage = "Failed to create user: " + (error.response?.data || error.message);
            }
        }
    }
}).mount("#app");
