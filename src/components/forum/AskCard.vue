<template>
  <v-card elevation="2" class="ask-card">
    <!-- 顶部导航栏 -->
    <div class="ask-card-toolbar">
      <v-btn icon @click="$emit('close')" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span class="ask-card-title">提问</span>
      <v-btn text color="primary" @click="publish" class="publish-btn">
        发布
      </v-btn>
    </div>
    <!-- <div id="app">
      <quill-editor
        v-model="content"
        :options="editorOptions"
        style="height: 300px"
      />
      <div>
        <h3>内容预览：</h3>
        <div v-html="content"></div>
      </div>
    </div> -->


    <!-- 标题输入 -->
    <input
        v-model="title"
        class="title-input"
        placeholder="输入问题标题，并以问号结尾（必填）"
        @blur="checkTitle"
        @input="onTitleInput"
        ref="titleInput"
    />

    <!-- 分割线 -->
    <hr class="divider" />

    <!-- 富文本编辑器 -->
    <div class="editor-container">
      <div ref="editorContent"></div>
      <div class="editor-toolbar">
        <v-btn icon @click="openImageDialog" class="editor-btn">
            <v-icon small>mdi-image</v-icon>
        </v-btn>
      </div>
    </div>


    <!-- 图片上传对话框 -->
    <v-dialog v-model="imageDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">上传图片</v-card-title>
        <v-card-text>
            <v-file-input
                v-model="imageFile"
                label="选择图片"
                accept="image/*"
                />
                <!-- @change="uploadImage" -->
        </v-card-text>
        <v-card-actions>
            <v-btn text @click="imageDialog = false">取消</v-btn>
            <!-- <v-btn color="primary" @click="imageDialog = false">上传</v-btn> -->
            <v-btn color="primary" @click="confirmUpload">上传</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

export default {
  name: 'AskCard',
  emits: ['close'],
  setup() {
    // const content = ref('');
    // const editorOptions = {
    //   placeholder: '请输入内容...',
    //   theme: 'snow',
    // };

      const title = ref('');
      const editorContent = ref(null);
      const editor = ref(null);
      const imageDialog = ref(false);
      const imageFile = ref(null);
      const titleInput = ref(null);

      onMounted(() => {
        editorContent.value.setAttribute("contenteditable", "true");
        editor.value = new Editor({
          element: editorContent.value,
          extensions: [
              StarterKit,
              Image,
              Placeholder.configure({
                placeholder: '请输入您的问题描述...',
              })
          ],
          content: '',
          editable: true,
        });
      });

      const checkTitle = () => {
        if (title.value && !title.value.trim().endsWith("？") && !title.value.trim().endsWith("?")) {
          title.value = title.value.trim() + "？";
        }
      };

      const onTitleInput = () => {
        if (title.value.trim().endsWith('?')) {
          setTimeout(() => {
            editor.value.chain().focus().run();
          }, 100);
        }
      };

      const openImageDialog = () => {
        imageDialog.value = true;
      };

      // const uploadImage = () => {
      //   if (imageFile.value) {
      //     const reader = new FileReader();
      //     reader.onload = (e) => {
      //         const imageUrl = e.target.result;
      //         editor.value.chain().focus().setImage({ src: imageUrl, alt: '上传图片' }).run();
      //         imageFile.value = null;
      //         // editor.value.commands.setImage({ src: imageUrl, alt: '上传图片' });
      //     };
      //     reader.readAsDataURL(imageFile.value);
      //   }
      // };
      const confirmUpload = () => {
        if (!imageFile.value) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          editor.value.chain().focus().setImage({ 
            src: imageUrl, alt: '上传图片'
           }).run();
          imageFile.value = null;
          // 关闭对话框
          imageDialog.value = false;
        };
        reader.readAsDataURL(imageFile.value);
        console.log("上传成功")
      };

      const publish = () => {
        const content = editor.value.getHTML();
        if (!title.value) {
          alert('请填写标题');
          return;
        }
        // TODO: 调用发布 API
        console.log('发布内容：', { title: title.value, content });
        alert('发布成功！');
      };

      return {
          title,
          editorContent,
          checkTitle,
          onTitleInput,
          openImageDialog,
          imageDialog,
          imageFile,
          confirmUpload,
          editor,
          titleInput,
          publish,
      //     content,
      // editorOptions,
      };
  },
};
</script>

<style scoped>
.ask-card {
  max-width: 100%;
  margin: 10px auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  background-color: #fff;
}

.ask-card-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 2px;
}

.ask-card-title {
  font-size: 16px;
  font-weight: 500;
}

.close-btn {
  color: #616161;
}

.publish-btn {
  font-weight: bold;
}

.title-input {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 14px;          /* 去掉内边距 */
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 4px 12px;
}

.editor-container {
  min-height: 250px;
  border: none;
  padding: 4px 14px;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}
.editor-container div[contenteditable="true"] {
  outline: none;     /* 去掉选中时的轮廓 */
  border: none;
  box-shadow: none;
  padding: 8px 0;
}

.editor-container p {
  margin: 6px 0;
}

.editor-toolbar {
  /* position: fixed; */
  bottom: 0; /* 初始底部对齐 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background-color: #fff;
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  z-index: 1000;
  transition: bottom 0.2s ease;
}

.editor-btn {
  color: #616161;
  transition: color 0.2s ease;
}

.editor-btn:hover {
  color: #1976d2;
}
/* 
#app {
  max-width: 800px;
  margin: 20px auto;
} */
</style>
