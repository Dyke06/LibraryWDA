<template>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      :footer-props="{
        'items-per-page-text':'Linhas por páginas'
      }"
      :header-props="headerProps"
      class="table-style elevation-10 ml-3 mt-3"
      :mobile-breakpoint="900"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title class="display-1 black--text">Editora</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
          
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class=""
                v-bind="attrs"
                v-on="on"
                @click="openDialog"
              >
                Adicionar Editora
                <v-icon right>mdi-plus-thick</v-icon>
              </v-btn>
            </template>
            
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title> 
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" >
                      <v-text-field v-model="produto.name"
                        :error-messages="nameErrors"
                        :counter="35"
                        label="Nome"
                        required
                        @input="$v.produto.name.$touch()"
                        @blur="$v.produto.name.$touch()"></v-text-field>
                    </v-col>
                    <v-col cols="12" >
                      <v-text-field v-model="produto.city"
                        :error-messages="cidaderrors"
                        :counter="35"
                        label="Cidade"
                        required
                        @input="$v.produto.city.$touch()"
                        @blur="$v.produto.city.$touch()"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="close">Cancelar</v-btn>
                <v-btn color="blue" text @click="salvar">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <template>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Pesquisa"
                  single-line
                  hide-details
                  outlined  
                  class="pesquisa ml-2 mt-2 mr-2"
              ></v-text-field>
          </template>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          class="blue--text mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          medium
          class="red--text"
          @click="deleteUser(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click=""
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
</template>

<script>
import Produto from '../Services/company'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {

  mixins: [validationMixin],

    validations: {
      produto: {
        name: { required, maxLength: maxLength(35) },
        city: { required, maxLength: maxLength(35) },
      }
    },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    produto: {
      id: '',
      name: '',
      city: '',

    },
    search: '',
    headerProps: {
        sortByText: "Ordenar por"
      },
    headers: [
      { text: 'Id', 
        align: 'center',
        value: 'id', },
      {
        text: 'Nome',
        align: 'center',
        value: 'name',
      },
      { text: 'Cidade', value: 'city', align: 'center' },
      { text: 'Ações', value: 'actions', align: 'center', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    defaultItem: {
      id: '',
      name: '',
      city: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Adicionar Editora' : 'Editar Editora';
    },
    formIcon() {
      return this.editedIndex === -1 ? 'mdi-plus-thick' : 'mdi-pencil';
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.produto.name.$dirty) return errors;
      !this.$v.produto.name.maxLength && errors.push('O nome deve ter no máximo 35 caracteres');
      !this.$v.produto.name.required && errors.push('O nome é obrigatório');
      return errors;
    },

    cidaderrors() {
      const errors = [];
      if (!this.$v.produto.city.$dirty) return errors;
      !this.$v.produto.city.maxLength && errors.push('A cidade deve ter no máximo 35 caracteres');
      !this.$v.produto.city.required && errors.push('A cidade é obrigatório');
      return errors;
    },

  },

  watch: {
    dialog(val) {
      if (!val) {
        this.close();
      }
    },
    dialogDelete(val) {
      if (!val) {
        this.closeDelete();
      }
    },
  },

  mounted() {
    this.listar()
  },

  methods: {

    listar(){
      Produto.listar().then(resposta => {
      this.desserts = resposta.data
    })
    },

    openDialog() {
      this.$v.produto.name.$reset();
      if (this.editedIndex === -1) {
        this.produto = {
          id: '',
          name: '',
          city: '',
        };
      } else {
        
        this.produto = Object.assign({}, this.desserts[this.editedIndex]);
      }

      this.dialog = true;
    },


    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.openDialog();
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.editedIndex = -1;
      this.$v.$reset()
      this.nome = ''
      this.cidade = ''
    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      salvar() {
        if (!this.produto.id) {
          if (!this.$v.produto.name.maxLength || !this.$v.produto.city.maxLength) {
            swal('Erro', 'Os campos devem ter no máximo 35 caracteres', 'error');
          } else {
            if (this.produto.name && this.produto.city) {
              Produto.salvar(this.produto)
                .then((resposta) => {
                  console.log(resposta.data);
                  if (this.editedIndex === -1) {
                    this.desserts.push(this.produto);
                  } else {
                    this.desserts.splice(this.editedIndex, 1, this.produto);
                  }
                  this.close();
                  swal('Sucesso', 'Editora salva com sucesso!', 'success');
                })
                .catch((erro) => {
                  this.$v.produto.$touch();
                  console.error('Erro ao salvar a editora:', erro);
                  swal('Erro', erro.response.data.message, 'error');
                });
            } else {
              this.$v.produto.$touch();
            }
          }
        } else {
          Produto.atualizar(this.produto.id, this.produto)
            .then((resposta) => {
              console.log(resposta.data);
              if (this.editedIndex === -1) {
                this.desserts.push(this.produto);
              } else {
                this.desserts.splice(this.editedIndex, 1, this.produto);
              }
              this.close();
              swal('Sucesso', 'Editora atualizada com sucesso!', 'success');
            })
            .catch((erro) => {
              console.error('Erro ao atualizar a editora:', erro);
              swal('Erro', erro.response.data.message, 'error');
            });
        }
      },


    deleteUser(produto) {
      swal({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser revertida!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        className: 'swal-text-arial',
      }).then((result) => {
        if (result) {
          Produto.apagar(produto.id)
            .then(() => {
              swal({
                title: 'Excluída!',
                text: 'A editora foi excluída com sucesso.',
                icon: 'success',
                buttons: false,
                timer: 4000,
                customClass: 'swal-text-arial',
              });
              this.listar();
            })
            .catch((erro) => {
              swal({
                title: 'Erro',
                text: erro.response.data.message || 'Erro ao excluir a editora.',
                icon: 'error',
                buttons: false,
                timer: 4000,
                customClass: 'swal-text-arial',
              });
              console.error('Erro ao excluir a editora:', erro);
            });
        } else {
          swal({
            title: 'Cancelado',
            text: 'A exclusão do editora foi cancelada.',
            icon: 'info',
            customClass: 'swal-text-arial',
          });
        }
      });
    }
  },
};
</script>

<style>
.v-data-table-header{
  background-color: rgb(44, 147, 206);
}

.title-style {
  font-size: 32px; 
  color: Black; 
  font-weight: 400 ;
}

.table-style{
  border-radius: 20px;
  padding: 5px;
  width: 98%;
}

.table-style th {
  font-size: 18px !important; 
  color: #ffffff !important; 
  font-family: 'Arial', sans-serif; 
}

.table-style td {
  font-size: 16px !important; 
  position: relative;
  right:5px;
  color: black; 
  font-family: 'arial', sans-serif; 
}

.v-text-field{
  padding: 0px !important;
  position: relative;
  bottom: 10px;
}


</style>