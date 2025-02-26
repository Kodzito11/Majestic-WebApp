const baseUrl = "https://localhost:7132/api/Watch";

const app = Vue.createApp({
    data() {
        return {
            searchQuery: "",
            items: [],
            cart: []
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
        async fetchItems() {
            try {
                const response = await axios.get(baseUrl);
                console.log("Fetched items:", response.data);
                this.items = response.data;
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        },
        addToCart(watch) {
            this.cart.push(watch);
        },
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id);
        }
    },
    mounted() {
        this.fetchItems();
    }
});
app.mount("#app");

