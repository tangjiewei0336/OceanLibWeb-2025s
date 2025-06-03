<template>
	<v-card flat class="custom-radius">
		<v-textarea
			v-model="myComment"
			auto-grow
			solo
			flat
			rows="1"
			:placeholder="'回复 ' + uid"
			hide-details
			class="ma-2 no-border"
		></v-textarea>

		<v-card-actions 
			class="justify-end grey lighten-4 px-2 rounded"
			style="height: 40px"
		>
			<v-btn
				text
				class="primary--text"
				:disabled="!myComment.trim()"
				@click="toComment"
			>
				发布
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	name: 'CommentWrite',
	data() {
		return {
			myComment: ''
		}
	},
	props: {
		uid: {
			type: String,
			require: true
		},
		aid: {
			type: Number,
			require: true
		},
		interface: {
			type: String,
			require: true
		},
		cid: {
			type: String,
			default: ''
		},
		rid: {
			type: String,
			default: ''
		}
	},
	methods: {
		toComment() {
			let params;
			if (this.interface == "level1") {
				params = {
					bindID: this.aid,
					mainType: "ANSWER",
					isReply: false,
					commentContent: this.myComment,
				}
			} else if (this.interface == "level2") {
				params = {
					bindID: this.aid,
					mainType: "ANSWER",
					isReply: true,
					commentContent: this.myComment,
					replyInCommentID: this.cid,
					replyToCommentReplyID: this.cid,
				}
			} else {
				params = {
					bindID: this.aid,
					mainType: "ANSWER",
					isReply: true,
					commentContent: this.myComment,
					replyInCommentID: this.cid,
					replyToCommentReplyID: this.rid,
					replyToCommentReplier: this.uid
				}
			}

			this.$Axios({
                method: 'post',
                url: '/comment/addComment',
                params: params,
            }).then(response => {
                console.log("comment: ", response)
				this.myComment = ""
            }).catch(error => {
                console.error('评论失败:', error)
				this.myComment = ""
            })
			this.$emit('close')
		},
	}
}
</script>

<style scoped>
.custom-radius {
  border-radius: 15px !important;
}
.no-border {
  border: none !important;
  box-shadow: none !important;
}
</style>