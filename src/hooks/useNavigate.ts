import { ElMessage, ElMessageBox } from 'element-plus';



export default () => {

  // function navigateTo(e) {
  //   let dataset = e.currentTarget ? e.currentTarget.dataset : e;
  //   let { id, type } = dataset;
  //   if (type == 'openmodal') {
  //     thiz[id] = 'show';
  //   } else if (type == 'closemodal') {
  //     thiz[id] = '';
  //   } else if (type == 'page') {
     
  //   } else if (type == 'submit') {
  //     showToast('将执行表单提交动作');
  //   } else if (type == 'reset') {
  //     showToast('将执行表单重置动作');
  //   } else if (type == 'tip') {
  //     showToast(dataset.tip);
  //   } else if (typeof thiz[type] == 'function') {
  //     if (type.endsWith('Api')) {
  //       thiz[type]();
  //     } else {
  //       thiz[type](dataset);
  //     }
  //   } else {
  //     showToast(type + '类型有待实现');
  //   }
  // }
  
 
  function showToast(title:string) {
    ElMessage({
      message: title,
      type: 'info',
    })
  }

  return {
    
  }
}