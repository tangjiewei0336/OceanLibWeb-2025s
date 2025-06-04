<template>
    <v-card
		class="pa-2"
		flat
		:ripple="false"
		@click="toAnswer"
	>
		<v-avatar size="30" color="primary" class="mr-3" style="margin-left: 10px;">
			<img v-if="cacheAvatar" :src="avatarSrc" alt="用户头像">
			<span v-else class="white--text">{{ uid.charAt(0) }}</span>
		</v-avatar>
		<span v-if="this.interface === 'question'" class="grey--text">{{ uid }}</span>
		<span v-if="this.interface === 'answer'">{{ uid }}</span>

		<v-card-text v-if="this.interface === 'question'" class="pa-1">
			<p class="grey--text text--darken-3 mb-1">{{ truncateContent(content) }}</p>
			<v-row class="mt-1" no-gutters v-if="urls.length > 2">
				<v-col 
					v-for="(url, i) in limitedUrls"
					:key="i"
					cols="4"
				>
					<v-img
						:src="url"
						style="width: calc((100vw - 80px) / 3); aspect-ratio: 8/5"
						cover
						class="rounded"
					></v-img>
				</v-col>
			</v-row>
			<div class="d-flex justify-space-between align-center">
				<p class="text-body-2 grey--text mb-1">
					{{ likeCount }} 赞同 · {{ commentCount }} 评论
				</p>
				<span class="text-caption grey--text text--lighten-1">
					{{ formatDate(createTime) }}
				</span>
			</div>
		</v-card-text>

		<v-card-text v-if="this.interface === 'answer'">
			<div class="html-container" style="margin-bottom: 0">
				<div v-html="content" class="html-content"></div>
			</div>
			<span
				class="text-caption grey--text text--darken-1 mr-2"
				style="margin-top: -8px"
			>
				{{ formatDate(createTime) }}
			</span>
			<div class="d-flex align-center">
				<v-avatar size="30" color="primary" class="mr-3">
					<img :src="userAvatar" alt="我的头像">
				</v-avatar>
				<v-btn
					text
					style="width: calc(100vw - 100px); justify-content: space-between"
					color="grey darken-1"
					class="my-4 px-4 grey lighten-4 rounded-pill"
					@click="toComment"
				>
					<span>思想交汇总能激发非凡灵感</span>
					<v-icon right>mdi-emoticon-kiss-outline</v-icon>
				</v-btn>
			</div>
			<div class="d-flex align-center justify-space-between flex-nowrap">
				<div class="d-flex align-center" style="position: relative; margin-left: -10px;">
					<div 
						class="grey lighten-3 rounded-pill"
						style="
						position: absolute;
						left: 10px;
						right: 0px;
						height: 32px;
						z-index: 0;
						"
					></div>

					<div class="d-flex align-center pl-2" style="z-index: 1">
						<v-avatar size="30" color="primary" class="mr-1">
						<img v-if="cacheAvatar" :src="avatarSrc">
						<span v-else class="white--text">{{ uid.charAt(0) }}</span>
						</v-avatar>
						<span class="grey--text text--darken-1 text-caption">
						{{ truncateText(uid, 4) }}
						</span>
					</div>

					<v-btn
						small
						text
						depressed
						color="primary"
						class="z-1"
						style="min-width: 60px; z-index: 2; margin-left: -10px;"
						@click="followUser"
					>
						<span v-if="followed" class="grey--text">已关注</span>
						<span v-if="!followed">关注</span>
					</v-btn>
				</div>

				<div class="d-flex align-center" style="gap: 4px">
					<template v-if="!refuse">
						<v-badge
							color="transparent"
							:content="String(likeCount + agree)"
							offset-x="35"
							offset-y="20"
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
						:content="String(collectedCount)"
						offset-x="35"
						offset-y="20"
						class="custom-black-badge"
					>
						<v-btn :ripple="false" small text @click="collectedFunc" class="px-0">
							<v-icon left small>{{ collected ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
						</v-btn>
					</v-badge>
					
					<v-badge
						color="transparent"
						:content="String(commentCount)"
						offset-x="35"
						offset-y="20"
						class="custom-black-badge"
					>
						<v-btn :ripple="false" small text @click="showComments" class="px-0">
							<v-icon left small>mdi-chat-outline</v-icon>
						</v-btn>
					</v-badge>
				</div>
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

			<v-bottom-sheet
				v-model="commentWriteOpen"
				inset
			>
				<v-card>
					<div>
						<CommentWrite
							:uid="this.uid"
							:aid="this.aid"
							interface="level1"
							@close="finishComment"
						/>
					</div>
				
				</v-card>
			</v-bottom-sheet>
		</v-card-text>

		<v-sheet 
			color="grey lighten-2" 
			height="2px"
			width="100%"
			rounded="0"
		/>

	</v-card>
</template>
  
<script>
import Mock from 'mockjs'
import CommentPopup from './CommentPopup.vue'
import CommentWrite from './CommentWrite.vue'

export default {
    name: 'ContentCard',
	components: { CommentPopup, CommentWrite },
    data() {
		return {
			snackbar: false,
            snackerText: "",
			replyText: "",
			commentOpen: false,
			commentWriteOpen: false,

			urls: [],
			refuse: false,
			agree: false,
			collected: false,
			collectedCount: 0,

			cacheAvatar: false,
			avatarSrc: null,
			myComment: "",
			userAvatar: "",
			followed: false,

			commentCount: 0,
			comments: [],
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
		truncateText(text, length = 30) {
			return text.length > length 
			? text.substring(0, length) + '...' 
			: text
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
				this.$emit('toAnswer', this.aid);
			}
		},
		truncateContent(text, length = 34) {
			let pure_text = this.extractText(text)
			return this.truncateText(pure_text, length)
		},
		extractText(htmlString) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(htmlString, 'text/html');
			return doc.body.textContent || '';
		},
		agreeFunc() {
			this.snackbar = true
			// this.$Axios({
            //     method: 'post',
            //     url: '/qaService/like/evaluateAnswer',
            //     params: {
			// 		answerId: this.aid,
			// 		isCancel: this.agree,
			// 		isLike: '0'
			// 	},
            // }).then(response => {
			// 	console.log(response)
            // }).catch(error => {
            //     console.error('评论失败:', error)
            // })

			if (this.agree) {
				this.snackerText = "已取消"
			} else {
				this.snackerText = "已赞同"
			}
			this.agree = !this.agree
		},
		refuseFunc() {
			this.snackbar = true

			// this.$Axios({
            //     method: 'post',
            //     url: '/qaService/like/evaluateAnswer',
            //     params: {
			// 		answerId: this.aid,
			// 		isCancel: this.refuse,
			// 		isLike: '1'
			// 	},
            // }).then(response => {
			// 	console.log(response)
            // }).catch(error => {
            //     console.error('评论失败:', error)
            // })

			if (this.refuse) {
				this.snackerText = "已取消"
			} else {
				this.snackerText = "已反对"
			}
			this.refuse = !this.refuse
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
			this.commentOpen = true
			this.commentWriteOpen = true
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
		},
		finishComment(success) {
			if (success) {
				this.commentCount += 1
			}
			this.commentWriteOpen = false
		},
		async getUserAvatar() {
            this.$Axios({
                method: 'get',
                url: '/userInfoService/getUserAllInfo',
                params: {},
            }).then((response) => {
                localStorage.setItem('userAvatar', response.data.msg.avatar)
				this.userAvatar = response.data.msg.avatar
            });
        },
		followUser() {
			if (this.followed) return;
			this.followed = true
			// TODO
		},
		fetchComment() {
			this.$Axios({
                method: 'get',
                url: '/comment/getComment',
                params: {
                    bindID: this.aid,
                    mainType: "ANSWER",
                    pageNum: 1,
                    commentCount: 6,	// 需要与CommentPopup中的itemsPerPage一致
                    replyCount: 2
                },
            }).then(response => {
                let data = response.data.msg.comments
                this.commentCount = response.data.msg.commentCount
				this.comments = [...this.comments, ...data]
            }).catch(error => {
                this.isLoading = false
                console.error('请求失败:', error)
            })
		},
		showComments() {
			this.commentOpen = true
			localStorage.setItem('comments', JSON.stringify(this.comments))
		},
		reloadComment() {

		}
    },
	created() {
		this.fetchComment()
		this.extractImageUrls(this.content)
		if (this.avatar.length > 0) {
			this.cacheAvatar = true
			this.avatarSrc = this.avatar.match(/\.(jpg|jpeg|png|gif|webp)$/i) 
				? this.avatar 
				: `${this.avatar}.jpg`;
		} else {
			this.cacheAvatar = false;
		}
		if (localStorage.getItem('userAvatar') == null) {
			this.getUserAvatar()
		} else {
			this.userAvatar = String(localStorage.getItem('userAvatar'))
		}
    }
  }
</script>

<style>
.custom-black-badge .v-badge__badge {
  color: rgba(0, 0, 0, 1) !important; /* 强制黑色 */
  mix-blend-mode: normal !important; /* 避免透明背景下的颜色混合异常 */
}

.html-container {
  width: 500px; /* 固定宽度 */
  max-width: 100%; /* 响应式：不超过父容器 */
  overflow: hidden; /* 防止内容溢出 */
}

.html-content img {
  max-width: 100%; /* 图片不超出容器 */
  height: auto;
}

</style>