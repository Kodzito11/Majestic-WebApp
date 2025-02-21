const baseUrl = "https://localhost:7132/api/Watch"; // Base URL for backend API

Vue.createApp({
  data() {
    return {
      items: [], // Holder alle elementer til tabellen
      headers: ["ID", "Brand", "Model", "ReferenceNumber", "Year", "Functions", "Size", "Description", "Price"], // Dynamisk genererede kolonnenavne
      formTemplate: { id: "", brand: "", model: "", referencenumber: "", year: "", functions: "", size: "", description: "", price: "" }, // Skabelon til formularfelter
      formData: { id: "", brand: "", model: "", referencenumber: "", year: "", functions: "", size: "", description: "", price: "" }, // Data som brugeren indtaster i formularen
    };
  },
  methods: {
    // Hent alle elementer fra backend
    async fetchItems() {
      try {
        const response = await axios.get(baseUrl); // GET request
        this.items = response.data; // Opdaterer items-listen med data fra backend
      } catch (error) {
        console.error("Error fetching items:", error); // Fejlhåndtering
      }
    },

    // Tilføj et nyt element til backend
    async addItem() {
      try {
        const response = await axios.post(baseUrl, this.formData); // POST request
        this.items.push(response.data); // Tilføj det nye element til items-listen
        this.resetForm(); // Ryd formularen efter tilføjelse
      } catch (error) {
        console.error("Error adding item:", error); // Fejlhåndtering
      }
    },

    // Ryd formularen
    resetForm() {
      this.formData = { ...this.formTemplate }; // Nulstiller formData til skabelonens standardværdier
    },
  },
  // Hent data, når applikationen loader
  mounted() {
    console.log("Vue app mounted!");
    this.fetchItems();
  }
}).mount("#app");
