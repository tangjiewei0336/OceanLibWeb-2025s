<template>
    <div class="ask-card">
      <!-- 顶部导航栏 -->
      <div class="ask-card-toolbar">
        <v-btn icon @click="$emit('close')" class="close-btn">
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
            style="height: 900px; overflow-y: hidden"
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
  },
  emits: ['close'],
  components: { Editor, Toolbar },
  data() {
    const vm = this;
    return {
      imageDialog: false,
      imageFile: null,

      html: "",
      editor: null,
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: "输入图文回答内容",
        MENU_CONF: {
          uploadImage: {
            // 不指定 server，走 customUpload
            // server: '',
            maxNumberOfFiles: 1,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            // 自定义上传：把 file 读成 DataURL，再插入
            // customUpload(file, insertImgFn) {
            //   const reader = new FileReader();
            //   reader.onload = e => {
            //     const dataUrl = e.target.result;
            //     // 用编辑器提供的回调插入图片
            //     insertImgFn(dataUrl);
            //   };
            //   reader.readAsDataURL(file);
            // },
            async customUpload(file, insertImgFn) {
              // 1. 构造表单
              const form = new FormData();
              form.append('file', file);

              // 这里的 this 就是组件实例
              vm.$Axios({
                method: 'post',
                url: '/api/upload/image',
                data: form,
              })
              .then(resp => {
                insertImgFn(resp.data.data.url);
                vm.$toast.success('上传成功');
              })
              .catch(err => {
                console.error(err);
                vm.$toast.fail('上传失败');
              });
            },
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
  methods: {
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
      console.log(this.title)
      console.log(content)
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
          if (data.code === 0) {
            this.$toast.success('更新成功！');
            this.$emit('close');
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
        this.$Axios({
          method: 'POST',
          url: '/qaService/answer/submit',
          params: {
            questionId: this.questionId,
          },
          data: {
            answer: this.html,
          }
        })
        .then(response => {
          const data = response.data;
          if (data.code === 0) {
            this.$toast.success('发布成功！');
            this.$emit('close');
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
