<template>
    <v-card
		class="pa-4"
		flat
		:ripple="false"
		@click="toAnswer"
	>
		<v-avatar size="20" color="primary" class="mr-3">
			<span class="white--text">{{ uid.charAt(0) }}</span>
		</v-avatar>
		<span class="grey--text text--lighten-1 text-caption">{{ uid }}</span>

		<v-card-text v-if="this.interface === 'question'">
			<p class="text-body-2">{{ truncateContent(content) }}</p>
			<div class="d-flex justify-space-between align-center">
				<p class="mb-0">
					{{ likeCount }} 赞同 · {{ commentCount }} 评论
				</p>
				<span class="text-caption grey--text text--lighten-1">
					{{ formatDate(createTime) }}
				</span>
			</div>
		</v-card-text>

		<v-card-text v-if="this.interface === 'answer'">
			<div class="text-body-2">{{ content }}</div>
			<v-divider></v-divider>
			<div class="d-flex align-center flex-nowrap" style="gap: 4px">
				<v-avatar size="20" color="primary" class="mr-1">
					<span class="white--text">{{ uid.charAt(0) }}</span>
				</v-avatar>
				
				<span class="grey--text text--lighten-1 text-caption mr-2">{{ truncateContent(uid, 1) }}</span>
				
				<template v-if="!refuse">
					<v-btn :ripple="false" small text @click="agreeFunc" class="px-1">
					<v-icon left small>{{ agree ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
					</v-btn>
				</template>
				
				<template v-if="!agree">
					<v-btn :ripple="false" small text @click="refuseFunc" class="px-1">
					<v-icon left small>{{ refuse ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
					</v-btn>
				</template>
				
				<v-btn :ripple="false" small text @click="collectedFunc" class="px-1">
					<v-icon left small>{{ collected ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
				</v-btn>
				
				<v-btn :ripple="false" small text @click="commentFunc" class="px-1">
					<v-icon left small>mdi-chat-outline</v-icon>
				</v-btn>
			</div>

			<v-snackbar
                v-model="snackbar"
                :timeout="1000"
                color="white"
                :style="{
                    'position': 'fixed',
                    'bottom': '60px',
                }"
                rounded="xl"
                min-width="90"
            >
                <span style="color: black;">{{ snackerText }}</span>
            </v-snackbar>
		</v-card-text>

		<v-sheet 
			color="grey lighten-2" 
			height="3px" 
			width="100%"
			rounded="0"
		/>

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
			agree: false,
			refuse: false,
			collected: false,

			snackbar: false,
            snackerText: "",
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
		interface: {
			type: String,
			required: true
		},
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
					content: '@ctitle(100,500)',
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
		toAnswer() {
			if (this.interface === 'question') {
				localStorage.setItem('rid', this.rid)
				localStorage.setItem('qid', this.qid)
				this.$router.push('./answer')
			}
		},
		truncateContent(text, length = 34) {
			return text.length > length 
			? text.substring(0, length) + '...'
			: text
		},
		agreeFunc() {
			this.snackbar = true
			if (this.agree) {
				this.snackerText = "已取消"
			} else {
				this.snackerText = "已赞同"
			}
			this.agree = !this.agree
			this.likeCount += this.agree ? 1 : -1

			// TODO: api
		},
		refuseFunc() {
			this.snackbar = true
			if (this.refuse) {
				this.snackerText = "已取消"
			} else {
				this.snackerText = "已反对"
			}
			this.refuse = !this.refuse
			// TODO: api
		},
		collectedFunc() {
			this.snackbar = true
			if (this.collected) {
				this.snackerText = "已取消"
			} else {
				this.snackerText = "已收藏"
			}
			this.collected = !this.collected
			// TODO: api
		},
		commentFunc() {

		}
    },
	created() {
        this.fetchData()
    }
  }
</script>