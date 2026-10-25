<template>
  <div id="new-employee">
    <h3>New Employee</h3>
    <div class="row">
    <form @submit.prevent="saveEmployee" class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="employee_id" @focus="focusedField = 'employee_id'" @blur="focusedField = null" required>
          <label :class="{ active: focusedField === 'employee_id' || Boolean(employee_id) }">Employee ID#</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="name" @focus="focusedField = 'name'" @blur="focusedField = null" required>
          <label :class="{ active: focusedField === 'name' || Boolean(name) }">Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="dept" @focus="focusedField = 'dept'" @blur="focusedField = null" required>
          <label :class="{ active: focusedField === 'dept' || Boolean(dept) }">Department</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" v-model="position" @focus="focusedField = 'position'" @blur="focusedField = null" required>
          <label :class="{ active: focusedField === 'position' || Boolean(position) }">Position</label>
        </div>
      </div>
      <button type="submit" class="btn">Submit</button>
      <router-link to="/" class="btn grey">Cancel</router-link>
    </form>
  </div>
  </div>
</template>

<script>
    import db from './firebaseInit'
    export default {
      name: 'new-employee',
      data () {
        return {
          focusedField: null,
          employee_id: null,
          name: null,
          dept: null,
          position: null
        }
      },
      methods: {
        saveEmployee () {
          db.collection('employees').add({
            employee_id: this.employee_id,
            name: this.name,
            dept: this.dept,
            position: this.position
          })
          .then(docRef => {
            console.log('Client added: ', docRef.id)
            this.$router.push('/')
          })
          .catch(error => {
            console.error('Error adding employee: ', error)
          })
        }
      }
    }
</script>
