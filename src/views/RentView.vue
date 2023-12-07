
<template>
    <v-data-table
      :headers="headers"
      :items="customSort(filteredReturnedRentals)"
      :footer-props="{
        'items-per-page-text':'Linhas por páginas'
      }"
      :header-props="headerProps"
      class="table-style elevation-10 ml-3 mt-3"
      :mobile-breakpoint="1020"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title class="display-1 black--text">Aluguel</v-toolbar-title>
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
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class=""
                v-bind="attrs"
                v-on="on"
                @click="openDialog"
              >
                Adicionar Aluguel
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
                      <v-autocomplete v-model="books.bookId"
                      :items="livrosOptions" 
                      :error-messages="livroErrors"                
                      label="Livros"
                      required
                      @input="$v.books.bookId.$touch()"
                      @blur="$v.books.bookId.$touch()"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" >
                      <v-autocomplete v-model="books.userId"
                      :items="usuariosOptions" 
                      :error-messages="usuarioErrors"
                      required
                      @input="$v.books.userId.$touch()"
                      @blur="$v.books.userId.$touch()"              
                      label="Usuarios"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      max-width="290"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formattedDate1"
                          :error-messages="aluguelErrors"
                          required
                          clearable
                          label="Previsão de devolução"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          @click:clear="date1 = null"
                          
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date1"
                        @change="menu2 = false"
                        label="Data de Previsão"
                        locale="pt-br"
                        :max="formattedMaxDate"
                        @input="clearDateForecastErrors"
                      ></v-date-picker>
                    </v-menu>
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
          <v-row>
                <v-col cols="6" md="6">
                  <v-btn color="orange" class="ml-2 mb-3 white--text" block @click="exibirPendentes">Mostrar Pendentes</v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="6" md="6">
                  <v-btn color="success" class="mb-3" style="position: relative; right: 5px;" block @click="exibirDevolvidos">Mostrar Devolvidos</v-btn>
                </v-col>
              </v-row>
      </template>
      
      <template v-slot:item.actions="{ item }">
        <v-icon
          medium
          class="blue--text ml-8"
          @click="devolverLivro(item)"
        >
          mdi-book-clock-outline
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
      
      <template v-slot:item.status="{ item }">
      <div :class="getStatusClass(item.status)">{{ item.status }}</div>
    </template>
    

    <template slot="item.dateRent" slot-scope="{ item }">
        {{ item.dateRent | formatDateBR }}
    </template>
    <template slot="item.dateForecast" slot-scope="{ item }">
        {{ item.dateForecast | formatDateBR }}
    </template>
    <template slot="item.dateReturn" slot-scope="{ item }">
        {{ item.dateReturn | formatDateBR }}
    </template>
      
    </v-data-table>  
</template>

<script>
import livro from '../Services/book'
import usuario from '../Services/Users'
import Aluguel from '../Services/rent'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { validationMixin } from 'vuelidate'
import { required} from 'vuelidate/lib/validators'
import moment from 'moment'
import 'moment/locale/pt-br';
import swal from 'sweetalert';

