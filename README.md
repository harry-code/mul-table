# react with vite2 typeScript
## 列表页 
1、列表页都是配置式，按照常规CRUD项目的研发，头部筛选通过配置formData这个数组，里面的对象字段分别为：label输入框名称，name字段名称，required是否必须，message提示语，type组件类型。columns按照antd正常的配置即可，只针对action进行配置按钮参数，按钮的权限只需要在columns action对象里面配置即可
## Form表单组件说明
1、Form表单组件结合antd表单元素渲染，渲染逻辑为JSON的映射。
2、formData参数说明：
    label: Form.item的label
    name: Form.item的name
    required: Form.item的rules required
    message: Form.item的rules message
    type: Form.item渲染表单组件的类型
3、getParams参数说明：获取表单值的函数
4、formStyle参数说明：form表单的布局等，默认垂直布局
5、formBtns参数说明：form表单按钮的渲染，内置tapType参数，指当前按钮的类型，用此来渲染按钮的type与事件的响应类型。

