<template>
  <v-app>
    <v-container class="container-highlight">
      
      <v-row class="container-highlight mb-3">
        <v-col cols="12">
          <h2 class="page-title">Instrument Management</h2>
        </v-col>
      </v-row>

      <v-row class="container-highlight mb-3">
        <v-col cols="12">
          <v-text-field
            v-model="searchTerm"
            label="Search"
            append-icon="mdi-magnify"
            hide-details
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="container-highlight mb-3">
        <v-col cols="12">
          <table class="container-highlight centered-table">
            <thead>
              <tr>
                <th class="centered-header">Name</th>
                <th class="centered-header">Acronym</th>
                <th class="centered-header">Category</th>
                <th class="centered-header">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="instrument in instruments" :key="instrument.nombre">
                <td>{{ instrument.nombre }}</td>
                <td>{{ instrument.acronimo }}</td>
                <td>{{ instrument.categoria }}</td>
                <td class="centered-buttons">
                  <v-btn @click="openUpdateInstrumentModal(instrument)" color="warning">Update</v-btn>
                  <v-btn @click="deleteInstrumentConfirmation(instrument.nombre)" color="error">Delete</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>

      <!-- Button "Add Instrument" aligned to the right -->
      <v-row class="text-right">
        <v-col cols="12">
          <v-btn @click="openAddInstrumentModal" color="#313844">Add Instrument</v-btn>
        </v-col>
      </v-row>

      <!-- Modal for adding a new instrument -->
      <v-dialog v-model="isAddInstrumentModalActive" fullscreen flex-wrap>
        <v-card>
          <v-card-title>
            <span class="headline">Add Instrument</span>
          </v-card-title>
          <v-card-text class="overflow-y-auto">
            <!-- Campos de texto para el nuevo instrumento -->
            <v-text-field v-model="newInstrument.nombre" label="Name"></v-text-field>
            <v-text-field v-model="newInstrument.acronimo" label="Acronym"></v-text-field>
            <v-text-field v-model="newInstrument.categoria" label="Category"></v-text-field>

            <v-row>
              <v-btn @click="openAddItemModal" color="#313844">Add Item</v-btn>
            </v-row>
            <v-row>
              <div class="card-container">
                <div class="card-column" v-for="(card, index) in cards" :key="index">
                  <transition name="card-fade">
                    <div class="card mb-4">
                      <!-- Sección de la imagen de la Card -->
                      <div class="card-image">
                        <img :src="card.imageUrl" class="card-img-top" alt="Imagen de la Card">
                      </div>

                      <!-- Sección de la información de la Card -->
                      <div class="card-info">
                        <div class="card-body">
                          <h4 class="card-title">Item {{ card.num }}</h4>
                          <p class="card-text">Description: {{ card.descripcion }}</p>
                          <p class="card-text">Registration Type: {{ card.registro }}</p>
                          <p class="card-text" v-if="card.registro === 'Tiempo'">Time: {{ card.tiempo }}</p>
                          <p class="card-text">Rating: {{ card.escala }}</p>

                          <!-- Botones de editar y eliminar -->
                          <div class="card-actions">
                            <v-btn @click="openUpdateItemModal(card)" class="mt-4" color="warning">UPDATE</v-btn>
                            <v-btn @click="eliminarCard(index)" class="mt-4" color="error">DELETE</v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition> 
                </div>
              </div>
            </v-row>
          </v-card-text>

          <!-- Botones de acción -->
          <v-card-actions>
            <v-btn @click="addNewInstrument" color="primary">Add</v-btn>
            <v-btn @click="closeAddInstrumentModal">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for update instrument -->
      <v-dialog v-model="isUpdateInstrumentModalActive" fullscreen flex-wrap>
        <v-card>
          <v-card-title>
            <span class="headline">Update Instrument</span>
          </v-card-title>

          <v-card-text class="overflow-y-auto">
            <!-- Text fields for updating the instrument -->
            <v-text-field v-model="updatedInstrument.nombre" label="Name"></v-text-field>
            <v-text-field v-model="updatedInstrument.acronimo" label="Acronym"></v-text-field>
            <v-text-field v-model="updatedInstrument.categoria" label="Category"></v-text-field>

            <!-- Button to add a new item -->
            <v-row>
              <v-btn @click="openAddItemUpdateModal" color="#313844">Add Item</v-btn>
            </v-row>

            <!-- Cards to display information about items -->
            <v-row>
              <div class="card-container">
                <div class="card-column" v-for="(card1, index) in updatedInstrument.items" :key="index">
                  <transition name="card-fade">
                    <div class="card mb-4">
                      <!-- Section for the image of the Card -->
                      <div class="card-image">
                        <img :src="card1.imageUrl" class="card-img-top" alt="Card Image">
                      </div>

                      <!-- Section for the information of the Card -->
                      <div class="card-info">
                        <div class="card-body">
                          <h4 class="card-title">Item {{ card1.num }}</h4>
                          <p class="card-text">Description: {{ card1.descripcion }}</p>
                          <p class="card-text">Registration Type: {{ card1.registro }}</p>
                          <p class="card-text" v-if="card1.registro === 'Tiempo'">Time: {{ card1.tiempo }}</p>
                          <p class="card-text">Rating: {{ card1.escala }}</p>

                          <!-- Buttons to edit and delete -->
                          <div class="card-actions">
                            <v-btn @click="openUpdateItemModal(card1)" class="mt-4" color="warning">UPDATE</v-btn>
                            <v-btn @click="eliminarUpdateCard(index)" class="mt-4" color="error">DELETE</v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </v-row>
          </v-card-text>

          <!-- Action buttons -->
          <v-card-actions>
            <v-btn @click="updateInstrument" color="warning">UPDATE</v-btn>
            <v-btn @click="closeUpdateInstrumentModal">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for adding a new item -->
      <v-dialog v-model="isAddItemModalActive">
        <v-card>
          <v-card-title>
            <span class="headline">Add Item</span>
          </v-card-title>
          <v-card-text>
            <!-- Campos de texto para el nuevo item -->
            <v-text-field v-model="newItem.descripcion" label="Description"></v-text-field>
            <v-text-field v-model="newItem.imageUrl" label="Image URL"></v-text-field>
            <v-select
              v-model="newItem.registro"
              :items="['Botón', 'Tiempo']"
              label="Registration Type"
              @change="handleRegistrationTypeChange"
            ></v-select>
            <v-text-field
              v-model="newItem.tiempo"
              label="Time"
              v-if="newItem.registro === 'Tiempo'"
              type="number"
              step="1"
            ></v-text-field>
            <v-text-field
              v-model="newItem.escala"
              label="Rating"
              type="number"
              step="1"
              min="1"
              max="5"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addNewItem" color="#313844">Add</v-btn>
            <v-btn @click="closeAddItemModal">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for adding a new item in update -->
      <v-dialog v-model="isAddItemUpdateModalActive">
        <v-card>
          <v-card-title>
            <span class="headline">Add Item</span>
          </v-card-title>
          <v-card-text>
            <!-- Campos de texto para el nuevo item -->
            <v-text-field v-model="newItem.descripcion" label="Description"></v-text-field>
            <v-text-field v-model="newItem.imageUrl" label="Image URL"></v-text-field>
            <v-select
              v-model="newItem.registro"
              :items="['Botón', 'Tiempo']"
              label="Registration Type"
              @change="handleRegistrationTypeChange"
            ></v-select>
            <v-text-field
              v-model="newItem.tiempo"
              label="Time"
              v-if="newItem.registro === 'Tiempo'"
              type="number"
              step="1"
            ></v-text-field>
            <v-text-field
              v-model="newItem.escala"
              label="Rating"
              type="number"
              step="1"
              min="1"
              max="5"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addNewUpdateItem" color="#313844">Add</v-btn>
            <v-btn @click="closeAddUpdateItemModal">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for update a item -->
      <v-dialog v-model="isUpdateItemModalActive">
        <v-card>
          <v-card-title>
            <span class="headline">Update Item</span>
          </v-card-title>
          <v-card-text>
            <!-- Campos de texto para el nuevo item -->
            <v-text-field v-model="updateItemAct.descripcion" lab
            el="Description"></v-text-field>
            <v-text-field v-model="updateItemAct.imageUrl" label="Image URL"></v-text-field>
            <v-select
              v-model="updateItemAct.registro"
              :items="['Botón', 'Tiempo']"
              label="Registration Type"
              @change="handleRegistrationTypeChange"
            ></v-select>
            <v-text-field
              v-model="updateItemAct.tiempo"
              label="Time"
              v-if="updateItemAct.registro === 'Tiempo'"
              type="number"
              step="1"
            ></v-text-field>
            <!-- Añadimos el siguiente bloque para setear tiempo a cero cuando el registro es 'Botón' -->
            <v-text-field
              v-model="updateItemAct.tiempo"
              label="Time"
              v-else
              type="number"
              step="1"
              :value="0"
              disabled
            ></v-text-field>
            <v-text-field
              v-model="updateItemAct.escala"
              label="Rating"
              type="number"
              step="1"
              min="1"
              max="5"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="updateItemModal" color="warning">UPDATE</v-btn>
            <v-btn @click="closeUpdateItemModal">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for confirming item deletion -->
      <v-dialog v-model="isDeleteItemConfirmationActive">
          <v-card>
          <v-card-title>
              <span class="headline">Confirm Delete</span>
          </v-card-title>
          <v-card-text>
              Are you sure you want to delete this item?
          </v-card-text>
          <v-card-actions>
              <v-btn @click="deleteItemConfirmed" color="error">Delete</v-btn>
              <v-btn @click="cancelDeleteItem">Cancel</v-btn>
          </v-card-actions>
          </v-card>
      </v-dialog>

      <!-- Modal for confirming item deletion for update instrument -->
      <v-dialog v-model="isDeleteUpdateItemConfirmationActive">
        <v-card>
          <v-card-title>
            <span class="headline">Confirm Delete</span>
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete this item?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="deleteUpdateItemConfirmed" color="error">Delete</v-btn>
            <v-btn @click="cancelUpdateDeleteItem">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal for confirming instrument deletion -->
      <v-dialog v-model="isDeleteInstrumentConfirmationActive">
        <v-card>
          <v-card-title>
            <span class="headline">Confirm Delete</span>
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete this instrument?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="deleteInstrumentConfirmed" color="error">Delete</v-btn>
            <v-btn @click="cancelDeleteInstrument">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Feedback message -->
      <v-snackbar v-model="feedbackMessage" :timeout="1000" color="#313844">
        {{ feedbackMessage }}
      </v-snackbar>

    </v-container>
  </v-app>
