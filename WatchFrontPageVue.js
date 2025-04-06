const baseUrl = "https://localhost:7132/api/Watch";
const loginUrl = "https://localhost:7132/api/auth/login";

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
            userRole: '', // Track user's role
            watches: [],
            isAdmin: false, // Track if user is admin
            
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
            const response = await axios.get("https://localhost:7132/api/cart", {
                withCredentials: true
            });            
        },
    goToCreateWatch() {
        window.location.href = "AdminCreateWatch.html"; // Naviger til AdminCreateWatch-siden
    },
        // Læg ure i kurv via backend
        async addToCart(watch) {
            console.log("addToCart triggered:", watch);
        
            const cartItem = {
                watchId: watch.id,
                quantity: 1,
                totalPrice: watch.price
            };
        
            try {
                const response = await axios.post("https://localhost:7132/api/cart/add", cartItem, {
                    withCredentials: true
                });
                this.cart = response.data;
            } catch (error) {
                console.error("Fejl:", error);
                alert("Kunne ikke tilføje til kurv: " + (error.response?.data || error.message));
            }
        },        
        async removeFromCart(id) {
            try {
                await axios.post("https://localhost:7132/api/cart/remove", { id }, {
                    withCredentials: true
                });
                this.fetchCart(); // eller opdatér `this.cart` manuelt
            } catch (error) {
                console.error("Fejl ved fjernelse fra kurv:", error);
            }
        },        
        async checkout() {
            try {
                const response = await axios.post("https://localhost:7132/api/cart/checkout", {}, {
                    withCredentials: true
                });
                alert("Tak for dit køb!");
                this.cart = []; // Tøm kurven på frontend
            } catch (error) {
                console.error("Fejl under checkout:", error);
                alert("Noget gik galt under betaling: " + (error.response?.data || error.message));
            }
        },        
        async login() {
            try {
                const response = await axios.post(loginUrl, this.loginData);
                const token = response.data.token;
                localStorage.setItem("jwt", token);
                this.isLoggedIn = true;
                const decoded = jwt_decode(token);
                this.userRole = decoded.role;
                this.isAdmin = decoded.role === "Admin";
                alert("Login successful!");
                document.getElementById('id01').style.display = 'none';
            } catch (error) {
                alert("Login failed: " + (error.response?.data || error.message));
            }
        },
        logout() {
            localStorage.removeItem("jwt");
            this.isLoggedIn = false;
            this.isAdmin = false;
            
            this.$nextTick(() => {
                alert("Du er logget ud.");
            // alert("You have logged out.");
            });

        },
        closeLoginModal() {
            document.getElementById('id01').style.display = 'none';
        }
    },
    mounted() {
        const token = localStorage.getItem("jwt");
        if (token) {
            this.isLoggedIn = true;
            const decoded = jwt_decode(token);
            this.userRole = decoded.role;
            console.log("User role:", this.userRole); // Debugging
            this.isAdmin = decoded.role === "Admin";
        }
        this.fetchItems();
    }
});
app.mount("#app");
