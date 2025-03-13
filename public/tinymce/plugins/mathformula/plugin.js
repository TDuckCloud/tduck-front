tinymce.PluginManager.add('mathformula', function(editor) {

  const katexConfig = {
    cssUrl: editor.getParam('katex_css_url', 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.11/katex.min.css'),
    jsUrl: editor.getParam('katex_js_url', 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.11/katex.min.js')
  };
  loadKaTeX(katexConfig);

  editor.ui.registry.addButton('mathformula', {
    icon: 'mathformula',
    tooltip: '插入数学公式',
    onAction: function() {
      openDialog(editor);
    }
  });

  function loadKaTeX(katexConfig) {
    // 检查 KaTeX CSS 是否已加载
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';  // 设置 ID
      link.rel = 'stylesheet';
      link.href = katexConfig.cssUrl;  // 从配置项获取 CSS 地址
      document.head.appendChild(link);
    }

    // 检查 KaTeX JS 是否已加载
    if (!document.getElementById('katex-js')) {
      const script = document.createElement('script');
      script.id = 'katex-js';  // 设置 ID
      script.src = katexConfig.jsUrl;  // 从配置项获取 JS 地址
      script.onload = () => {
        // 这里可以添加任何需要在 KaTeX 加载后执行的代码
      };
      document.head.appendChild(script);
    }
  }

  function openDialog(editor) {
    editor.windowManager.open({
      title: '插入数学公式',
      size: 'large',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: `
              <div class="formula-section-reference">
                <a href="https://www.latexlive.com/home##" target="_blank" class="latex-reference-link">
                  LaTeX公式参考
                </a>
              </div>
            `
          },
          {
            type: 'textarea',
            name: 'formula',
            label: '',
            placeholder: '在此输入 LaTeX 公式，例如: E = mc^2',
            autofocus: true
          },
          {
            type: 'htmlpanel',
            html: `
              <div class="formula-section">
                <div class="formula-preview-title">预览</div>
                <div class="katex-preview-wrapper">
                  <div id="formula-preview" class="preview-placeholder">输入 LaTeX 公式在此查看预览</div>
                </div>
              </div>
            `
          }
        ]
      },
      buttons: [
        {
          type: 'cancel',
          text: '取消'
        },
        {
          type: 'submit',
          text: '确定',
          primary: true
        }
      ],
      onSubmit: function(api) {
        const formula = api.getData().formula;
        if (!formula.trim()) {
          api.close();
          return;
        }
        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
            displayMode: true
          });

          editor.insertContent(
            `<span class="math-formula" contenteditable="false">${html}</span>`
          );
        } catch (e) {
          console.error('KaTeX rendering error:', e);
        }

        api.close();
      },
      initialData: {
        formula: ''
      },
      onChange: function(api) {
        const data = api.getData();
        const formula = data.formula;
        const previewEl = document.getElementById('formula-preview');

        if (!formula.trim()) {
          previewEl.innerHTML = '<span class="preview-placeholder">公式预览区域</span>';
          return;
        }

        try {
          // 渲染公式
          katex.render(formula, previewEl, {
            throwOnError: false,
            displayMode: true
          });
        } catch (e) {
          previewEl.innerHTML = '<span class="preview-error">公式语法错误</span>';
        }
      }
    });
  }

  return {
    getMetadata: function() {
      return {
        name: '数学公式插件',
        url: 'https://your-domain.com'
      };
    }
  };
});
