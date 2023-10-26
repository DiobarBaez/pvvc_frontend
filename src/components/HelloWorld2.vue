<template>
    <v-app>
      <v-container class="container-highlight">
      
        <v-row class="container-highlight mb-3">
          <v-col cols="12">
            <h2 class="page-title">User Management</h2>
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
                  <th class="centered-header">Role</th>
                  <th class="centered-header">Email</th>
                  <th class="centered-header">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.name">
                  <td>{{ user.name }}</td>
                  <td>{{ user.rol }}</td>
                  <td>{{ user.email }}</td>
                  <td class="centered-buttons">
                    <v-btn @click="openUpdateUserModal(user)" color="warning">Update</v-btn>
                    <v-btn @click="deleteUserConfirmation(user.name)" color="error">Delete</v-btn>
  
                  </td>
                </tr>
              </tbody>
            </table>
          </v-col>
  
        </v-row>
  
  
        <!-- Botón "Add User" alineado a la derecha -->
        <v-row class="text-right">
          <v-col cols="12">
            <v-btn @click="openAddUserModal" color="primary">Add User</v-btn>
          </v-col>
        </v-row>
  
        <!-- Modal for adding a new user -->
        <v-dialog v-model="isAddUserModalActive">
          <v-card>
            <v-card-title>
              <span class="headline">Add User</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newUser.name" label="Name"></v-text-field>
              <v-text-field v-model="newUser.rol" label="Role"></v-text-field>
              <v-text-field v-model="newUser.email" label="Email"></v-text-field>
              <v-text-field v-model="newUser.password" label="Password"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="addNewUser" color="primary">Add</v-btn>
              <v-btn @click="closeAddUserModal">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Modal for adding a new user -->
        <v-dialog v-model="isAddUserModalActive">
          <v-card>
            <v-card-title>
              <span class="headline">Add User</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newUser.name" label="Name"></v-text-field>
              <v-select
                v-model="newUser.rol"
                :items="roleOptions"
                label="Role"
              ></v-select>
              <v-text-field v-model="newUser.email" label="Email"></v-text-field>
              <v-text-field v-model="newUser.password" label="Password"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="addNewUser" color="primary">Add</v-btn>
              <v-btn @click="closeAddUserModal">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
  
        <!-- Modal for updating a user -->
        <v-dialog v-model="isUpdateUserModalActive" >
          <v-card>
            <v-card-title>
              <span class="headline">Update User</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="updatedUser.name" label="Name"></v-text-field>
              <v-select
                v-model="updatedUser.rol"
                :items="roleOptions"
                label="Role"
              ></v-select>
              <v-text-field v-model="updatedUser.email" label="Email" disabled></v-text-field>
              <v-text-field v-model="updatedUser.password" label="Password"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="updateUser" color="primary">Update</v-btn>
              <v-btn @click="closeUpdateUserModal">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
  
  
        <!-- Modal for confirming user deletion -->
        <v-dialog v-model="isDeleteUserConfirmationActive">
          <v-card>
            <v-card-title>
              <span class="headline">Confirm Delete</span>
            </v-card-title>
            <v-card-text>
              Are you sure you want to delete this user?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="deleteUserConfirmed" color="error">Delete</v-btn>
              <v-btn @click="cancelDeleteUser">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <!-- Feedback message -->
        <v-snackbar v-model="feedbackMessage" :timeout="1000" color="primary">
          {{ feedbackMessage }}
        </v-snackbar>
  
      </v-container>
  
    </v-app>
  
  </template>
  
  <script setup>
  
  
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { watch } from 'vue';
  
  
    
    const API_URL = "http://localhost:5038/api/1.0/";
    const newUser = ref({
      name: "",
      rol: "",
      email: "",
      password: "",
    });
    const updatedUser = ref({
      name: "",
      rol: "",
      email: "",
      password: "",
    });
    const users = ref([]);
    const isUpdateUserModalActive = ref(false);
    const isDeleteUserConfirmationActive = ref(false);
    const selectedUser = ref(null);
    const feedbackMessage = ref("");
    const isAddUserModalActive = ref(false);
    const roleOptions = [
      "Administrador",
      "Medico",
      "Paciente",
      // Agrega más roles según tus necesidades
    ];
    const searchTerm = ref("");
    const originalUsers = ref([]); // Mantén una copia original de los usuarios
  
  
    const refreshData = async () => {
  try {
    const response = await axios.get(API_URL + "users/");
    users.value = response.data.data;


    // Check if users.value is an array before spreading its values
    if (Array.isArray(users.value)) {
      originalUsers.value = [...users.value];
    } else {
      console.error("Error: users.value is not an array");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

  
    
  
    const addNewUser = async () => {
      // Verificar si el name y email ya existen
      const isDuplicateName = users.value.some((user) => user.name === newUser.value.name);
      const isDuplicateEmail = users.value.some((user) => user.email === newUser.value.email);
  
      if (isDuplicateName || isDuplicateEmail) {
        feedbackMessage.value = "El name o email ya existen. Introduce valores únicos.";
        return; // No permite agregar usuarios duplicados
      }
  
      try {
        const response = await axios.post(API_URL + "users/", newUser.value);
        refreshData();
        feedbackMessage.value = response.data.message;
        newUser.value = {};
        closeAddUserModal();
      } catch (error) {
        console.error("Error adding user:", error);
        feedbackMessage.value = "Error adding user.";
      }
    };
  
  
    const deleteUserConfirmation = (name) => {
      selectedUser.value = name;
      isDeleteUserConfirmationActive.value = true;
    };
  
    const deleteUserConfirmed = async () => {
      if (selectedUser.value !== null) {
        try {
          const response = await axios.delete(API_URL + `users/${selectedUser.value}`);
          refreshData();
          feedbackMessage.value = response.data.message;
        } catch (error) {
          console.error("Error deleting user:", error);
          feedbackMessage.value = "Error deleting user.";
        } finally {
          selectedUser.value = null;
          isDeleteUserConfirmationActive.value = false;
        }
      }
    };
  
    const cancelDeleteUser = () => {
      selectedUser.value = null;
      isDeleteUserConfirmationActive.value = false;
    };
  
    const openUpdateUserModal = (user) => {
      selectedUser.value = user;
      updatedUser.value = { ...user };
      isUpdateUserModalActive.value = true;
    };
  
    const closeUpdateUserModal = () => {
      selectedUser.value = null;
      updatedUser.value = {};
      isUpdateUserModalActive.value = false;
    };
  
    const updateUser = async () => {
      // Verificar si el name o el email ya existen para otros usuarios
      const isDuplicateName = users.value.some((user) => user.name === updatedUser.value.name && user.id !== selectedUser.value.id);
      const isDuplicateEmail = users.value.some((user) => user.email === updatedUser.value.email && user.id !== selectedUser.value.id);
  
      if (isDuplicateName || isDuplicateEmail) {
        feedbackMessage.value = "El name o email ya existen para otros usuarios. Introduce valores únicos.";
        return; // No permite actualizar usuarios con datos duplicados
      }
  
      try {
        console.log(selectedUser.value.name);
        console.log("sdasds");
        console.log(updatedUser.value);
        const response = await axios.patch(API_URL + `users/${selectedUser.value.name}`, updatedUser.value);
        refreshData();
        feedbackMessage.value = response.data.message;
        closeUpdateUserModal();
      } catch (error) {
        console.error("Error updating user:", error);
        feedbackMessage.value = "Error updating user.";
      }
    };
  
  
    const openAddUserModal = () => {
      isAddUserModalActive.value = true;
    };
  
    const closeAddUserModal = () => {
      isAddUserModalActive.value = false;
    };
  
  
    const filterUsers = () => {
      if (!searchTerm.value) {
        // Si el término de búsqueda está vacío, muestra todos los usuarios
        users.value = [...originalUsers.value];
      } else {
        // Filtra los usuarios basados en el término de búsqueda
        users.value = originalUsers.value.filter((user) => {
          return (
            user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            user.rol.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
          );
        });
      }
    };
  
    onMounted(async () => {
      await refreshData();
      // Copia la lista original de usuarios cuando obtienes los datos
      originalUsers.value = [...users.value];
    });
  
    watch(searchTerm, filterUsers);
      
  
  </script>
  
  <style>
  
      /********** ESTILOS PARA EL TITULO ***********/
  
      td button:hover {
        color: #0056b3; /* Color del texto de los botones al pasar el mouse */
      }
  
      .page-title {
        font-size: 24px; /* Tamaño de fuente */
        color: #333; /* Color del texto */
        margin-bottom: 20px; /* Espaciado inferior */
        text-align: center; /* Alineación al centro */
      }
  
          .container-highlight {
        box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.5); /* Sombra suave alrededor del contenedor */
        transition: box-shadow 0.3s ease; /* Transición suave para la sombra */
      }
  
      /* Estilo al pasar el mouse sobre los contenedores */
      .container-highlight:hover {
        box-shadow: 0px 0px 15px rgba(0, 123, 255, 0.8); /* Aumenta la intensidad de la sombra al pasar el mouse */
      }
  
  
      /********** ESTILOS PARA LOS MODALES ***********/
  
      .v-dialog {
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra suave */
        border-radius: 8px; /* Esquinas redondeadas */
      }
  
      .v-card-title {
        background-color: #007bff; /* Color de fondo del encabezado */
        color: #fff; /* Color del texto del encabezado */
        padding: 16px;
        border-top-left-radius: 8px; /* Esquina superior izquierda redondeada */
        border-top-right-radius: 8px; /* Esquina superior derecha redondeada */
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
        background-color: #007bff; /* Color de fondo del botón */
        color: #fff; /* Color del texto del botón */
        border: none;
        border-radius: 4px; /* Esquinas redondeadas del botón */
        padding: 10px 20px;
        cursor: pointer;
      }
  
      .v-btn.primary:hover {
        background-color: #0056b3; /* Color de fondo del botón al pasar el mouse */
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
        background-color: #007bff; /* Color de fondo del encabezado */
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
        color: #007bff; /* Color del texto de los botones */
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
  
  </style>
  
  
  <!-- 
  
    .container-highlight {
      background-color: #f8f8f8; /* Color de fondo del contenedor */
      border-radius: 8px; /* Bordes redondeados */
      box-shadow: 0px 0px 20px rgba(0, 123, 255, 0.2); /* Sombra suave */
      transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transición suave para la transformación y la sombra */
      transform: scale(1); /* Escala inicial */
    }
  
    /* Estilo al pasar el mouse sobre los contenedores */
    .container-highlight:hover {
      box-shadow: 0px 0px 30px rgba(0, 123, 255, 0.4); /* Aumenta la intensidad de la sombra */
      transform: scale(1.02); /* Aumenta ligeramente el tamaño */
    }
  
    /* Estilo para el título del contenedor */
    .container-title {
      background-color: #007bff; /* Color de fondo del título */
      color: #fff; /* Color del texto del título */
      padding: 10px 20px; /* Espaciado interno */
      border-top-left-radius: 8px; /* Borde superior izquierdo redondeado */
      border-top-right-radius: 8px; /* Borde superior derecho redondeado */
      font-size: 20px; /* Tamaño de fuente del título */
    }
  -->