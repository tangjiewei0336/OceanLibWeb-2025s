<template>
    <v-card
		class="pa-4"
		flat
		:ripple="false"
		@click="toAnswer"
	>
		<v-avatar size="30" color="primary" class="mr-3">
			<img v-if="cacheAvatar" :src="avatarSrc" alt="用户头像">
			<span v-else class="white--text">{{ uid.charAt(0) }}</span>
		</v-avatar>
		<span>{{ uid }}</span>

		<v-card-text v-if="this.interface === 'question'">
			<p class="text-body-2">{{ truncateContent(content) }}</p>
			<v-row class="mt-3" no-gutters v-if="urls.length > 2">
				<v-col 
					v-for="(url, i) in limitedUrls"
					:key="i"
					cols="4"
				>
					<v-img
						:url="url"
						:width="90"
						:height="60"
						cover
						class="rounded"
					></v-img>
				</v-col>
			</v-row>
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
			<div v-html="content"></div>
			<v-divider></v-divider>
			<div class="d-flex align-center">
				<v-avatar size="30" color="primary" class="mr-1">
					<span class="white--text">我</span>
				</v-avatar>
				<v-btn
					depressed
					outlined
					color="grey lighten-4"
  					class=" text--darken-1 my-4"
					:ripple="false"
					:rounded='true'
					@click="toComment"
				>
					思想交汇总能激发非凡灵感
				</v-btn>
			</div>
			<div class="d-flex align-center flex-nowrap" style="gap: 4px">
				<v-avatar size="30" color="primary" class="mr-1">
					<span class="white--text">{{ uid.charAt(0) }}</span>
				</v-avatar>
				
				<span class="grey--text text--lighten-1 text-caption mr-2">{{ truncateContent(uid, 1) }}</span>
								
				<template v-if="!refuse">
					<v-badge
						color="transparent"
						:content="likeCount"
						offset-x="25"
						offset-y="15"
						class="custom-black-badge"
					>
						<v-btn :ripple="false" small text @click="agreeFunc" class="px-0">
							<v-icon left small>{{ agree ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
						</v-btn>
					</v-badge>
				</template>

				<template v-if="!agree">
					<v-btn :ripple="false" small text @click="refuseFunc" class="px-0">
					<v-icon left small>{{ refuse ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
					</v-btn>
				</template>
				
				<v-badge
					color="transparent"
					:content="collectedCount"
					offset-x="25"
					offset-y="15"
					class="custom-black-badge"
				>
					<v-btn :ripple="false" small text @click="collectedFunc" class="px-0">
						<v-icon left small>{{ collected ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
					</v-btn>
				</v-badge>
				
				<v-badge
					color="transparent"
					:content="commentCount"
					offset-x="25"
					offset-y="15"
					class="custom-black-badge"
				>
					<v-btn :ripple="false" small text @click="commentOpen = true" class="px-0">
						<v-icon left small>mdi-chat-outline</v-icon>
					</v-btn>
				</v-badge>

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

			<v-bottom-sheet
				v-model="commentOpen"
				inset
			>
				<v-card>
					<div>
						<CommentPopup
							:uid="uid"
							:aid="aid"
							@close="commentOpen = false"
						/>
					</div>
				
				</v-card>
			</v-bottom-sheet>
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
import CommentPopup from './CommentPopup.vue'

export default {
    name: 'ContentCard',
	components: { CommentPopup },
    data() {
		return {
			snackbar: false,
            snackerText: "",
			replyText: "",
			commentOpen: false,

			urls: [],
			refuse: false,
			agree: false,
			collected: false,
			collectedCount: 0,

			cacheAvatar: false,
			avatarSrc: null,
		}
    },
	computed: {
		limitedUrls() {
			return this.urls.slice(0, 3);
		}
	},
	props: {
		qid: {
			type: Number,
			required: true
		},
		aid: {
			type: Number,
			required: true
		},
		interface: {
			type: String,
			required: true
		},
		uid: {
			type: String,
			default: ""
		},
		content: {
			type: String,
			default: ''
		},
		commentCount: {
			type: Number,
			default: 0
		},
		likeCount: {
			type: Number,
			default: 0
		},
		createTime: {
			type: String,
			default: ''
		},
		avatar: {
			type: String,
			default: ''
		}
	},
    methods: {
		truncateAnswer(text, length = 30) {
			return text.length > length 
			? text.substring(0, length) + '...' 
			: text
		},
		fetchData() {
			// 获取指定回复
			
			// const response = [200, {
			// 	state: "SUCCESS",
			// 	code: "1",
			// 	msg: Mock.mock({
			// 		'uid': '@ctitle(3,8)',
			// 		'aid|1-100': 1,
			// 		'title': '@ctitle(10,20)',
			// 		'hotPoint|5000-3000000': 1,
			// 		content: '@ctitle(100,500)',
			// 		'commentCount|10-100': 1,
			// 		'collectedCount|5-200': 1,
			// 		'browse|20-300': 1,
			// 		'likeCount|10-50': 1,
			// 		'liked|1': [true, false],
			// 		'collected|1': [true, false],
			// 		createTime: '@datetime'
			// 	})
			// }]
			this.extractImageUrls(this.content)
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
				localStorage.setItem('aid', this.aid)
				localStorage.setItem('qid', this.qid)
				this.$router.push('./answer')
			}
		},
		truncateContent(text, length = 34) {
			const regex = /<p[^>]*>(.*?)<\/p>/g;
			let match;
			if ((match = regex.exec(text)) !== null) {
				text = match[1]
			} else {
				text = ""
			}
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
			this.collectedCount += this.collected ? 1 : -1
			// TODO: api
		},
		toComment() {
			console.log('Comment')
		},
		extractImageUrls(html) {
			const regex = /<img[^>]+src="([^">]+)"/g;
			this.urls = [];
			let match;
			while ((match = regex.exec(html)) !== null) {
				this.urls.push(match[1]);
			}
		},
		getAvatar() {
			console.log(this.avatar)
			if (this.avatar.length > 0) {
				return this.avatar
			} else {
				return uid.charAt(0)
			}
		},
		async urlToBase64(url) {
			const response = await fetch(url);
			const blob = await response.blob();
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.readAsDataURL(blob);
			});
		},
		async saveAvatar(url) {
			if (localStorage.getItem(url) != null) {
				console.log("already in cache")
				return true;
			}
			try {
				const base64Data = await this.urlToBase64(url);
				if (base64Data) {
					localStorage.setItem(url, base64Data);
					console.log('save to cache:', url);
					return true;
				}
			} catch (error) {
				console.error('save fail:', error);
			}
			return false;
		}
    },
	async created() {
        this.fetchData()
		if (this.avatar.length > 0) {
			this.cacheAvatar = true
			this.avatarSrc = this.avatar
			// this.cacheAvatar = await this.saveAvatar(this.avatar)
			// if (this.cacheAvatar) this.avatarSrc = localStorage.getItem(this.avatar)
		} else {
			this.cacheAvatar = false;
		}
    }
  }
</script>

<style>
/* 必须穿透组件作用域 */
.custom-black-badge .v-badge__badge {
  color: rgba(0, 0, 0, 1) !important; /* 强制黑色 */
  mix-blend-mode: normal !important; /* 避免透明背景下的颜色混合异常 */
}
</style>