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
      },
      items: [], // Liste over eksisterende ure
      isEditModalOpen: false, // Styrer visning af redigeringsmodal
      editWatchData: {}, // Data for det ur, der redigeres
      isAdmin: false, // Antag at brugeren ikke er admin for nu
    };
  },
  methods: {
    async fetchItems() {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        this.items = data;
        console.log("Fetched items:", this.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    methods: {
      // Andet kode...
    
      logout() {
        // Fjern JWT token og log ud
        localStorage.removeItem("jwt");
    
        // Opdater isAdmin og sørg for, at Vue opdaterer DOM'en
        this.isAdmin = false;
    
        // Brug nextTick for at sikre, at DOM'en opdateres korrekt
        this.$nextTick(() => {
          console.log("Admin er nu logget ud, og knappen skal forsvinde.");
        });
      },
      
      // Resten af dine metoder...
    },    
    async createWatch() {
      try {
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify(this.newWatch)
        });

        if (response.ok) {
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
          this.fetchItems(); // Opdater listen over ure
        } else {
          const errorData = await response.json();
          console.error("Error creating watch:", errorData);
          alert("Der opstod en fejl ved oprettelsen af uret.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Netværksfejl. Prøv igen senere.");
      }
    },
    editWatch(watch) {
      this.editWatchData = { ...watch }; // Kopier data for det valgte ur
      this.isEditModalOpen = true; // Åbn modal
    },
    closeEditModal() {
      this.isEditModalOpen = false; // Luk modal
    },
    async updateWatch() {
      console.log("Opdateringsdata:", this.editWatchData); // Debugging
      try {
        const response = await fetch(`${baseUrl}/${this.editWatchData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify(this.editWatchData)
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Opdateret ur:", data); // Debugging
          alert("Uret blev opdateret!");
          this.isEditModalOpen = false; // Luk modal
          this.fetchItems(); // Opdater listen over ure
        } else {
          const errorData = await response.json();
          console.error("Fejl ved opdatering:", errorData);
          alert("Der opstod en fejl ved opdateringen af uret: " + (errorData.message || "Ukendt fejl"));
        }
      } catch (error) {
        console.error("Netværksfejl:", error);
        alert("Netværksfejl. Prøv igen senere.");
      }
    }
  },
  mounted() {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwt_decode(token);
      this.isAdmin = decoded.role === "Admin";  // Sørg for at være admin, før du tillader oprettelse
    } else {
      this.isAdmin = false;  // Hvis ikke logged in, ikke admin
  }
  }
}).mount('#app');

