<template>
    <v-card class="pa-4" flat>
		<v-avatar size="20" color="primary" class="mr-3">
			<span class="white--text">{{ uid.charAt(0) }}</span>
		</v-avatar>
		<span class="grey--text text--lighten-1 text-caption">{{ uid }}</span>

		<v-card-text>
			<p class="text-body-2">{{ content }}</p>
			<div class="d-flex justify-space-between align-center">
				<p class="mb-0">
					{{ likeCount }} 赞同 · {{ commentCount }} 评论
				</p>
				<span class="text-caption grey--text text--lighten-1">
					{{ formatDate(createTime) }}
				</span>
			</div>
		</v-card-text>

		<v-sheet 
			color="grey lighten-2" 
			height="3px" 
			width="100%"
			rounded="0"
		/>
		<!-- <v-card-actions class="justify-end">
			<v-btn variant="text" color="grey">取消</v-btn>
			<v-btn color="primary">确认</v-btn>
			<v-btn variant="outlined" color="secondary">更多</v-btn>
		</v-card-actions> -->

		<!-- <div class="text-body-2 mt-3">
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
		</div> -->

	</v-card>

  </template>
  
<script>
import Mock from 'mockjs'
import CommentCard from './CommentCard.vue';

export default {
    name: 'ContentCard',
	// components: { CommentCard },
    data() {
		return {
			uid: '',
			content: "",
			commentCount: 0,
			likeCount: 0,
			liked: false,
			createTime: null,
			// isExpanded: false,
			// unFoldComment: false,
			// newComment: '',
		}
    },
	props: {
		qid: {
			type: Number,
			required: true
		},
		rid: {
			type: Number,
			required: true
		},

		// title: {
		// 	type: String,
		// 	default: "Ko no dio da!"
		// },
		// content: {
		// 	type: String,
		// 	default: "Vuetify 3.0带来了多项重大改进，包括：1. 完全兼容Vue 3的Composition API；2. 全新的设计系统，支持动态主题切换；3. 性能优化，组件渲染速度提升约40%；4. 新增VDataTable等实用组件...（此处省略后续内容）"
		// },
		// uid: {
		// 	type: String,
		// 	default: "DIO"
		// },
		// paraList: {
		// 	type: Array,
		// 	required: true
		// },
		// noTitle: {
		// 	type: Boolean,
		// 	default: false
		// },
	},
    methods: {
		truncateAnswer(text, length = 30) {
			return text.length > length 
			? text.substring(0, length) + '...' 
			: text
		},
		fetchData() {
			const response = [200, {
				state: "SUCCESS",
				code: "1",
				msg: Mock.mock({
					'uid': '@ctitle(3,8)',
					'title': '@ctitle(10,20)',
					'hotPoint|5000-3000000': 1,
					content: '@ctitle(50,100)',
					'commentCount|10-100': 1,
					'browse|20-300': 1,
					'likeCount|10-50': 1,
					'liked|1': [true, false],
					createTime: '@datetime'
				})
			}]

			this.uid = response[1].msg.uid
			this.content = response[1].msg.content
			this.likeCount = response[1].msg.likeCount
			this.liked = response[1].msg.liked
			this.commentCount = response[1].msg.commentCount
			this.createTime = response[1].msg.createTime
		},
		formatDate(date) {
			return new Date(date).toLocaleDateString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
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
    },
	created() {
        this.fetchData()
    }
  }
  </script>