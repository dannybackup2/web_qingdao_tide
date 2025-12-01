# React Web 到 Taro 小程序转换指南

本文档说明了如何将原始React Web应用转换为微信小程序(Taro)版本。

## 转换概览

### 核心变化

#### 1. 框架替换
| 原始 | 转换后 |
|------|--------|
| React (Web) | Taro (跨端) |
| react-dom | @tarojs/taro |
| react-chartjs-2 | Canvas + 自定义图表库 |
| axios | Taro.request |

#### 2. 组件系统
- **HTML元素** → **Taro组件**
  - `<div>` → `<View>`
  - `<h1>` → `<Text>`
  - `<img>` → `<Image>`
  - `<canvas>` → `<Canvas>`
  
#### 3. 样式系统
- **CSS Modules** 保留使用（但可能需要适配）
- **SCSS** 继续支持
- **内联样式** → **CSS类**（已转换）
- **REM单位** 自动转换（由Taro处理）

#### 4. API调用
```typescript
// 原始方式
axios.get(url)

// Taro方式
Taro.request({ url, method: 'GET' })
```

#### 5. 生命周期
```typescript
// React Hooks (继续使用)
useEffect(() => {
  // 初始化逻辑
}, [])

// Taro Page Lifecycle (自动处理)
// onLoad, onShow, onHide, onUnload
```

## 详细转换说明

### 1. 项目入口

**原始 (src/index.tsx)**
```typescript
import ReactDOM from "react-dom";
import App from "./pages/index";

ReactDOM.render(<App />, document.getElementById("root"));
```

**转换后 (src/app.ts + src/app.config.ts)**
```typescript
// app.ts
class App extends Component {
  render() {
    return this.props.children;
  }
}

// app.config.ts
export default {
  pages: ['pages/index/index'],
  window: { /* ... */ }
}
```

### 2. 页面组件

**原始**
```typescript
const IndexPage: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <h1>标题</h1>
    </div>
  );
}
```

**转换后**
```typescript
const IndexPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>标题</Text>
    </View>
  );
}
```

### 3. 图表绘制

**原始 (Chart.js + react-chartjs-2)**
- 使用第三方图表库
- 依赖浏览器DOM

**转换后 (Canvas + 自定义渲染器)**
- 使用原生Canvas API
- 实现了 `TideChartRenderer` 类
- 自定义绘制逻辑

```typescript
const renderer = new TideChartRenderer(data, config);
renderer.drawChart(ctx);
```

### 4. 数据获取

**原始**
```typescript
const response = await axios.get(url);
```

**转换后**
```typescript
const response = await Taro.request({
  url,
  method: 'GET',
  dataType: 'json'
});
```

### 5. 图片处理

**原始**
```typescript
<img src="/images/shilaoren.jpg" />
```

**转换后**
```typescript
<Image src="/images/shilaoren.jpg" mode="aspectFill" />
```

### 6. 样式转换

**原始 (内联样式)**
```typescript
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  margin: '32px 0'
}}>
```

**转换后 (CSS Modules)**
```typescript
<View className={styles.container}>

// index.module.scss
.container {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
}
```

## 文件映射

```
src (Web)              →  miniApp/src (Taro)
├── pages/index.tsx    →  pages/index/index.tsx
├── components/
│   └── TideChart.tsx  →  components/TideChart/index.tsx
├── utils/
│   ├── fetchTideData  →  utils/fetchTideData.ts
│   ├── helpers        →  utils/helpers.ts
│   └── canvasChart    →  utils/canvasChart.ts (新增)
├── api/
│   └── openMeteo.ts   →  api/openMeteo.ts
├── types/
│   ├── tide.ts        →  types/tide.ts
│   └── lunar...d.ts   →  types/lunar-javascript.d.ts
└── styles.css         →  app.scss (全局)
```

## 主要改进

1. **图表性能**: 自定义Canvas渲染器，更适合小程序环境
2. **包体积**: 移除Chart.js, react-dom等，减小体积
3. **适配性**: Taro处理iOS/Android的差异
4. **开发效率**: 保留React编程模式，学习成本低

## 构建和部署

### 开发
```bash
npm run dev:weapp
```

### 生产构建
```bash
npm run build:weapp
```

### 输出位置
```
dist/weapp/  # 微信小程序代码
dist/h5/     # H5预览版本
```

## 需要的配置

1. **微信小程序APPID**: 修改 `project.config.json`
2. **网络白名单**: 添加 `https://marine-api.open-meteo.com`
3. **图片资源**: 上传到小程序服务器或CDN

## 性能优化建议

1. **数据缓存**: 使用 Taro.storage 缓存潮汐数据
2. **图表缓存**: 缓存绘制的Canvas
3. **分页加载**: 大数据量时使用虚拟列表
4. **图片压缩**: 压缩摄像头图像

## 常见问题

### Q: 为什么移除了Chart.js?
A: Chart.js在小程序中不支持，自定义Canvas渲染器提供更好的性能和控制。

### Q: 样式会自动转换吗?
A: REM单位会自动转换，但建议统一使用px或em。

### Q: 可以继续使用axios吗?
A: 不推荐，使用Taro.request获得更好的小程序集成。

### Q: 如何调试?
A: 使用微信开发者工具打开 `dist/weapp/` 目录进行调试。

## 后续优化

- [ ] 添加离线数据支持
- [ ] 实现数据预加载
- [ ] 优化Canvas性能
- [ ] 添加分享功能
- [ ] 支持深链接
