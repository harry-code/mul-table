/* 
时间格式化
*/

const formatDate = (date: any): string => {
    const _date = new Date(date);
    const cur_year = _date.getFullYear();
    const cur_month = _date.getMonth() + 1;
    const day = _date.getDate();
    const hour = _date.getHours();
    const minute = _date.getMinutes();
    const seconds = _date.getSeconds();
    return `${cur_year}年${cur_month}月${day}日 ${hour}:${minute}:${seconds}`;
}

export {
    formatDate
}