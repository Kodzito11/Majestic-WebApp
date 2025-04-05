const baseUrl = "https://localhost:7132/api/Watch";
const loginUrl = "https://localhost:7132/api/auth/login";

const { createApp } = Vue;

createApp({
  data() {
    return {
      newWatch: {
        brand: '',
        model: '',
        referenceNumber: '',
        year: '',
        functions: '',
        size: '',
        description: '',
        price: ''
      }
    };
  },
  methods: {
    async createWatch() {
      console.log("createWatch kaldt"); // Debugging
      try {
        const response = await fetch('https://localhost:7132/api/watch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify(this.newWatch)
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Watch created successfully:', data);
          alert("Uret blev oprettet!");
          this.newWatch = {
            brand: '',
            model: '',
            referenceNumber: '',
            year: '',
            functions: '',
            size: '',
            description: '',
            price: ''
          };
          // Hent listen over ure igen
          this.fetchItems();
        } else {
          const errorData = await response.json();
          console.error('Error creating watch:', errorData);
          alert("Der opstod en fejl ved oprettelsen af uret: " + (errorData.message || "Ukendt fejl"));
        }
      } catch (error) {
        console.error('Network error:', error);
        alert("Netværksfejl. Prøv igen senere.");
      }
    },
    async fetchItems() {
      try {
        const response = await fetch('https://localhost:7132/api/watch');
        const data = await response.json();
        console.log('Fetched items:', data);
        // Opdater listen over ure
        this.items = data;
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
  },
}).mount('#app');