</template>

<script setup>
  // Importaciones
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { watch } from 'vue';

  // Variables
  const API_URL = "http://localhost:5038/api/1.0/";
  const instruments = ref([]);
  const originalInstruments = ref([]);
  const isUpdateInstrumentModalActive = ref(false);
  const isDeleteInstrumentConfirmationActive = ref(false);
  const selectedInstrument = ref(null);
  const feedbackMessage = ref("");
  const isAddInstrumentModalActive = ref(false);
  const searchTerm = ref("");
  let cards = [];
  const isAddItemUpdateModalActive =  ref(false);
  const isDeleteItemConfirmationActive = ref(false);
  const isAddItemModalActive = ref(false);
  const isUpdateItemModalActive = ref(false);
  const isDeleteUpdateItemConfirmationActive = ref(false);
  const selectedCard = ref(null);
  const selectedCardId = ref(null);
  const newItem = ref({
    num: 0,
    descripcion: "",
    imageUrl: "",
    registro: "",
    tiempo: 0,
    escala: 0,
  });
  const updateItemAct = ref({
    num: 0,
    descripcion: "",
    imageUrl: "",
    registro: "",
    tiempo: 0,
    escala: 0,
  });
  let newInstrument = ref({
    nombre: "",
    acronimo: "",
    categoria: "",
    items: []
  });
  const updatedInstrument = ref({
    nombre: "",
    acronimo: "",
    categoria: "",
    items: []
  });

  /** Métodos relacionados con Agregar Instrumento **/

  const openAddItemModal = () => {
    newItem.value = {
      num: 0,
      descripcion: "",
      imageUrl: "",
      registro: "",
      tiempo: 0,
      escala: 0,
    };
    isAddItemModalActive.value = true;
  };

  const closeAddItemModal = () => {
    isAddItemModalActive.value = false;
  };

  const addNewInstrument = async () => {
    newInstrument.value.items = [...cards];

    try {
      const response = await axios.post(API_URL + "tools/", newInstrument.value);
      refreshData();
      feedbackMessage.value = response.data.message;
      newInstrument.value = {};
      closeAddInstrumentModal();
    } catch (error) {
      console.error("Error adding instrument:", error);
      if (error.response) {
        feedbackMessage.value = error.response.data.message || "Error adding instrument.";
      } else {
        feedbackMessage.value = "Error adding instrument.";
      }
    }
  };

  const openAddInstrumentModal = () => {
    cards = [];
    newInstrument = ref({
      nombre: "",
      acronimo: "",
      categoria: "",
      items: []
    });
    isAddInstrumentModalActive.value = true;
  };

  const closeAddInstrumentModal = () => {
    isAddInstrumentModalActive.value = false;
  };

  const addNewItem = () => {
    if (!newItem.value.descripcion || !newItem.value.imageUrl || !newItem.value.registro) {
      feedbackMessage.value = "Por favor, completa todos los campos obligatorios.";
      return;
    }

    if (newItem.value.registro === 'Tiempo' && newItem.value.tiempo === 0) {
      feedbackMessage.value = "Por favor, ingresa un tiempo válnumo.";
      return;
    }

    if (newItem.value.escala == 0 || newItem.value.escala > 5) {
      feedbackMessage.value = "Por favor, ingresa un rating valnumo.";
      return;
    }

    cards.push({
      num: cards.length + 1,
      descripcion: newItem.value.descripcion,
      imageUrl: newItem.value.imageUrl,
      registro: newItem.value.registro,
      tiempo: newItem.value.tiempo,
      escala: newItem.value.escala,
    });

    closeAddItemModal();

    newItem.value = {
      ...newItem.value, 
      descripcion: "",
      imageUrl: "",
      registro: "",
      tiempo: 0,
      escala: 0,
    };
  };


  /***  Métodos relacionados con Actualizar Instrumento  ***/

  // Método para abrir el modal de actualizar instrumento
  const openUpdateInstrumentModal = (instrument) => {
    refreshData();
    selectedInstrument.value = instrument;
    updatedInstrument.value = { ...instrument };
    isUpdateInstrumentModalActive.value = true;
    //console.log(updatedInstrument.value);
  };

  // Método para cerrar el modal de actualizar instrumento
  const closeUpdateInstrumentModal = () => {
    selectedInstrument.value = null;
    updatedInstrument.value = {};
    isUpdateInstrumentModalActive.value = false;
  };


  // Método para actualizar un instrumento
  const updateInstrument = async () => {
    // Verificar si el nombre o el acrónimo ya existen para otros instrumentos
    const isDuplicateName = instruments.value.some((instrument) => instrument.nombre === updatedInstrument.value.nombre && instrument.id !== selectedInstrument.value.id);
    const isDuplicateAcronym = instruments.value.some((instrument) => instrument.acronimo === updatedInstrument.value.acronimo && instrument.id !== selectedInstrument.value.id);

    if (isDuplicateName || isDuplicateAcronym) {
      feedbackMessage.value = "Name or acronym already exists for other instruments. Enter unique values.";
      return;
    }

    try {
      console.log(updatedInstrument.value);
      const response = await axios.patch(API_URL + `tools/${selectedInstrument.value.nombre}`, updatedInstrument.value);
      console.log(updatedInstrument.value);
      refreshData();
      feedbackMessage.value = response.data.message;
      closeUpdateInstrumentModal();
    } catch (error) {
      console.error("Error updating instrument:", error);
      feedbackMessage.value = "Error updating instrument.";
    }
  };


  /***  Métodos relacionados con Actualizar Ítem en el Modal de Actualizar Instrumento   ***/

  const updateItem = () => {
    isUpdateItemModalActive.value = true;
  };

  const closeUpdateItemModal = () => {
    isUpdateItemModalActive.value = false;
  };
  
  const openUpdateItemModal = (card) => {
    /** */
    updateItemAct.value = {
      num: card.num,
      descripcion: card.descripcion,
      imageUrl: card.imageUrl,
      registro: card.registro,
      tiempo: card.tiempo,
      escala: card.escala,
    };

    selectedCard.value = card;
    updateItem();
  };

  const updateItemModal = () => {
  if (!updateItemAct.value.descripcion || !updateItemAct.value.imageUrl || !updateItemAct.value.registro) {
    feedbackMessage.value = "Por favor, completa todos los campos obligatorios.";
    return;
  }

  if (updateItemAct.value.registro === 'Tiempo' && updateItemAct.value.tiempo === 0) {
    feedbackMessage.value = "Por favor, ingresa un tiempo válido.";
    return;
  }

  const updatedCard = {
    num: selectedCard.value.num,
    descripcion: updateItemAct.value.descripcion,
    imageUrl: updateItemAct.value.imageUrl,
    registro: updateItemAct.value.registro,
    tiempo: updateItemAct.value.registro === 'Tiempo' ? updateItemAct.value.tiempo : 0,
    escala: updateItemAct.value.escala,
  };

  console.log(selectedCard.value.num);

  console.log(updatedCard.escala);

  const index = cards.findIndex((card) => card.num === updatedCard.num);
  if (index !== -1) {
    cards.splice(index, 1, updatedCard);
  }

  updateCard(updatedCard);

  closeUpdateItemModal();

  updateItemAct.value = {
    descripcion: "",
    imageUrl: "",
    registro: "",
    tiempo: 0,
    escala: 0,
  };

  console.log(updatedCard.escala);

};

  const updateCard = (updatedCard) => {
    const index = updatedInstrument.value.items.findIndex((card) => card.num === updatedCard.num);
    if (index !== -1) {
      updatedInstrument.value.items.splice(index, 1, updatedCard);
    }
    console.log(updatedInstrument.value.items);
  };

