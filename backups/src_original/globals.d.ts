// CSS文件类型声明
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// globals.css 副作用导入声明
declare module './globals.css';