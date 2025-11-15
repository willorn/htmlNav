const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'navigation-data.json');
const STATIC_ROOT = __dirname;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(STATIC_ROOT));

async function readNavigationData() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeNavigationData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function validateNavigationData(payload) {
  const errors = [];
  const MAX_TITLE_LENGTH = 100;
  const MAX_URL_LENGTH = 500;
  const MAX_DESCRIPTION_LENGTH = 200;
  const MAX_ICON_LENGTH = 5000;

  function isValidUrl(string) {
    try {
      const url = new URL(string);
      return ['http:', 'https:', 'ftp:', 'ftps:'].includes(url.protocol);
    } catch (_) {
      return false;
    }
  }

  function sanitizeSvg(svg) {
    if (!svg || typeof svg !== 'string') return '';
    return svg
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  if (!Array.isArray(payload)) {
    errors.push('根对象必须是数组');
    return { valid: false, errors };
  }

  if (payload.length > 50) {
    errors.push('分类数量不能超过50个');
  }

  payload.forEach((category, catIdx) => {
    if (!category || typeof category !== 'object') {
      errors.push(`第 ${catIdx + 1} 个分类不是对象`);
      return;
    }

    if (typeof category.title !== 'string' || !category.title.trim()) {
      errors.push(`第 ${catIdx + 1} 个分类缺少有效的 title`);
    } else if (category.title.length > MAX_TITLE_LENGTH) {
      errors.push(`第 ${catIdx + 1} 个分类标题长度不能超过${MAX_TITLE_LENGTH}字符`);
    }

    if (!Array.isArray(category.links)) {
      errors.push(`第 ${catIdx + 1} 个分类的 links 不是数组`);
      return;
    }

    if (category.links.length > 100) {
      errors.push(`第 ${catIdx + 1} 个分类的链接数量不能超过100个`);
    }

    category.links.forEach((link, linkIdx) => {
      if (!link || typeof link !== 'object') {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接不是对象`);
        return;
      }
      
      if (typeof link.title !== 'string' || !link.title.trim()) {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接缺少 title`);
      } else if (link.title.length > MAX_TITLE_LENGTH) {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接标题长度不能超过${MAX_TITLE_LENGTH}字符`);
      }
      
      if (typeof link.url !== 'string' || !link.url.trim()) {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接缺少 url`);
      } else if (link.url.length > MAX_URL_LENGTH) {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接URL长度不能超过${MAX_URL_LENGTH}字符`);
      } else if (!isValidUrl(link.url)) {
        errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接URL格式不合法`);
      }
      
      if (link.description && typeof link.description === 'string') {
        if (link.description.length > MAX_DESCRIPTION_LENGTH) {
          errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接描述长度不能超过${MAX_DESCRIPTION_LENGTH}字符`);
        }
      }
      
      if (link.icon && typeof link.icon === 'string') {
        if (link.icon.length > MAX_ICON_LENGTH) {
          errors.push(`分类 ${category.title} 的第 ${linkIdx + 1} 个链接图标长度不能超过${MAX_ICON_LENGTH}字符`);
        }
        link.icon = sanitizeSvg(link.icon);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

app.get('/api/navigation', async (req, res) => {
  try {
    const data = await readNavigationData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '无法读取 navigation 数据', detail: error.message });
  }
});

app.put('/api/navigation', async (req, res) => {
  const { valid, errors } = validateNavigationData(req.body);
  if (!valid) {
    return res.status(400).json({ message: '传入的数据格式不正确', errors });
  }

  try {
    await writeNavigationData(req.body);
    res.json({ message: '导航数据已保存' });
  } catch (error) {
    res.status(500).json({ message: '无法写入 navigation 数据', detail: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(STATIC_ROOT, 'mainPage.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
