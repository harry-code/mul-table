/* 
* 处理二进制数据流 下载文件
*/
const download = (data: any, filename: string, type = 'application/ynd.ms-excel;charset=UTF-8', fileType = 'xls') => {
    const Url = window.URL.createObjectURL(new Blob([data], { type }));
    const ele = document.createElement('a');
    ele.href = Url;
    ele.download = `${filename}.${fileType}`;
    document.querySelectorAll('body')[0].appendChild(ele);
    ele.click();

    setTimeout(() => {
        ele.remove();
    }, 1000);

}
/* 
* base64转码 返回file文件
*/
const base64ToFile = (url: string, fileName: string, type = 'image/png') => {
    const arry = url?.split(',');
    const baseStr = window.atob(arry[1]); // 解码成字符串
    let baseLen = baseStr.length
    const u8arry = new Uint8Array(baseLen); // 生成u8格式的数组
    while (baseLen--) {
        u8arry[baseLen] = baseStr.charCodeAt(baseLen)
    }
    return new File([u8arry], fileName, { type })
}

export {
    download,
    base64ToFile
}