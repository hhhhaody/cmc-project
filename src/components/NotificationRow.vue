<template>
  <div class="item" :class="[prop.red === true ? 'redBg' : 'blueBg']">
    <slot name="msg"></slot>
    <WarnTriangleFilled
      style="width: 4vh; height: 4vh; margin-right: 8px"
      class="warningIcon"
    />

    <div class="warningBorder"></div>
  </div>
</template>

<script setup>
const prop = defineProps({
  red: { type: Boolean, default: false },
});
</script>

<style scoped>
.item {
  width: 90%;
  padding: 1vh 1vh;
  margin: 1vh;
  position: relative;
  color: #fff;
  overflow: hidden;
  font-size: smaller;
}

.redBg {
  background: radial-gradient(ellipse at bottom, #c55562d9, transparent 90%),
    radial-gradient(ellipse at top, #c5556256, transparent 50%);
  border: solid 1px #db4f4f50;
  border-image: linear-gradient(
      to bottom right,
      #e1aaa673 10%,
      transparent 60%,
      #ba6868ab 80%
    )
    2 10;
  text-shadow: 1px -1px 5px #f9a3a3;
}
.blueBg {
  background: radial-gradient(ellipse at bottom, #6ca2f3a4, transparent 90%),
    radial-gradient(ellipse at top, #8aadda76, transparent 50%);
  border: solid 1px #559cde50;
  border-image: linear-gradient(
      to bottom right,
      #6fa4eafa 10%,
      transparent 60%,
      #39597f 80%
    )
    2 10;
  text-shadow: 1px -1px 5px #a3ccf9;
}

.warningIcon {
  position: absolute;
  top: 18%;
  right: 0.1vh;
  opacity: 0.2;
}

.warningBorder {
  border: solid 1px #fff;
  position: absolute;
  transform: rotate(45deg);
  width: 5vh;
  height: 5vh;
  top: 25%;
  right: 0.4vh;
  opacity: 0.2;
}
</style>