<template>
    <v-card class="d-flex align-center pa-4" flat outlined>
      <div class="flex-grow-1">
		<div class="text-h7">{{ title }}</div>
			<div class="d-flex mt-2">
				<div class="mr-4 text-caption grey--text">
					<span>回答量: {{ answerCount }}</span>
				</div>
				<div class="mr-4 text-caption grey--text">
					<span>悬赏: {{ reward }}</span>
				</div>
			</div>
		</div>

      <div class="d-flex">
        <v-btn 
          color="primary" 
          class="mr-2" 
          depressed
          @click="handleView"
		  small
        >
          <v-icon left>mdi-eye</v-icon>
          查看
        </v-btn>
        <v-btn 
          outlined 
          depressed
          @click="handleAnswer"
		  small
        >
          <v-icon left>mdi-pencil</v-icon>
          回答
        </v-btn>
      </div>
    </v-card>
  </template>
  
<script>
export default {
	name: 'QuestionCard',
  props: {
    answerCount: {
      type: Number,
      default: 0
    },
    reward: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true
    }
  },
	methods: {
		handleView() {
			this.$router.push('/forum/answer')
		},
		handleAnswer() {
			this.$router.push('/forum/answerWrite')
		}
	}
}
</script>
  
<style scoped>
.v-card {
    border-radius: 8px !important;
    transition: box-shadow 0.3s;
}

.v-card:hover {
    box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}
</style>