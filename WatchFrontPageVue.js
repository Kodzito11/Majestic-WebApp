const baseUrl = "https://localhost:7132/api/Watch";
const loginUrl = "https://localhost:7132/api/auth/login";
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
            isLoggedIn: false, // Track login status
            userRole: '' // Track user's role
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
        // Hent ure
        async fetchItems(query = "") {
            try {
                const response = await axios.get(baseUrl, { params: { query } });
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
            const token = localStorage.getItem("jwt");
        
            const cartItem = {
                watchId: watch.id,
                quantity: 1,
                totalPrice: watch.price
            };
            
        
            try {
                const response = await axios.post("https://localhost:7132/api/cart/add", cartItem, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                this.cart = response.data; // backend returnerer opdateret kurv
            } catch (error) {
                console.error("Error adding to cart:", error.response?.data || error.message);
                alert("Kunne ikke tilføje til kurv: " + (error.response?.data || error.message));
            }
        },        
        // Fjern ure fra kurven
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id);
        },
        async checkout() {
            const token = localStorage.getItem("jwt");
            try {
                const response = await await axios.post("https://localhost:7132/api/cart/checkout", this.cart, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Tak for dit køb!");
                this.cart = []; // ryd kurven
            } catch (error) {
                alert("Noget gik galt under betaling: " + (error.response?.data || error.message));
            }
        },        
        // Login funktion
        async login() {
            try {
                const response = await axios.post(loginUrl, this.loginData);
                const token = response.data.token;
                localStorage.setItem("jwt", token);
                this.isLoggedIn = true;
                const decoded = jwt_decode(token);
                this.userRole = decoded.role;
                alert("Login successful!");
                document.getElementById('id01').style.display = 'none'; // Luk modal
            } catch (error) {
                alert("Login failed: " + (error.response?.data || error.message));
            }
        },
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
    watch: {
        searchQuery(newQuery) {
            this.fetchItems(newQuery); // Opdater ure ved søgning
        }
    },
    mounted() {
        const token = localStorage.getItem("jwt");
        if (token) {
            this.isLoggedIn = true;
            const decoded = jwt_decode(token);
            this.userRole = decoded.role;
        }
        this.fetchItems();
    }
});
app.mount("#app");
