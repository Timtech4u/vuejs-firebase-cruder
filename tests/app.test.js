import { it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
const mocks = vi.hoisted(() => ({ auth: { currentUser:null, signInWithEmailAndPassword:vi.fn(), createUserWithEmailAndPassword:vi.fn(), signOut:vi.fn(), onAuthStateChanged:vi.fn() }, db:{collection:vi.fn(),orderBy:vi.fn(),where:vi.fn(),get:vi.fn(),add:vi.fn()}, update:vi.fn(), remove:vi.fn() }));
vi.mock('firebase/compat/app', () => ({default:{ auth:()=>mocks.auth }}));
vi.mock('firebase/compat/auth', () => ({}));
vi.mock('../src/components/firebaseInit', () => ({default:mocks.db}));
import Home from '../src/components/Home.vue';
import NewEmployee from '../src/components/NewEmployee.vue';
import EditEmployee from '../src/components/EditEmployee.vue';
import ViewEmployee from '../src/components/ViewEmployee.vue';
import Login from '../src/components/Login.vue';
import Register from '../src/components/Register.vue';
import Navbar from '../src/components/Navbar.vue';
const employee={employee_id:'42',name:'Jane',dept:'Engineering',position:'Developer'};
const global = () => ({stubs:{RouterLink:true},mocks:{$router:{push:vi.fn(),replace:vi.fn()},$route:{params:{employee_id:'42'}}}});
beforeEach(()=>{
 vi.clearAllMocks();
 for(const method of ['collection','where','orderBy'])mocks.db[method].mockReturnValue(mocks.db);
 mocks.db.get.mockResolvedValue({forEach:fn=>fn({id:'doc',data:()=>employee,ref:{update:mocks.update,delete:mocks.remove}})});
 mocks.db.add.mockResolvedValue({id:'doc'});mocks.update.mockResolvedValue();mocks.remove.mockResolvedValue();
 mocks.auth.signInWithEmailAndPassword.mockResolvedValue({user:{email:'a@example.com'}});
 mocks.auth.createUserWithEmailAndPassword.mockResolvedValue({user:{email:'a@example.com'}});
 mocks.auth.signOut.mockResolvedValue();mocks.auth.onAuthStateChanged.mockImplementation(fn=>{fn(mocks.auth.currentUser);return ()=>{};});
 vi.stubGlobal('alert',vi.fn()); vi.stubGlobal('confirm',vi.fn(()=>true));
});
it('lists employees and submits new employees',async()=>{
 const home=mount(Home,{global:global()});await flushPromises();expect(home.text()).toContain('Jane');
 const form=mount(NewEmployee,{global:global()}); await form.setData(employee);await form.get('form').trigger('submit');await flushPromises();
 expect(mocks.db.add).toHaveBeenCalledWith(employee);expect(form.vm.$router.push).toHaveBeenCalledWith('/');
});
it('updates and deletes the selected employee',async()=>{
 const edit=mount(EditEmployee,{global:global()});await edit.setData(employee);edit.vm.updateEmployee();await flushPromises();
 expect(mocks.db.where).toHaveBeenCalledWith('employee_id','==','42');expect(mocks.update).toHaveBeenCalledWith(employee);
 const view=mount(ViewEmployee,{global:global()});view.vm.deleteEmployee();await flushPromises();expect(mocks.remove).toHaveBeenCalledOnce();
});
it.each([[Login,'signInWithEmailAndPassword'],[Register,'createUserWithEmailAndPassword']])('authenticates and navigates after form submission',async(Component,method)=>{
 const wrapper=mount(Component,{global:global()});await wrapper.setData({email:'a@example.com',password:'test-password'});
 await wrapper.get('form').trigger('submit');await flushPromises();
 expect(mocks.auth[method]).toHaveBeenCalledWith('a@example.com','test-password');expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/');
});
it('reacts to authentication changes and logs out',async()=>{
 mocks.auth.currentUser={email:'a@example.com'};const wrapper=mount(Navbar,{global:global()});await flushPromises();
 expect(wrapper.text()).toContain('a@example.com');await wrapper.get('button').trigger('click');await flushPromises();expect(mocks.auth.signOut).toHaveBeenCalledOnce();expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/login');
});
it('redirects guests away from protected routes and signed-in users away from login', async () => {
 const {default:router}=await import('../src/router/index.js');
 mocks.auth.currentUser=null;await router.push('/new');expect(router.currentRoute.value.path).toBe('/login');
 expect(router.currentRoute.value.query.redirect).toBe('/new');
 mocks.auth.currentUser={email:'a@example.com'};await router.push('/register');expect(router.currentRoute.value.path).toBe('/');
});
it('renders employee details through the real router', async () => {
 const {default:router}=await import('../src/router/index.js');
 const {default:App}=await import('../src/App.vue');
 mocks.auth.currentUser={email:'a@example.com'};
 await router.push('/42');
 const wrapper=mount(App,{global:{plugins:[router]}});await flushPromises();
 expect(wrapper.text()).toContain('Jane');expect(wrapper.get('a[href="#/edit/42"]').exists()).toBe(true);
 wrapper.unmount();
});

it('opens and closes mobile navigation without the removed jQuery plugin',async()=>{
 const wrapper=mount(Navbar,{global:global()});
 await wrapper.get('.button-collapse').trigger('click');
 expect(wrapper.get('#mobile-demo').attributes('style')).toContain('translateX(0)');
 await wrapper.get('[aria-label="Close menu"]').trigger('click');
 expect(wrapper.get('#mobile-demo').attributes('style')).not.toContain('translateX(0)');
 wrapper.unmount();
});

it.each([
  [Login, ['email', 'password']],
  [Register, ['email', 'password']],
  [NewEmployee, ['employee_id', 'name', 'dept', 'position']]
])('keeps form labels clear of focused, entered and prefilled values', async (Component, fields) => {
  const wrapper = mount(Component, { global: global() });
  const inputs = wrapper.findAll('input');
  const labels = wrapper.findAll('label');
  for (const [index, field] of fields.entries()) {
    expect(labels[index].classes()).not.toContain('active');
    await inputs[index].trigger('focus');
    expect(labels[index].classes()).toContain('active');
    await inputs[index].trigger('blur');
    expect(labels[index].classes()).not.toContain('active');
    await inputs[index].setValue('Entered value');
    expect(labels[index].classes()).toContain('active');
    await inputs[index].trigger('blur');
    expect(labels[index].classes()).toContain('active');
    await inputs[index].setValue('');
    expect(labels[index].classes()).not.toContain('active');
    await wrapper.setData({ [field]: 'Prefilled value' });
    expect(labels[index].classes()).toContain('active');
  }
  wrapper.unmount();
});
