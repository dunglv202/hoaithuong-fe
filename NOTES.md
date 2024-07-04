- (?) Single-file component
- `reactive()` only works on objects, `ref()` can take any value then wrap it in object with `value` property
- bind attributes using `v-bind:<attribute>` or shorthand without `v-bind` prefix
- bind event listener using `v-on` or short hand with `@`. for example `@click="increment"`
- using `v-bind` and `v-on` together, we can have two-way bindings on form input elements
  ```html
  <input :value="text" @input="onInput" />
  ```
- simplify this, we have `v-model`
- conditional rendering with `v-if` and `v-else`
- list rendering with `v-for`
  ```html
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
  </ul>
  ```
- compute value based on other states with `computed()`
- get ref to DOM element with `ref()`
  ```html
  <script setup>
    const myBtn = ref(null)
  </script>
  <template>
    <button ref="myBtn">Click me</button>
  </template>
  ```
- hook lifecycle `onMounted()`, `onUpdate()`
- side effect with `watch()`
