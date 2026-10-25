<template>
  <div>
    <div class="container">
    <div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="login card-panel green white-text center">
          <h3>Login</h3>
          <form @submit.prevent="login">
            <div class="input-field">
              <i class="material-icons prefix">email</i>
              <input type="email" id="email" v-model="email" @focus="focusedField = 'email'" @blur="focusedField = null">
              <label :class="{ active: focusedField === 'email' || Boolean(email) }" class="white-text" for="email">Email Address</label>
            </div>
            <div class="input-field">
              <i class="material-icons prefix">lock</i>
              <input type="password" id="password" v-model="password" @focus="focusedField = 'password'" @blur="focusedField = null">
              <label :class="{ active: focusedField === 'password' || Boolean(password) }" class="white-text" for="password">Password</label>
            </div>
            <button type="submit" class="btn btn-large btn-extended grey lighten-4 black-text">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
export default {
  name: 'EmployeeLogin',
  data: function() {
    return {
          focusedField: null,
      email: '',
      password: ''
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            alert(`You are logged in as ${user.user.email}`);
            this.$router.replace('/');
          },
          err => {
            alert(err.message);
          }
        );

    }
  }
};
</script>