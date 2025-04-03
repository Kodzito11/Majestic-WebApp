const baseUrl = "https://localhost:7132/api/Watch";
const loginUrl = "https://localhost:7132/api/auth/login";

const app = Vue.createApp({
    data() {
        return {
            searchQuery: "",
            items: [],
            cart: [],
            loginData: {
                email: '',
                password: ''
            },
            isLoggedIn: false // Track login status
        };
    },
    computed: {
        filteredWatches() {
            return this.items.filter(watch => 
                watch.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                watch.model.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        // Hent ure
        async fetchItems() {
            try {
                const response = await axios.get(baseUrl);
                console.log("Fetched items:", response.data);
                this.items = response.data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        },
        // Læg ure i kurv
        addToCart(watch) {
            this.cart.push(watch);
        },
        // Fjern ure fra kurven
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id);
        },
        // Login funktion
        async login() {
            try {
                const response = await axios.post(loginUrl, this.loginData);
                const token = response.data.token;
                localStorage.setItem("jwt", token); // Gem token i localStorage
                this.isLoggedIn = true; // Set login status
                alert("Login successful!");
                document.getElementById('id01').style.display = 'none'; // Luk modal
            } catch (error) {
                alert("Login failed: " + (error.response?.data || error.message)); // Håndter loginfejl
            }
        },
        // Logout funktion
        logout() {
            localStorage.removeItem("jwt"); // Fjern token fra localStorage
            this.isLoggedIn = false; // Opdater login status
            alert("You have logged out.");
        },
        // Luk login modal
        closeLoginModal() {
            document.getElementById('id01').style.display = 'none';
        }
    },
    mounted() {
        // Hvis token findes i localStorage, set brugeren som logget ind
        const token = localStorage.getItem("jwt");
        if (token) {
            this.isLoggedIn = true;
        }
        this.fetchItems(); // Hent ure ved app-opstart
    }
});

app.mount("#app");
