<template>
    <div class="tinymce-editor">
      <editor
        tinymceScriptSrc="/static/tinymce/tinymce.min.js"
        v-model="data"
        :init="init"
        :disabled="disabled"
      ></editor>
    </div>
    <diy-storage
      ref="storage"
      style="display: none"
      :limit="uploadConfig.limit"
      @confirm="getAttachmentFileList"
    ></diy-storage>
</template>

<script lang="ts">
import Editor from '@tinymce/tinymce-vue'
import {
  defineComponent,
  ref,
  reactive,
toRefs
} from "vue";
import { useVModel } from '@vueuse/core'
import DiyStorage from '@/components/upload/storage.vue'

export default defineComponent({
  name: 'DiygwEditor',
  components: {
    DiyStorage,
    Editor,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default:
        // 'lists image link media table textcolor wordcount contextmenu fullscreen',
        'lists image link media table wordcount fullscreen',
    },
    toolbar: {
      type: [String, Array],
      default:
        'code undo redo |  formatselect fontsizeselect bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link unlink storage table | removeformat | fullscreen',
      branding: false,
    },
    width: {
      type: [Number , String],
      default: 'auto',
    },
    height: {
      type: Number,
      default: 300,
    },
   },
   setup(props, { emit }) {
      const data = useVModel(props, 'modelValue', emit)
 
      const editorref = ref(null)

      const obj = reactive({

        uploadConfig: {
          limit: 1,
        },
      });

    const storage = ref(null);

    // 获取商品相册资源
    const getAttachmentFileList = (files) => {
      if (!files.length) {
        return;
      }
      const file = files[0];
      editorref.value.insertContent(`<img src='${file.url}'/>`);
    };
      const init = ref( {
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin: "CUSTOM",
        content_css: "CUSTOM",
        width: props.width,
        height: props.height,
        object_resizing: false,
        selector: 'tinymce-editor',
        cleanup : false,
        content_style: `
          *                   { padding:0; }
          html, body          { font-family:inherit; font-size:14px; line-height:inherit; }
          img                 { max-width:100%; display:block; height:auto; }
          a                   { text-decoration:none; }
          iframe              { width:100%; }
          p                   { line-height:1.6; }
          table               { word-wrap:break-word; word-break:break-all; max-width:100%;}
          .mce-object-iframe  { width:100%; box-sizing:border-box; padding:0; }
          ul,ol               { list-style-position:inside; }
        `,
        plugins: props.plugins,
        toolbar: props.toolbar,
        branding: false,
        menubar: false,
        toolbar_drawer: false,
        statusbar: false, // 隐藏底部状态栏
        // //预防xss攻击，同时不希望用户直接粘贴进来一些富文本,在你的 init 里面，添加以下属性
        // images_upload_handler: (blobInfo, success) => {
        //   let formData = new FormData()
        //   formData.append('file', blobInfo.blob(), blobInfo.filename())
        //   formData.append('biz', 'tmp')
        //   formData.append('teditor', '1')
        //   formData.append('type', 'image')
        // //   this.$axios.post('/storage/upload', formData).then((res) => {
        // //     if (res.code==200) {
        // //       if (res.message == 'local') {
        // //         const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        // //         success(img)
        // //       } else {
        // //         let img = res.data.url
        // //         success(img)
        // //       }
        // //     }
        // //   })
        // },
        setup: editor => {
          // 资源管理选取
          editor.ui.registry.addButton('storage', {
            tooltip: '从资源管理选取',
            icon: 'browse',
            onAction: function () {
                editorref.value=editor
                obj['uploadConfig']['limit'] = 1;
                storage.value.handleStorageDlg('image', 'data', '选择图片');
            }
         });
        }
      })
      return {
          storage,
          ...toRefs(obj),
          getAttachmentFileList,
          init,
          data
      }
  }
})
</script>
<style lang="scss" >
.tox-tinymce-aux{
    z-index: 999999 !important;
}
</style>