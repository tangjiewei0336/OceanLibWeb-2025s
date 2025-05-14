<template>
	<v-card class="pa-4" flat outlined>
		<div class="text-h7 font-weight-bold">{{ title }}</div>
		<div class="text-body-2 mt-3" v-if="isExpanded">
			{{ content }}
		</div>
		<div class="d-flex align-center justify-space-between mt-2">
			<v-btn 
				text 
				color="primary" 
				class="pl-0" 
				@click="isExpanded = !isExpanded"
			>
				<v-icon left>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
				{{ isExpanded ? '收起内容' : '展开内容' }}
			</v-btn>
			
			<div v-if="!isAnswerWriting">
				<v-btn 
					color="primary" 
					class="mr-2" 
					depressed
					small
					@click="handleView"
					v-if="!isAnswer"
				>
					<v-icon left>mdi-eye</v-icon>
					查看
				</v-btn>

				<v-btn 
					color="primary" 
					class="mr-2" 
					depressed
					small
					v-if="isAnswer"
				>
					<v-icon left>mdi-thumb-up</v-icon>
					好问题
				</v-btn>

				<v-btn 
					outlined 
					depressed
					small
					@click="handleAnswer"
				>
					<v-icon left>mdi-pencil</v-icon>
					回答
				</v-btn>
			</div>
		</div>

		<v-slide-y-transition>
			<div v-show="isExpanded" class="mt-2">
				<slot name="expanded-content"></slot>
			</div>
		</v-slide-y-transition>

		<div class="d-flex mt-3">
			<div class="mr-4 text-caption grey--text">
				<span>回答量: {{ answerCount }}</span>
			</div>
			<div class="text-caption grey--text">
				<span>悬赏: {{ reward }}</span>
			</div>
		</div>
	</v-card>
</template>
  
<script>
export default {
	name: 'QuestionCard',
	data() {
        return {
            isExpanded: false
        }
    },
	props: {
		id: {
			type: String,
			required: true
		},
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
		},
		content: {
			type: String,
			required: true
		},
		isAnswerWriting: {
			type: Boolean,
			default: false
		},
		isAnswer: {
			type: Boolean,
			default: false
		},
	},
	methods: {
		saveQuestionInfo() {
			localStorage.setItem('forum_qid', this.id)
			localStorage.setItem('forum_answerCount', this.answerCount)
			localStorage.setItem('forum_reward', this.reward)
			localStorage.setItem('forum_title', this.title)
			localStorage.setItem('forum_content', this.content)
		},
		handleView() {
			this.saveQuestionInfo()
			this.$router.push('/forum/answer')
		},
		handleAnswer() {
			this.saveQuestionInfo()
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