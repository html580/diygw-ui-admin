import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';


export default () => {
    const router = useRouter()

    const navigeteTo = (e: any) => {
        let dataset = e.currentTarget ? e.currentTarget.dataset : e;
        let { type } = dataset;
        if ((type == 'page' || type == 'inner' || type == 'href') && dataset.url) {
            router.push({
                path: (dataset.url.startsWith("/")?'':'/') +dataset.url
            })
        } else {
            ElMessage.error('待实现点击事件');
        }
    }
    return {
        navigeteTo
    }
}