/** Métodos relacionados con agregar un Ítem en el Modal de Actualizar Instrumento **/

  const openAddItemUpdateModal = () => {
    newItem.value = {
      num: 0,
      descripcion: "",
      imageUrl: "",
      registro: "",
      tiempo: 0,
      escala: 0,
    };
    isAddItemUpdateModalActive.value = true;
  };

  const closeAddUpdateItemModal = () => {
    isAddItemUpdateModalActive.value = false;
  };

  const addNewUpdateItem = () => {
    if (!newItem.value.descripcion || !newItem.value.imageUrl || !newItem.value.registro) {
      feedbackMessage.value = "Por favor, completa todos los campos obligatorios.";
      return;
    }

    if (newItem.value.registro === 'Tiempo' && newItem.value.tiempo === 0) {
      feedbackMessage.value = "Por favor, ingresa un tiempo válnumo.";
      return;
    }

    if (newItem.value.escala == 0 || newItem.value.escala > 5) {
      feedbackMessage.value = "Por favor, ingresa un rating valnumo.";
      return;
    }

    updatedInstrument.value.items.push({
      num: updatedInstrument.value.items.length + 1,
      descripcion: newItem.value.descripcion,
      imageUrl: newItem.value.imageUrl,
      registro: newItem.value.registro,
      tiempo: newItem.value.tiempo,
      escala: newItem.value.escala,
    });

    console.log(updatedInstrument.value.items);

    closeAddUpdateItemModal();

    newItem.value = {
      ...newItem.value, 
      descripcion: "",
      imageUrl: "",
      registro: "",
      tiempo: 0,
      escala: 0,
    };
  };

  /***  Métodos relacionados con Eliminar Instrumento   ***/

  const cancelDeleteInstrument = () => {
    selectedInstrument.value = null;
    isDeleteInstrumentConfirmationActive.value = false;
  };


  const deleteInstrumentConfirmation = (nombre) => {
    selectedInstrument.value = nombre;
    isDeleteInstrumentConfirmationActive.value = true;
  };

  const deleteInstrumentConfirmed = async () => {
    if (selectedInstrument.value !== null) {
      try {
        const response = await axios.delete(API_URL + `tools/${selectedInstrument.value}`);
        refreshData();
        feedbackMessage.value = response.data.message;
      } catch (error) {
        console.error("Error deleting instrument:", error);
        feedbackMessage.value = "Error deleting instrument.";
      } finally {
        selectedInstrument.value = null;
        isDeleteInstrumentConfirmationActive.value = false;
      }
    }
  };


  /***  Métodos relacionados con Eliminar Ítem en update instrument   ***/

  const cancelUpdateDeleteItem = () => {
    selectedCardId.value = null;
    isDeleteUpdateItemConfirmationActive.value = false;
  };

  const eliminarUpdateCard = (index) => {
    selectedCardId.value = index;
    isDeleteUpdateItemConfirmationActive.value = true;
  };

  const deleteUpdateItemConfirmed = () => {
    if (selectedCardId.value !== null) {
      updatedInstrument.value.items.splice(selectedCardId.value, 1);

      updatedInstrument.value.items.forEach((card, index) => {
        card.num = index + 1;
      });

      selectedCardId.value = null;

      isDeleteUpdateItemConfirmationActive.value = false;
    }
  };
  

  /***  Métodos relacionados con Eliminar Ítem   ***/

  const eliminarCard = (index) => {
      selectedCardId.value = index;
      isDeleteItemConfirmationActive.value = true;
  };

  const deleteItemConfirmed = () => {
      if (selectedCardId.value !== null) {
      // Eliminar la card seleccionada
      cards.splice(selectedCardId.value, 1);

      // Actualizar los IDs después de la eliminación
      cards.forEach((card, index) => {
          card.id = index + 1; // Puedes ajustar la lógica del ID según tus necesidades
      });

      // Limpiar la variable selectedCardId
      selectedCardId.value = null;

      // Cerrar el modal de confirmación
      isDeleteItemConfirmationActive.value = false;
      }
  };

  const cancelDeleteItem = () => {
    selectedCardId.value = null;
    isDeleteItemConfirmationActive.value = false;
  };
  
  /***  Métodos de Utilidad   ***/

  const refreshData = async () => {
    try {
      const response = await axios.get(API_URL + "tools/");
      instruments.value = response.data.data;
      originalInstruments.value = [...instruments.value];
      console.log(instruments.value);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  const filterInstruments = () => {
    if (!searchTerm.value) {
      instruments.value = [...originalInstruments.value];
    } else {
      instruments.value = originalInstruments.value.filter((instrument) => {
        return (
          instrument.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          instrument.acronimo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          instrument.categoria.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      });
    }
  };

  onMounted(async () => {
    await refreshData();
    originalInstruments.value = [...instruments.value];
  });

  watch(searchTerm, filterInstruments);

</script>

<style>
  /********** ESTILOS PARA EL TITULO ***********/
  td button:hover {
    color: #313844; /* Color del texto de los botones al pasar el mouse */
  }

  .page-title {
    font-size: 24px; /* Tamaño de fuente */
    color: #333; /* Color del texto */
    margin-bottom: 20px; /* Espaciado inferior */
    text-align: center; /* Alineación al centro */
  }

  .container-highlight {
    box-shadow: 0px 0px 10px #313844; /* Sombra suave alrededor del contenedor */
    transition: box-shadow 0.3s ease; /* Transición suave para la sombra */
  }

  /* Estilo al pasar el mouse sobre los contenedores */
  .container-highlight:hover {
    box-shadow: 0px 0px 15px #313844; /* Aumenta la intensidad de la sombra al pasar el mouse */
  }

  /********** ESTILOS PARA LOS MODALES ***********/
  .v-dialog {
    max-width: 1000px; /* Ajusta según sea necesario */
    width: 100%;
    margin: 0 auto;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  .modal {
    max-width: 1000px; /* Ajusta según tus necesidades */
    width: 100%;
    height: auto; /* Ajusta según tus necesidades */ 
  }

  .v-card-title {
    background-color: #313844; /* Color de fondo del encabezado */
    color: #fff; /* Color del texto del encabezado */
    padding: 16px;
    border-top-left-radius: 0px; /* Esquina superior izquierda redondeada */
    border-top-right-radius: 0px; /* Esquina superior derecha redondeada */
  }

  .v-card-text {
    padding: 16px;
  }

  /* Estilo para los botones en los modales */
  .v-btn {
    margin-right: 10px;
  }

  /* Estilo para los botones "Add" y "Update" */
  .v-btn.primary {
    background-color: #313844; /* Color de fondo del botón */
    color: #fff; /* Color del texto del botón */
    border: none;
    border-radius: 4px; /* Esquinas redondeadas del botón */
    padding: 10px 20px;
    cursor: pointer;
  }

  .v-btn.primary:hover {
    background-color: #313844; /* Color de fondo del botón al pasar el mouse */
  }

  /* Estilo para el botón "Cancel" */
  .v-btn.secondary {
    background-color: #ccc; /* Color de fondo del botón */
    color: #333; /* Color del texto del botón */
    border: none;
    border-radius: 4px; /* Esquinas redondeadas del botón */
    padding: 10px 20px;
    cursor: pointer;
  }

  .v-btn.secondary:hover {
    background-color: #999; /* Color de fondo del botón al pasar el mouse */
  }

  /* Estilo para los diálogos de confirmación */
  .v-dialog.confirmation {
    max-width: 300px;
  }

  /********** ESTILOS PARA LA TABLA ***********/
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-family: Arial, sans-serif; /* Cambia la fuente de texto si lo deseas */
  }

  /* Estilo para las celdas del encabezado de la tabla */
  th {
    background-color: #313844; /* Color de fondo del encabezado */
    color: #fff; /* Color del texto del encabezado */
    padding: 10px;
    text-align: left;
  }

  /* Estilo para las celdas de datos de la tabla */
  td {
    padding: 10px;
    border: 1px solid #ccc;
  }

  /* Estilo para las filas impares */
  tr:nth-child(odd) {
    background-color: #f2f2f2; /* Color de fondo para filas impares */
  }

  /* Estilo para resaltar las celdas de acción */
  td button {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #313844; /* Color del texto de los botones */
    margin-right: 10px;
    font-weight: bold;
    transition: color 0.3s ease; /* Efecto de transición al pasar el mouse */
  }

  /* Estilo para centrar los encabezados */
  .centered-header {
    text-align: center;
  }

  /* Estilo para dimensionar automáticamente la última columna */
  .centered-buttons { 
    text-align: center;
    white-space: nowrap; /* Evita que el contenido se divida en varias líneas */
  }

  /* Estilo para las columnas de las cards */
  .card-column {
    flex: 0 0 calc(33.33% - 1rem); /* Ancho de 33.33% para cada columna, menos el espacio entre ellas */
    max-width: calc(33.33% - 1rem);
  }

  /* Estilo para el contenedor de las cards */
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around; /* Ajusta según tus necesidades */
    gap: 1rem; /* Espacio entre las cards */
    padding: 1rem; /* Espaciado interior para separar las cards del borde */
    background-color: #f8f8f8; /* Color de fondo */
    border: 1px solid #e0e0e0; /* Borde del contenedor */
    border-radius: 8px; /* Esquinas redondeadas del contenedor */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra */

    /* Establecer un tamaño mínimo para el contenedor */
    min-width: 100%; /* Esto asegura que el contenedor sea al menos del 100% del ancho del padre */
  }

  /* Estilo para las columnas de las cards */
  .card-column {
    flex: 0 0 calc(25% - 1rem); /* Ancho de 25% para cada columna, menos el espacio entre ellas */
    max-width: calc(25% - 1rem);
  }

  /* Estilo para la sección de la imagen de la Card */
  .card-image {
    overflow: hidden;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }

  .card-img-top {
    max-width: 100%;
    height: auto;
  }

  /* Estilo para la sección de la información de la Card */
  .card-info {
    padding: 1rem;
    color: #ffff;
    background-color: #313844;
  }

  /* Estilo para las cards */
  /* Animación de entrada y salida para las cards */
  .card-fade-enter-active, .card-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
  }

  .card-fade-enter, .card-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  /* Estilo para las cards */
  .card {
    width: 100%;
    border: 5px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    background-color: #313844;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
  }

  .card img {
    max-width: 100%;
    height: auto;
  }

  /* Estilos para el formulario */
  .form {
    max-width: 500px;
    margin: auto;
    border-radius: 8px;
  }

  /* Estilos para las etiquetas de los campos */
  .form-label {
    font-weight: bold;
    margin-bottom: 6px;
    display: block;
  }

  /* Estilos para los campos de entrada */
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 16px;
  }

</style>