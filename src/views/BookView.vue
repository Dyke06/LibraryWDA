
<template>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      sort-by="calories"
      :footer-props="{
        'items-per-page-text':'Linhas por páginas'
      }"
      :header-props="headerProps"
      class="table-style elevation-10 ml-3 mt-3"
      :mobile-breakpoint="1005"  
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title class="display-1 black--text">Livros</v-toolbar-title>
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
                Adicionar Livro
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
                      <v-text-field v-model="books.name"
                        :error-messages="bookErrors"
                        :counter = "25"
                        label="Nome"
                        required
                        @input="$v.books.name.$touch()"
                        @blur="$v.books.name.$touch()"   
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" >
                      <v-autocomplete v-model="books.publisherId"
                      :items="editorasOptions"   
                      :error-messages="editoraErrors"              
                      label="Editora"
                      required
                      @input="$v.books.publisherId.$touch()"
                      @blur="$v.books.publisherId.$touch()"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" >
                      <v-text-field v-model="books.author"
                      :error-messages="autorErrors"
                      :counter = "25"
                      label="Autor"
                      required
                      @input="$v.books.author.$touch()"
                      @blur="$v.books.author.$touch()"
                    ></v-text-field>
                    </v-col>
                    <v-col cols="12" >
                      <v-text-field v-model="books.launch"
                        :error-messages="lancamentoErrors" 
                        :counter = "4"  
                        type="number"
                        label="Lançamento"
                        required
                        @input="$v.books.launch.$touch()"
                        @blur="$v.books.launch.$touch()"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" >
                      <v-text-field v-model="books.amount"
                        :error-messages="quantidadeErrors" 
                        :counter = "6"  
                        label="Quantidade"
                        type="number"
                        required
                        @input="$v.books.amount.$touch()"
                        @blur="$v.books.amount.$touch()"
                        ></v-text-field>
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
          
        </v-toolbar>
        <template>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Pesquisa"
                  single-line
                  hide-details
                  outlined
                  class="pesquisa ml-2 mr-2 mt-2"
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
import Editora from '../Services/company'
import Produto from '../Services/book'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { validationMixin } from 'vuelidate'
import { required, maxLength} from 'vuelidate/lib/validators'
import { NavigationFailureType } from 'vue-router';
import book from '../Services/book';