export default {

  mixins: [validationMixin],

  validations: {
    books: {
      bookId: { required },  
      userId: { required },
      dateForecast: {required}, 
  }
},

  filters: {
    formatDateBR: function (value) {
      if (value) {
      const todaydate = moment(value); // Usando o Moment.js para obter a data formatada
      const formattedDate = todaydate.format('DD/MM/YYYY');
      return formattedDate;
    }
    return "";
  },
   
},

  data: () => ({
    dialog: false,
    dialogDelete: false,
    menu1: false,
    menu2:false,
    date: moment().toDate(),
    date1: null,
    statusFilter: 'all',
    usuarios:[],
    livros:[],
    books: {
      id: '',
      bookId: '',
      userId: '',
      dateRent: '',
      dateForecast: '', 
      dateReturn: '',  
    },
    search: '',
    headerProps: {
        sortByText: "Ordenar por"
      },
    headers: [
      { text: 'Id', value: 'id', align:'center ' },
      {
        text: 'Livro',
        align: 'start',
        value: 'book.name',
        align:'center'
      },
      { text: 'Usuário', value: 'user.name', align:'center' },
      { text: 'Data do aluguel', value: 'dateRent', align:'center' },
      { text: 'Data de previsão', value: 'dateForecast', align:'center' },
      { text: 'Data de devolução', value: 'dateReturn', align:'center'},  
      { text: 'Status', value: 'status'},  
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,

  }),

  computed: {
    
    formattedMaxDate() {
      moment.locale('pt-br');
      const maxDate = moment().add(1, 'months').endOf('day');
      return maxDate.format('YYYY-MM-DD');
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Adicionar Aluguel' : 'Editar Aluguel';
    },
    formIcon() {
      return this.editedIndex === -1 ? 'mdi-plus-thick' : 'mdi-pencil';
    },

    formattedDate() {
      moment.locale('pt-br'); 
      return this.date ? moment(this.date).format('LL') : '';
    },

    formattedDate1() {
      moment.locale('pt-br');
      return this.date1 ? moment(this.date1).format('LL') : '';
    },

    usuariosOptions() {
      return this.usuarios.map(user => ({
        text: user.name,
        value: user.id
      }));
    },

  livrosOptions() {
      return this.livros.map(book => ({
        text: book.name,
        value: book.id
      }));
    },

    livroErrors () {
        const errors = []
        if (!this.$v.books.bookId.$dirty) return errors
        !this.$v.books.bookId.required && errors.push('Livro é obrigatória')
        return errors
      },  

      usuarioErrors () {
        const errors = []
        if (!this.$v.books.userId.$dirty) return errors
        !this.$v.books.userId.required && errors.push('Usuário é obrigatória')
        return errors
      },
      
      aluguelErrors () {
        const errors = []
        if (!this.$v.books.dateForecast.$dirty) return errors
        !this.$v.books.dateForecast.required && errors.push('Data é obrigatória')
        return errors
      }, 

      filteredReturnedRentals() {
        if (this.statusFilter === 'all') {
        return this.desserts.filter((desserts) => this.Searchfunction(desserts, this.search));  
      } else {
        const statuses = this.statusFilter.split(',');
        return this.desserts.filter((desserts) => {
          return statuses.includes(desserts.status) && this.Searchfunction(desserts, this.search);
        });
      }
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
    this.listarUsuario()
    this.listarLivros()
  },

  methods: {

    customSort(items) {
    const order = ['Devolvido', 'Atrasado', 'Pendente'];

    return items.sort((a, b) => {
      return order.indexOf(a.status) - order.indexOf(b.status);
    });
  },

    exibirPendentes() {
      this.statusFilter = 'Pendente';
    },

    exibirDevolvidos() {
      this.statusFilter = 'No prazo,Atrasado';
    },

    clearDateForecastErrors() {
    if (this.$v.books.dateForecast.$error) {
      this.$v.books.dateForecast.$reset(); // Limpa a validação de dateForecast
    }
  },

    getStatusClass(status) {
      if (status === 'Atrasado') {
        return 'status-red';
      } else if (status === 'No prazo') {
        return 'status-green';
      } else if (status === 'Pendente') {
        return 'status-yellow';
      }
      return '';
    },

    
    Searchfunction(rents, search) {
    const searchLower = search.toLowerCase();
    const userIdSearch = String(rents.id).toLowerCase().includes(searchLower);
    const userNameSearch = rents.user.name.toLowerCase().includes(searchLower);
    const bookNameSearch = rents.book.name.toLowerCase().includes(searchLower);
    const statusSearch = rents.status.toLowerCase().includes(searchLower); // Pesquisa pelo campo "status"

    const dateSearch =
      this.DateSearch(rents.dateRent, searchLower) ||
      this.DateSearch(rents.dateForecast, searchLower) ||
      this.DateSearch(rents.dateReturn, searchLower);

    return userIdSearch || userNameSearch || bookNameSearch || statusSearch || dateSearch;
},

    DateSearch(dateValue, search) {
      if (!dateValue) {
      return false;
    }

    const date = moment(dateValue); // Use Moment.js para lidar com a data
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate.includes(search);
    },
    
    listar(){
      Aluguel.listar().then(resposta => {
      this.desserts = resposta.data
    });
  },

    listarUsuario(){
      usuario.listar().then(resposta => {
      this.usuarios = resposta.data
    })
    },

    listarLivros(){
      livro.listar().then(resposta => {
      this.livros = resposta.data
    })
    },

    openDialog() {
      if (this.editedIndex === -1) {
        this.$v.books.bookId.$reset();
        this.books = {
          id: '',
          bookId: '',
          userId: '',
          dateRent: '',
          dateForecast: '', 
          dateReturn: '', 
        };
      } else {
        
        this.books = Object.assign({}, this.desserts[this.editedIndex]);
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
        this.bookId = ''
        this.userId = ''
        this.dateRent = ''
        this.dateForecast = ''
        this.dateReturn = ''
        this.date1 = null;
    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      salvar() {
      if (!this.books.id) {
        this.books.dateForecast = this.date1;
        this.books.dateRent = this.date ? moment(this.date).format('YYYY-MM-DD') : null;

        // Realize a verificação se userId, bookId ou dateForecast estão vazios
        if (!this.books.userId || !this.books.bookId || !this.books.dateForecast) {
          this.$v.books.$touch(); // Ative apenas se um dos campos estiver vazio
        } else {

          Aluguel.salvar(this.books)
            .then((resposta) => {
              console.log(resposta.data);
              if (this.editedIndex === -1) {
                this.desserts.push(resposta.data); // Adicione o novo aluguel à lista
              } else {
                this.desserts.splice(this.editedIndex, 1, resposta.data);
              }
              this.close();
              swal('Sucesso', 'Aluguel salvo com sucesso!', 'success');
            })
            .catch((erro) => {
              console.error('Erro ao salvar o aluguel:', erro);
              swal('Erro', erro.response.data.message, 'error');
            });
        }
      } else {
        console.error('Erro ao salvar o aluguel:', erro);
        swal('Erro', 'Erro ao salvar o aluguel.', 'error');
      }
    },

    devolverLivro(item) {
      if (item.dateReturn) {
        swal({
          title: 'Aviso',
          text: 'Este livro já foi devolvido anteriormente.',
          icon: 'info',
          buttons: false,
          timer: 2000, // Tempo em milissegundos
          className: 'swal-text-arial', // Adiciona a classe para definir a fonte em Arial
        });
        return;
      }

      swal({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser revertida!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        className: 'swal-text-arial', // Adiciona a classe para definir a fonte em Arial
      }).then((willDelete) => {
        if (willDelete) {
          item.data_devolucao = moment().format('YYYY-MM-DD');
          Aluguel.atualizar(item.id)
            .then(() => {
              swal({
                title: 'Devolvido!',
                text: 'O livro foi devolvido com sucesso.',
                icon: 'success',
                buttons: false,
                timer: 2000,
                className: 'swal-text-arial', // Adiciona a classe para definir a fonte em Arial
              });
              this.listar();
            })
            .catch((erro) => {
              swal({
                title: 'Erro',
                text: 'Não foi possível devolver o livro.',
                icon: 'error',
                buttons: false,
                timer: 2000,
                className: 'swal-text-arial', // Adiciona a classe para definir a fonte em Arial
              });
              console.error('Erro ao devolver o livro:', erro);
            });
        } else {
          swal({
            title: 'Cancelado',
            text: 'A devolução do livro foi cancelada.',
            icon: 'info',
            className: 'swal-text-arial', // Adiciona a classe para definir a fonte em Arial
          });
        }
      });
    },

    deleteUser(aluguel) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser revertida!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, exclua!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Aluguel.apagar(aluguel)
            .then(() => {
              Swal.fire('Excluído!', 'O usuário foi excluído com sucesso.', 'success');
              this.listar();
            })
            .catch((erro) => {
              Swal.fire('Erro', erro.response.data.error, 'error');
              console.error('Erro ao excluir o usuário:', erro);
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
  padding: 5px !important;
}

.date-status {
  font-size: 15px !important;
}

.pending {
  font-size: 18px; 
}

.status-red {
  background-color: red;
  border-radius: 20px;
  color: #ffffff;
  padding: 10px;
  width: 87px;
}

.status-green {
  background-color: rgb(7, 189, 7);
  border-radius: 20px;
  color: #ffffff;
  padding: 10px;
  width: 87px; /* Texto em verde para status "Entregue no prazo" */
}

.status-yellow {
  background-color: rgb(255, 215, 83);
  border-radius: 20px;
  color: #ffffff;
  padding: 10px;
  width: 87px;
}

/* Outros estilos que você deseja aplicar à tabela */
.table-style th {
  font-size: 16px !important; 
  color: #ffffff !important; 
  font-family: 'Arial', sans-serif;
}

.table-style td {
  font-size: 15px !important; 
  color: black; 
  font-family: 'arial', sans-serif; 
  padding: 5px !important;
}

.swal-text-arial {
  font-family: 'Arial' !important;
}

.swal-title{
  font-family: 'Arial' !important;
}

.swal-text {
  font-family: 'Arial' !important;
}


</style>