const baseUrl = "https://localhost:7132/api/Watch";
const cartUrl = "https://localhost:7132/api/cart";
const searchUrl = `${baseUrl}/search?query=${this.searchQuery}`;

const app = Vue.createApp({
    data() {
        return {
            searchQuery: "",
            items: [], // Liste over ure fra backend
            cart: [], // Indkøbskurv fra backend
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
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + item.totalPrice, 0);
        }
    },
    methods: {

        async checkout() {
            alert("Checkout-funktionen er ikke implementeret endnu.");
            // Her kan du tilføje logik til at håndtere checkout-processen
        },
        // Hent ure fra backend
        async fetchItems(query = "") {
            try {
                const response = await axios.get(baseUrl, { params: { query } });
                console.log("Fetched items:", response.data);
                this.items = response.data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        },
        // Hent kurv fra backend
        async fetchCart() {
            try {
                const response = await axios.get(cartUrl);
                console.log("Fetched cart:", response.data);
                this.cart = response.data;
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        },
        
        // Læg ure i kurv via backend
        async addToCart(watch) {
            try {
                const userId = this.isLoggedIn ? 1 : 0; // Brug 1 for logget ind bruger, 0 for gæst
                const payload = { 
                    watchId: watch.id, 
                    quantity: 1, 
                    totalPrice: watch.price, 
                    userId: userId 
                };
                console.log("Payload sent to backend:", payload); // Log payloaden
                const response = await axios.post(`${cartUrl}/add`, payload);
                console.log("Added to cart:", response.data);
                this.cart = response.data; // Opdater kurven med de nyeste data fra backend
            } catch (error) {
                console.error("Error adding to cart:", error.response?.data || error.message);
                alert("Kunne ikke tilføje til kurv: " + (error.response?.data || error.message));
            }
        },

        async removeFromCart(watchId) {
            try {
                const response = await axios.delete(`https://localhost:7132/api/cart/remove/${watchId}`);
                this.cart = response.data;  // Opdater kurven
            } catch (error) {
                console.error("Error removing from cart:", error.response?.data || error);
                alert("Error removing from cart: " + (error.response?.data || error.message));
            }
        },
        
          
        // Fjern ure fra kurven via backend
        // async removeFromCart(watchId) {
        //     console.log("watchId received in removeFromCart:", watchId); // Debugging
        //     if (!watchId) {
        //         alert("Ugyldigt watchId.");
        //         return;
        //     }
        
        //     try {
        //         console.log(`DELETE request URL: ${cartUrl}/remove/${watchId}`);
        //         const response = await axios.delete(`${cartUrl}/remove/${watchId}`);
        //         console.log("Removed from cart:", response.data);
        //         this.cart = response.data; // Opdater kurven med de nyeste data fra backend
        //     } catch (error) {
        //         console.error("Error removing from cart:", error.response?.data || error.message);
        //         alert("Kunne ikke fjerne fra kurv: " + (error.response?.data || error.message));
        //     }
        // },
        // // Login funktion
        async login() {
            try {
                const response = await axios.post(loginUrl, this.loginData);
                const token = response.data.token;
                localStorage.setItem("jwt", token); // Gem token i localStorage
                this.isLoggedIn = true; // Set login status
                alert("Login successful!");
                this.fetchCart(); // Hent kurv efter login
            } catch (error) {
                alert("Login failed: " + (error.response?.data || error.message));
            }
        },
        // Logout funktion
        logout() {
            localStorage.removeItem("jwt"); // Fjern token fra localStorage
            this.isLoggedIn = false; // Opdater login status
            this.cart = []; // Ryd kurven
            alert("You have logged out.");
        },
    
         // Luk login modal
         closeLoginModal() {
        document.getElementById('id01').style.display = 'none';
        }
    },
      watch: {
        searchQuery(newQuery) {
            this.fetchItems(newQuery); // Opdater ure ved søgning
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
