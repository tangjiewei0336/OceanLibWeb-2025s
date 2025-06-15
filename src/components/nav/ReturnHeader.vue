<template>
  <v-app-bar app flat color="white">
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn
		v-if="this.interface === 'answer'"
		text
		color="primary"
		class="mr-2"
		@click="writeAnswer"
    >
      <v-icon left>mdi-pencil</v-icon>
      写回答
    </v-btn>

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" @click="performSearch" class="no-shadow-btn">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-menu>
  </v-app-bar>
</template>
<script>
export default {
    name: 'ReturnHeader',
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        performSearch() {
            // this.searchMenu = false
            this.$router.push({
              path: 'questionSearch',
            });
        },
		writeAnswer() {
			this.$emit('writeAnswer')
		}
    },
	props: {
		interface: {
			type: String,
			required: true
		},
	},
}
</script>

<style scoped>
.no-shadow-btn::before,  /* 移除点击时的背景层 */
.no-shadow-btn::after {   /* 移除涟漪动画 */
  display: none !important;
}
.no-shadow-btn:hover,
.no-shadow-btn:focus {
  box-shadow: none !important; /* 移除悬浮/聚焦阴影 */
}
</style>