export default {

  mixins: [validationMixin],

    validations: {
      books: {
        name: { required, maxLength: maxLength(25) }, 
        publisherId: { required }, 
        author: { required, maxLength: maxLength(25) }, 
        launch: { required, maxLength: maxLength(4) }, 
        amount: { required, maxLength: maxLength(6) }, 
      }
    },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editoras:[],
    books: {
      id: '',
      name: '',
      publisherId: null,
      author: '',
      launch: 0, 
      amount: 0, 
      totalRent: null, 
    },
    search: '',
    headerProps: {
        sortByText: "Ordenar por"
      },
    headers: [
      { text: 'Id', value: 'id', align: 'center'},
      {
        text: 'Nome',
        align: 'start',
        value: 'name',
        align:'center'
      },
      { text: 'Editora', value: 'publisher.name', align:'center' },
      { text: 'Autor', value: 'author', align:'center' },
      { text: 'Lançamento', value: 'launch', align:'center' }, 
      { text: 'Quantidade', value: 'amount', align:'center' }, 
      { text: 'Total alugados', value: 'totalRent', align:'center' }, 
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,

  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Adicionar Livro' : 'Editar Livro';
    },
    formIcon() {
      return this.editedIndex === -1 ? 'mdi-plus-thick' : 'mdi-pencil';
    },

    editorasOptions() {
    return this.editoras.map(publisher => ({
      text: publisher.name,
      value: publisher.id
      }));
    },

    bookErrors() {
      const errors = [];
      if (!this.$v.books.name.$dirty) return errors;
      !this.$v.books.name.maxLength && errors.push('O nome deve ter no máximo 25 caracteres');
      !this.$v.books.name.required && errors.push('O nome é obrigatório');
      return errors;
    },

    autorErrors() {
      const errors = [];
      if (!this.$v.books.author.$dirty) return errors;
      !this.$v.books.author.maxLength && errors.push('O autor deve ter no máximo 25 caracteres');
      !this.$v.books.author.required && errors.push('O autor é obrigatório');
      return errors;
    },

    lancamentoErrors() {
      const errors = [];
      if (!this.$v.books.launch.$dirty) return errors;
      !this.$v.books.launch.maxLength && errors.push('O lançamento deve ter no máximo 4 algarismo');
      !this.$v.books.launch.required && errors.push('O lançamento é obrigatório');
      return errors;
    },

    quantidadeErrors() {
      const errors = [];
      if (!this.$v.books.amount.$dirty) return errors;
      !this.$v.books.amount.maxLength && errors.push('A quantidade deve ter no máximo 6 algarismo');
      !this.$v.books.amount.required && errors.push('A quantidade é obrigatório');
      return errors;
    },

    editoraErrors () {
        const errors = []
        if (!this.$v.books.publisherId.$dirty) return errors
        !this.$v.books.publisherId.required && errors.push('Editora é obrigatória')
        return errors
      },

  },

  watch: {
    dialog(val) {
      if (!val) {
        this.close();
      }
    },
  },

  mounted() {
    this.listar()
    this.listarEditora()
  },

  methods: {

    listar(){
      Produto.listar().then(resposta => {
      this.desserts = resposta.data
    })
    },

    listarEditora(){
      Editora.listar().then(resposta => {
      this.editoras = resposta.data
    })
    },

    openDialog() {
      this.$v.books.name.$reset();
      if (this.editedIndex === -1) {
        this.books = {
          id: '',
          name: '',
          publisherId: '',
          author: '',
          launch: '',
          amount: '', 
        };
      } else {
        
        this.books = Object.assign({}, this.desserts[this.editedIndex]);
      }

      this.dialog = true;
    },


    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.openDialog();

      this.books.publisherId = item.publisher.id;
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
        this.name = '' 
        this.publisherId = ''
        this.author = '' 
        this.launch = '' 
        this.amount = '' 


    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      salvar() {
        console.log(this.books);
        if (!this.books.id) {
          if (!this.$v.books.name.maxLength || !this.$v.books.author.maxLength || !this.$v.books.amount.maxLength) {
            swal('Erro', 'Verifique se todos os campos estão com os caracteres requisitados!', 'error');
          } else {
            if (
              this.books.name &&
              this.books.publisherId &&
              this.books.author &&
              this.books.launch &&
              this.books.amount
            ) {
              Produto.salvar(this.books)
                .then((resposta) => {
                  console.log(resposta.data);
                  if (this.editedIndex === -1) {
                    this.desserts.push(this.books);
                  } else {
                    this.desserts.splice(this.editedIndex, 1, this.books);
                  }
                  this.close();
                  swal('Sucesso', 'Livro salvo com sucesso!', 'success');
                })
                .catch((erro) => {
                  this.$v.books.$touch();
                  console.error('Erro ao salvar o livro:', erro);
                  swal('Erro', erro.response.data.message, 'error');
                });
            } else {
              this.$v.books.$touch();
            }
          }
        } else {
          Produto.atualizar(this.books.id, this.books)
            .then((resposta) => {
              console.log(resposta.data);
              this.books = resposta.data;

              if (this.editedIndex === -1) {
                this.desserts.push(this.books);
              } else {
                this.desserts.splice(this.editedIndex, 1, this.books);
              }
              this.close();
              swal('Sucesso', 'Livro atualizado com sucesso!', 'success');
            })
            .catch((erro) => {
              console.error('Erro ao atualizar o livro:', erro);
              swal('Erro', erro.response.data.message, 'error');
            });
        }
      },


      deleteUser(book) {
      swal({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser revertida!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        className: 'swal-text-arial',
      }).then((result) => {
        if (result) {
          Produto.apagar(book.id)
            .then(() => {
              swal({
                title: 'Excluído!',
                text: 'O livro foi excluído com sucesso.',
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
                text: erro.response.data.message || 'Erro ao excluir o livro.',
                icon: 'error',
                buttons: false,
                timer: 4000,
                customClass: 'swal-text-arial',
              });
              console.error('Erro ao excluir o livro:', erro);
            });
        } else {
          swal({
            title: 'Cancelado',
            text: 'A exclusão do livro foi cancelada.',
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

#borda{
  border-right: 2px solid rgb(102, 102, 102);
  padding-right: 10px;
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
  color: black; 
  font-family: 'arial', sans-serif; 
}

.swal-text{
  font-size: 20px;
}

.swal-text-arial {
  font-family: 'Arial', sans-serif !important;
  font-size: 20px;
}



</style>