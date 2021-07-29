/*
 * 引用类型拷贝
 */
const deepClone = (data: any) => {
    // array 与 object
    const target = Array.isArray(data) ? Object.assign([], data) : Object.assign({}, data);
    // 日期 与 正则
    // 避免日期被转为字符串
    if (data instanceof Date) {
        return new Date(data);
    }
    // 避免正则被忽略
    if (data instanceof RegExp) {
        return new RegExp(data.source, data.flags);
    }
    Object.keys(target).forEach((key: any) => {
        target[key] = (typeof data[key] === 'object' ? deepClone(data[key]) : data[key])
    });
    return target;
}

export {
    deepClone
}