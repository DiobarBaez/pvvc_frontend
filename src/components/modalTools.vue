x<template>

    <v-app>
  
      <v-main>
  
        <v-container flex>
  
          <v-row class="container-highlight mb-3">
            <v-col cols="12">
              <h2 class="page-title">Tools Management</h2>
            </v-col>
          </v-row>
  
          <v-row class="container-highlight mb-3">
            <form @submit.prevent="submitForm" class="form">
              <div class="form-group">
                <label for="type" class="form-label">Parte del cuerpo:</label>
                <input
                  type="text"
                  id="type"
                  v-model="formData.partbody"
                  required
                  class="form-input"
                />
              </div>
  
              <div class="form-group">
                <label for="name" class="form-label">Nombre del instrumento:</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="form-input"
                />
              </div>
  
              <div class="form-group">
                <label for="acronimo" class="form-label">Acrónimo:</label>
                <input
                  type="text"
                  id="acronimo"
                  v-model="formData.acronimo"
                  required
                  class="form-input"
                />
              </div>
            </form>
          </v-row>
  
  
          <!-- Botón "Add User" alineado a la derecha -->
          <v-row class="text-right" >
            <v-col cols="12">
              <v-btn type="submit" @click="openAddUserModal" color="primary">ADD ITEM</v-btn>
            </v-col>
          </v-row>
  
  
          <v-row class="container-highlight mb-3">
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
                        <h4 class="card-title">Item {{ card.id }}</h4>
                        <p class="card-text">Descripcion: {{ card.descripcion }}</p>
                        <p class="card-text">Forma de registro: {{ card.registro}}</p>
                        <p class="card-text">tiempo: {{ card.tiempo}}</p>
                        <p class="card-text">valoracion: {{ card.escala}}</p>
  
                        <!-- Botones de editar y eliminar -->
                        <div class="card-actions">
                          <v-btn  @click="editarCard(index)" class="mt-4"  color="warning">UPDATE</v-btn>
                          <v-btn  @click="eliminarCard(index)" class="mt-4"  color="error">DELETE</v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </v-row>
  
          <!-- Botón "Add User" alineado a la derecha -->
          <v-row class="text-right" >
              <v-col cols="12">
                <v-btn @click="guardarDatos" color="primary" class="mt-4">SAVE</v-btn>
              </v-col>
          </v-row>
          
        </v-container>
  
      </v-main>
  
    </v-app>
  
  </template>
  
  <script setup>
  
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
  
    const router = useRouter();
    const drawer = ref(false); // Variable para controlar la visibilidad del panel de herramientas
    const logout = () => {
      router.push({ name: 'Login' });
    };
    const toggleDrawer = () => {
      drawer.value = !drawer.value; // Cambiar el estado de visibilidad del panel de herramientas
    };
    // Datos de ejemplo para las cards
    const cards = [
      {
        id: 1,
        descripcion: 'Card 1',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id: 2,
        descripcion: 'Card 2',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id: 3,
        descripcion: 'Card 3',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:4,
        descripcion: 'Card 4',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:5,
        descripcion: 'Card 5',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:5,
        descripcion: 'Card 5',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:5,
        descripcion: 'Card 5',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:5,
        descripcion: 'Card 5',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      {
        id:5,
        descripcion: 'Card 5',
        imageUrl: 'https://th.bing.com/th/id/R.70659ea0f4fdba2e09598ae4f4349a41?rik=Sj2GGGrViYn99g&riu=http%3a%2f%2f3.bp.blogspot.com%2f-AsLdW2Mcjig%2fUtL71YiY2zI%2fAAAAAAAAY5g%2fo2zmYBKKWqY%2fs1600%2f360681.jpg&ehk=SxPqRVy8AI4%2burvA%2frZIog6jAXfklQdDsJBpKqkWGuA%3d&risl=&pid=ImgRaw&r=0',
        registro: 'boton',
        tiempo:0,
        escala:5
      },
      // Agrega más cards según tus necesidades
    ];
    const formData = {
      partbody: '',
      name: '',
      acronimo: ''
    };
    const submitForm = () => {
      console.log('Datos del formulario:', formData);
    };
  
  </script>
  
  <style scoped>
    /* Estilos CSS específicos para este componente */
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      font-weight: bold;
    }
    input[type="text"],
    input[type="email"],
    input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
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
      justify-content: space-between;
      gap: 1rem; /* Espacio entre las cards */
      padding: 1rem; /* Espaciado interior para separar las cards del borde */
      background-color: #f8f8f8; /* Color de fondo */
      border: 1px solid #e0e0e0; /* Borde del contenedor */
      border-radius: 8px; /* Esquinas redondeadas del contenedor */
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra */
    }
  
    /* Estilo para las columnas de las cards */
    .card-column {
      flex: 0 0 calc(25% - 1rem); /* Ancho de 33.33% para cada columna, menos el espacio entre ellas */
      max-width: calc(25% - 1rem);
    }
  
  
    /* Estilo para la sección de la imagen de la Card */
    .card-image {
      overflow: hidden;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  
    .card-img-top {
      max-width: 100%;
      height: auto;
    }
  
    /* Estilo para la sección de la información de la Card */
    .card-info {
      padding: 1rem;
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
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fff;
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
      margin: 0 auto;
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
      width: 00%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 15px;
      font-size: 16px;
    }
  
  
  </style>
  