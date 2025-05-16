<template>
    <v-card class="pa-4" flat outlined>
		<div v-if="!noTitle" class="text-h8 font-weight-bold">{{ this.title }}</div>
  
		<div class="text-body-2 mt-3">
			<div v-if="!isExpanded">
				{{this.uid + ": " + truncateAnswer(this.content) }}
			</div>
			<div v-if="isExpanded">
				{{ this.uid + ": " + this.content }}
			</div>
			<v-btn 
				text 
				color="primary" 
				class="pl-0" 
				@click="isExpanded = !isExpanded"
			>
				<v-icon left>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
				{{ isExpanded ? '收起内容' : '展开内容' }}
			</v-btn>
		</div>
  
		<v-card-actions class="px-2 pt-0">
			<v-btn 
				text 
				small
				@click="vote('up')"
			>
				<v-icon left>mdi-thumb-up</v-icon>
				{{ this.paraList[0] }}
			</v-btn>
			
			<v-btn 
				text 
				small
				@click="vote('down')"
			>
			<v-icon left>mdi-thumb-down</v-icon>
				{{ this.paraList[1] }}
			</v-btn>
			
			<v-btn 
				text 
				small
				@click="unFoldComment = !unFoldComment"
			>
				<v-icon left>mdi-comment</v-icon>
				{{ this.paraList[2] }}
			</v-btn>
			
			<v-btn 
				text 
				small
				@click="like"
			>
				<v-icon left>mdi-heart</v-icon>
				{{ this.paraList[3] }}
			</v-btn>
			
			<v-btn 
				icon 
				small
				@click="showReward"
			>
				<v-icon>mdi-hand-coin</v-icon>
				{{ this.paraList[4] }}
			</v-btn>
		</v-card-actions>

		<div v-if="unFoldComment">
			<v-row no-gutters align="center">
				<v-col cols="9">
					<v-textarea
						v-model="newComment"
						label="理性发言，友善互动"
						auto-grow
						outlined
						dense
						row-height="15"
						no-resize
						class="mr-2"
						hide-details
                	></v-textarea>
				</v-col>
				<v-col cols="auto">
					<v-btn 
						color="primary" 
						@click="addComment"
						small
						depressed
					>
						发布
					</v-btn>
				</v-col>
			</v-row>
			<CommentCard/>
		</div>

	</v-card>

  </template>
  
<script>

import CommentCard from './CommentCard.vue';

export default {
    name: 'ContentCard',
	components: { CommentCard },
    data() {
		return {
			isExpanded: false,
			unFoldComment: false,
			newComment: '',
		}
    },
	props: {
		title: {
			type: String,
			default: "Ko no dio da!"
		},
		content: {
			type: String,
			default: "Vuetify 3.0带来了多项重大改进，包括：1. 完全兼容Vue 3的Composition API；2. 全新的设计系统，支持动态主题切换；3. 性能优化，组件渲染速度提升约40%；4. 新增VDataTable等实用组件...（此处省略后续内容）"
		},
		uid: {
			type: String,
			default: "DIO"
		},
		paraList: {
			type: Array,
			required: true
		},
		noTitle: {
			type: Boolean,
			default: false
		},
	},
    methods: {
		truncateAnswer(text, length = 30) {
			return text.length > length 
			? text.substring(0, length) + '...' 
			: text
		},
		expandAnswer() {
			// 展开全文逻辑
		},
		vote(type) {
			// 赞同/反对逻辑
		},
		showComments() {
			// 显示评论逻辑
		},
		like() {
			// 点赞逻辑
		},
		showReward() {
			// 打赏逻辑
		}
    }
  }
  </script>
  
  <style scoped>
  .v-card__title {
    word-break: break-word;
    padding-bottom: 8px;
  }
  .v-card__text {
    padding-top: 0;
  }
  </style>