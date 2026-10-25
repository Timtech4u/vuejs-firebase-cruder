 <template>
  <nav>
      <div class="nav-wrapper green">
        <div class="container">
          <router-link to="/" class="brand-logo">Manager</router-link>    
          <a href="#" @click.prevent="menuOpen = !menuOpen" class="button-collapse"><i class="material-icons">menu</i></a>
          <ul class="right hide-on-med-and-down">
            <li v-if="isLoggedIn"><span class="email black-text">{{currentUser}}</span></li>
            <li v-if="isLoggedIn"><router-link to="/">Dashboard</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
             <li v-if="isLoggedIn"><button v-on:click="logout" class="btn black">Logout</button></li>
             
          </ul>
          <ul @click="menuOpen = false" class="side-nav" :style="menuOpen ? { transform: 'translateX(0)' } : {}" id="mobile-demo">
            <li><button type="button" class="btn-flat" aria-label="Close menu" @click="menuOpen = false">Close</button></li>
            <li v-if="isLoggedIn"><router-link to="/">Dashboard</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
            <li><a href="#" class="divider"></a></li>
             <li v-if="isLoggedIn"><button v-on:click="logout" class="btn">Logout</button></li>
           
          </ul>
        </div>
      </div>
    </nav>
  </template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
export default {
  name: 'EmployeeNavbar',
  data() {
    return {
      isLoggedIn: false,
      currentUser: false,
      menuOpen: false,
      unsubscribe: null
    };
  },
  created() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.isLoggedIn = Boolean(user);
      this.currentUser = user ? user.email : '';
    });
  },
  beforeUnmount() { this.unsubscribe?.(); },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('/login');
        });
    }
  }
};
</script>

<style scoped>
.email {
  padding-right: 10px;
}
</style>