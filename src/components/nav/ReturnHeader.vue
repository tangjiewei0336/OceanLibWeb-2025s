<template>
	<v-app-bar app flat color="white">
		<v-btn icon @click="goBack">
		<v-icon>mdi-arrow-left</v-icon>
		</v-btn>

		<v-spacer></v-spacer>

		<v-menu offset-y>
		<template v-slot:activator="{ props }">
			<v-btn icon v-bind="props">
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
            localStorage.setItem('refresh', 'true')
            this.$router.go(-1)
        },
        performSearch() {
            this.searchMenu = false
        }
    }
}
</script>