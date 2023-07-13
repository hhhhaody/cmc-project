<template>
  <div class="item">
    <slot name="msg"></slot>
  </div>
</template>

<style scoped>
.item {
  padding: 1vh 1vh;
  margin: 1vh;
  background-color: linear-gradient(to right, #f3f7fc69 10%, #54a1e7 20%) 2 10;
  border: solid 1px #2d557b50;
  border-image: linear-gradient(to right, #f3f7fc32 10%, #39597f 20%) 2 10;
}
</style>