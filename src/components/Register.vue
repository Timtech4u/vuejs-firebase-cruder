<template>
  <div>
    <div class="container">
    <div class="row">
      <div class="col s12 m8 offset-m2">
        <div class="login card-panel grey lighten-4 black-text center">
          <h3>Register</h3>
          <form @submit.prevent="register">
            <div class="input-field">
              <i class="material-icons prefix">email</i>
              <input type="email" id="email" v-model="email" @focus="focusedField = 'email'" @blur="focusedField = null">
              <label :class="{ active: focusedField === 'email' || Boolean(email) }" for="email">Email Address</label>
            </div>
            <div class="input-field">
              <i class="material-icons prefix">lock</i>
              <input type="password" id="password" v-model="password" @focus="focusedField = 'password'" @blur="focusedField = null">
              <label :class="{ active: focusedField === 'password' || Boolean(password) }" for="password">Password</label>
            </div>
            <button type="submit" class="btn btn-large btn-extended grey lighten-4 black-text">Register</button>
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
  name: 'EmployeeRegister',
  data: function() {
    return {
          focusedField: null,
      email: '',
      password: ''
    };
  },
  methods: {
    register: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            // console.log(user);
            alert(`Account Created for ${user.user.email}`);
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