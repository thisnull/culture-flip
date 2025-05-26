下面是一份**整合式文档**，覆盖了我们到目前为止讨论的全部需求、技术选型、部署流程与后续扩展提示。

* 如果你想直接覆盖 `README.md`，即可整段拷贝进去；
* 若更偏好把主仓库介绍保持精简，可将本文件保存为 `docs/DEV_GUIDE.md` 或 `DEPLOYMENT.md`，并在 `README.md` 里放一个链接即可。

---

# Culture Flip — 技术与部署指南

> 让孩子在 iPad 上翻卡学习中华文化的零后端小站
> Bilingual · Static Web · Privacy–First

---

## 目录

1. [项目目标](#项目目标)
2. [功能与需求清单](#功能与需求清单)
3. [技术栈与目录结构](#技术栈与目录结构)
4. [内容制作规范](#内容制作规范)
5. [品牌与 Logo 指南](#品牌与-logo-指南)
6. [隐私与法规合规](#隐私与法规合规)
7. [本地开发流程](#本地开发流程)
8. [部署到 GitHub Pages + GoDaddy](#部署到-github-pages--godaddy)
9. [未来扩展路线](#未来扩展路线)
10. [许可](#许可)

---

## 项目目标

* **游戏化学习**：用逐题翻卡交互，让孩子在碎片时间学习中国历史、地理、饮食、节庆等。
* **中英双语**：每张卡片同屏显示中英文问题与答案。
* **零后端**：首版仅加载本地 `questions.json`，无需注册或数据库。
* **隐私友好**：不收集个人信息，仅在浏览器 `localStorage` 保存做题进度。
* **易部署 / 易扩展**：静态托管在 GitHub Pages，下阶段可平滑升级 PWA、错题本或云函数。

---

## 功能与需求清单

| 分类    | MVP 需求                                    | 备注                      |
| ----- | ----------------------------------------- | ----------------------- |
| 卡片交互  | 点按 / 轻扫翻转，正面显示题目，背面显示答案                   | CSS 3D Transform        |
| 题库    | ≥ 200 道题，覆盖 10 大主题；中英文本                   | 维护于 `questions.json`    |
| 主题 UI | 自有品牌：**Culture Flip**；使用中国结 + 卡片翻页动势 Logo | 配色、字体符合中国文化 |
| 响应式   | 针对 iPad 竖屏优化；宽度 320 px 卡片；暗/亮模式           |                         |
| 无账号   | 不登录、不收邮箱；仅用 `localStorage` 缓存已做题 ID       |                         |
| 部署    | GitHub Pages + 自有域名；HTTPS                 | DNS 在 GoDaddy           |
| 合规    | 隐私声明（COPPA / GDPR / CCPA “不收集” 路径）        | `privacy.html`          |
| 未来    | PWA 离线、错题重练、排行榜、Supabase 后端               | 非 MVP                   |

---

## 技术栈与目录结构

```
culture-flip/
│
├─ index.html          # 单页入口
├─ style.css           # 样式 + Flip 动画
├─ main.ts             # TypeScript 源码
├─ main.js             # 预编译 JS（供 GitHub Pages 直接运行）
├─ questions.json      # 题库（UTF-8，含 ZH/EN）
│
├─ logo.svg            # 中国结 × 卡片 Logo
├─ privacy.html        # 隐私与合规声明
├─ README.md           # 项目简介
└─ docs/DEV_GUIDE.md   # ←（可选）本文件
```

仓库已附带 `pnpm` 脚本，使用 `tsc --outFile` 将 `main.ts` 转译为浏览器可执行的 `main.js`。
如果希望保持“零依赖”，直接编辑 `main.ts` 后执行 `pnpm run build` 即可。

---

## 内容制作规范

| 字段            | 示例                                                             | 说明          |
| ------------- | -------------------------------------------------------------- | ----------- |
| `id`          | `HIS_001`                                                      | 主题缩写 + 递增编号 |
| `category`    | `history`                                                      | 分类 / tag    |
| `question.zh` | “「丝绸之路」最早开辟于哪个朝代？”                                             | 简体中文        |
| `question.en` | “During which Chinese dynasty was the Silk Road first opened?” | 对应英文        |
| `answer.zh`   | “西汉（汉武帝时期）”                                                    | 中文答案        |
| `answer.en`   | “Western Han (Emperor Wu)”                                     | 英文答案        |

> * 尽量短句，保持一屏内可读。
> * 避免版权受限文本；历史事实、通用知识均可自由使用。
> * 图片（若后期加入）须为 CC0 / 自制 / 已获授权素材。

---

## 品牌与 Logo 指南

| 元素   | 设计要点                                                   |
| ---- | ------------------------------------------------------ |
| 名称   | **Culture Flip**（避免使用 “Quest／Brain／Smart Cards” 等易混淆词） |
| Logo | 红色中国结四向延展 + 斜置双层卡片；SVG 纯矢量，方便缩放                        |
| 主色   | `#d7263d`（中国红） + `#ffffff`（卡片白）                        |
| 字体   | 系统默认无衬线；标题可替换为自行托管的书法体 / Google Noto Serif SC          |
| 视觉差异 | 不使用 Brain Quest 的黄色条带、圆角方块排版或常规字体组合                    |

---

## 隐私与法规合规

* **不收集个人信息**

  * 无账号、无表单、无 Cookie 追踪。
  * 仅 `localStorage` 保存做题进度，停留在本地设备。
* **托管日志**

  * GitHub Pages 仅保留最小化 IP/UA 日志 ≤ 7 天，用于安全防护。
* **COPPA 合规**

  * 无数据收集 ⇒ 无需家长同意流程。
* **GDPR / CCPA**

  * 不处理可识别数据 ⇒ 不触发数据主体权利。
* **声明**

  * 详见 `privacy.html`，并在首页 footer 链接。

---

## 本地开发流程

```bash
# 1. 克隆仓库
git clone https://github.com/<username>/culture-flip.git
cd culture-flip

# 2. 可选：安装依赖做 TypeScript 校验
pnpm install

# 3. 编译 TS -> JS
pnpm run build      # 相当于 tsc --outFile main.js main.ts

# 4. 本地预览
npx http-server -c-1 .
```

修改 `questions.json` 后刷新即可；若想热更新可使用 `vite` 或类似工具，后续再引入。

---

## 部署到 GitHub Pages + GoDaddy

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: initial MVP"
   git push origin main
   ```
2. **启用 Pages**

   * Repo → **Settings → Pages**
   * Source: `Deploy from a branch` (`main` / `/root`)
3. **绑定域名**

   * 在 Pages “Custom domain” 输入 `cards.<yourdomain>.com`
   * 按提示在 GoDaddy DNS 添加：

     * **CNAME**：`cards → <username>.github.io`
       *或* 四条 **A 记录**：`185.199.108/109/110/111.153`
4. **验证 & HTTPS**

   * 点击 **Verify**，生效后勾选 **Enforce HTTPS**
   * Let’s Encrypt 自动签发证书
5. **完成**

   * 打开 `https://cards.<yourdomain>.com` 查看站点

> GitHub Pages 免费配额对个人项目足够：流量软限 ≈ 100 GB/月。

---

## 未来扩展路线

| 阶段      | 目标          | 技术方向                                                          |
| ------- | ----------- | ------------------------------------------------------------- |
| **PWA** | 离线访问、添加到主屏幕 | `service-worker` 缓存静态资源；`manifest.json`                       |
| 错题本     | 统计答错题目并重练   | IndexedDB；或接入 Supabase KV / Postgres                          |
| 排行榜     | 家庭成员 PK     | 轻量云函数 (Cloudflare Workers) + Supabase Auth                    |
| 内容管理    | 可视化编辑题库     | 将 `questions.json` 拆分为 CMS 数据源（如 Astro + Content Collections） |
| 多语言     | 新增繁体 / 日文等  | i18n JSON + 动态切换                                              |

---

## 许可

* **代码**：MIT License
* **题库内容**：除已在公域的事实信息外，原创文本版权归本项目所有，遵循 CC-BY-4.0。
* **使用**：欢迎 fork / 二次创作，但请保留版权与许可声明。

---

*End of document*
