<template>
    <div class="ask-card">
      <!-- 顶部导航栏 -->
      <div class="ask-card-toolbar">
        <v-btn icon @click="$emit('close', { shouldRefreshAnswer: true })" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <span class="ask-card-title">{{ this.answerId ? '编辑回答' : '写回答' }}</span>
        <v-btn color="primary" @click="publish" class="publish-btn" :disabled="!this.html.trim()">
            发布
        </v-btn>
      </div>
    
      <!-- 问题标题展示 -->
      <div class="title-input">
        {{ questionTitle }}
      </div>
      
      <!-- 分割线 -->
      <hr class="divider" />
    
      <div class="editorarea">
        <!-- <div>
          <button @click="printEditorHtml">print html</button>
          <button @click="getEditorText">print text</button>
        </div> -->
        <div style="border: 1px solid #ccc; margin-top: 10px">
          <!-- 工具栏 -->
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
          />
          <!-- 编辑器 -->
          <Editor
            style="height: 600px; overflow-y: hidden"
            :defaultConfig="editorConfig"
            v-model="html"
            @onChange="onChange"
            @onCreated="onCreated"
          />
        </div>
        <!-- <div style="margin-top: 10px">
          <textarea
            v-model="html"
            readonly
            style="width: 100%; height: 200px; outline: none"
          ></textarea>
        </div> -->
      </div>
    </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { baseURL } from '../../config.js';

export default {
  name: 'AnswerCard',
  props: {
    questionId: {
      type: [String, Number],
      default: null,
    },
    questionTitle: {
      type: String,
      required: true,
    },
    answerId: {
      type: [String, Number],
      default: null,
    },
    answerContent: {
      type: String,
      default: null,
    },
  },
  emits: ['close'],
  components: { Editor, Toolbar },
  data() {
    const vm = this;
    return {
      imageDialog: false,
      imageFile: null,

      html: this.answerContent || '',
      editor: null,
      toolbarConfig: {
        excludeKeys: [
          "insertVideo", "group-video", "uploadVideo", "video"
        ]
      },
      editorConfig: {
        placeholder: "输入图文回答内容",
        MENU_CONF: {
          uploadImage: {
            // 用 function 而不是箭头，这样 this 指向组件实例
            async customUpload(file, insertFn) {
              // 这里的 this 就是当前组件实例
              console.log("customUpload 里 this:", vm);
              const url = await vm.uploadImageAPI(file);
              if (url) {
                insertFn(url, '', '');
              } else {
                console.error('图片上传失败');
              }
            },
            allowedFileTypes: ['image/*']
          }
        },
      },
    }
  },
  async mounted() {
    // console.log(this.questionId)
    // console.log(this.initialTitle)
  },
  // beforeUnmount() {
  //   if (this.editor) {
  //     this.editor.destroy()
  //     this.editor = null
  //   }
  // },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
  watch: {
    // 如果 answerContent 是异步传入的，要等它变更后再塞给编辑器
    answerContent(newVal) {
      // 如果编辑器已经创建，直接 setHtml；否则先保存到 html，后续 onCreated 里会渲染
      if (this.editor) {
        this.editor.setHtml(newVal || '');
      } else {
        this.html = newVal || '';
      }
    }
  },
  methods: {
    async uploadImageAPI(file) {
      if (!file) {
        this.$toast.fail('请选择要上传的图片');
        return null;
      }
      const maxSize = 10 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        this.$toast.fail('图片不能超过10MB');
        return null;
      }
      if (!file.type.startsWith('image/')) {
        this.$toast.fail('只允许上传图片');
        return null;
      }
      const formData = new FormData();
      formData.append('uploadFile', file);
      try {
        const response = await this.$Axios.post('/qaService/qaFile/uploadFile',
          formData,
        );
        if (response.data.state === 'SUCCESS') {
          const { fileName, fileSuffix } = response.data.msg;
          const url = baseURL + `/qaService/qaFile/downloadFile/${fileName}${fileSuffix}`;
          this.$toast.success('图片上传成功');
          return url;
        } else {
          this.$toast.fail(response.data.msg || '图片上传失败');
          return null;
        }
      } catch (err) {
        console.error(err);
        this.$toast.fail('上传图片失败');
        return null;
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      // console.log("onChange", editor.getHtml()); // onChange 时获取编辑器最新内容
    },
    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getText()); // 执行 editor API
    },
    printEditorHtml() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getHtml()); // 执行 editor API
    },

    async publish() {
      if (!this.html.trim()) {
        this.$toast.fail("请填写回答内容");
        return;
      }
      if (this.answerId) {
        this.$Axios({
          method: 'PUT',
          url: '/qaService/answer/update',
          params: {
            answerId : this.answerId,
            content: this.html,
          },
        })
        .then(response => {
          const data = response.data;
          if (data.state === "SUCCESS") {
            this.$toast.success('更新成功！');
            this.$emit('close', { shouldRefreshAnswer: true });
          } else {
            this.$toast.fail(data.msg || '更新失败');
          }
        })
        .catch(err => {
          console.error('更新异常', err);
          this.$toast.fail('更新失败，请重试');
        });
      }
      else {
        const formData = new FormData();
        formData.append('answer', this.html);
        this.$Axios({
          method: 'POST',
          url: '/qaService/answer/submit',
          params: {
            questionId: this.questionId,
          },
          data: formData,
        })
        .then(response => {
          const data = response.data;
          if (data.state === "SUCCESS") {
            this.$toast.success('发布成功！');
            // 传递新创建的回答ID
            this.$emit('close', { shouldRefreshAnswer: true, newAnswerId: data.msg });
          } else {
            this.$toast.fail(data.msg || '发布失败');
          }
        })
        .catch(err => {
          console.error('发布异常', err);
          this.$toast.fail('发布失败，请重试');
        });
      }
    },
  },
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
.ask-card {
  max-width: 100%;
  margin: 0px auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* padding: 10px 15px; */
  display: flex;
  flex-direction: column;
  height: 100vh;      /* 整个视口高度 */
  background-color: #fff;
}

.ask-card-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  /* border-bottom: 1px solid #e0e0e0; */
  /* background-color: #f9f9f9; */
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px 3px;
  padding-right: 10px;
}

.ask-card-title {
  font-size: 15px;
  font-weight: 500;
}

.close-btn {
  color: #616161;
  height: 40px !important; /* 确保和发布按钮一致 */
  width: 40px !important;
}

.publish-btn {
  font-size: 13px !important;
  border-radius: 13px !important;
  height: 26px !important;
  min-width: 55px !important;
  align-items: center;
  justify-content: center;
  padding-left: 10px !important;
  padding-right: 10px !important;
  transition: background-color 0.3s ease;
}

.title-input {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 17px;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 4px 17px;
}
.editorarea {
  padding: 4px 15px;
}    
</style>
