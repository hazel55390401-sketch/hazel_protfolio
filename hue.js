/* ============================================
   Hue — Septiembre-inspired interactions
   Loading / Cursor / Menu / Split-words / Accordion
   ============================================ */

(function () {
  'use strict';

  /* ==========================================
     1. Loading screen
     ========================================== */
  function initLoader() {
    var loader = document.getElementById('loader');
    var progress = document.getElementById('loading-progress');
    if (!loader || !progress) return;

    var count = 0;
    var target = 100;
    var speed = 20; // ms per tick
    var increment = 2;

    function tick() {
      count = Math.min(count + increment, target);
      progress.textContent = count;

      if (count < target) {
        // Slow down near the end
        if (count > 70) increment = 1;
        if (count > 85) speed = 50;
        if (count > 95) speed = 100;
        setTimeout(tick, speed);
      } else {
        // Done — fade out
        setTimeout(function () {
          loader.classList.add('loaded');
          // Start hero animation
          animateHero();
          // Remove loader after transition
          setTimeout(function () {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
          }, 600);
        }, 300);
      }
    }

    // Small initial delay
    setTimeout(tick, 200);
  }

  /* ==========================================
     2. Custom cursor
     ========================================== */
  function initCursor() {
    var wrapper = document.getElementById('wrapper-cursor');
    if (!wrapper || window.innerWidth < 1025) return;

    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hover elements update cursor style
    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest('[data-cursor-style]');
      if (target) {
        var style = target.getAttribute('data-cursor-style');
        wrapper.setAttribute('data-cursor-style', style);
      }
    });

    document.addEventListener('mouseout', function (e) {
      var target = e.target.closest('[data-cursor-style]');
      if (target) {
        wrapper.setAttribute('data-cursor-style', 'default');
      }
    });

    // Expand cursor on images
    document.querySelectorAll('.container-img, .project-card, .project-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        wrapper.querySelector('.cursor-dot').style.width = '28px';
        wrapper.querySelector('.cursor-dot').style.height = '28px';
        wrapper.querySelector('.cursor-dot').style.background = 'transparent';
        wrapper.querySelector('.cursor-dot').style.border = '1.5px solid var(--color-paper)';
      });
      el.addEventListener('mouseleave', function () {
        wrapper.querySelector('.cursor-dot').style.width = '10px';
        wrapper.querySelector('.cursor-dot').style.height = '10px';
        wrapper.querySelector('.cursor-dot').style.background = 'var(--color-paper)';
        wrapper.querySelector('.cursor-dot').style.border = 'none';
      });
    });

    // Magnetic effect on images and cards
    document.querySelectorAll('.project-card .container-img, .accordion-content .container-img, .gallery-wrapper .container-img').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var img = el.querySelector('img');
        if (img) {
          img.style.transition = 'transform 0.15s linear';
          img.style.transform = 'translate(' + (x * 12) + 'px, ' + (y * 12) + 'px) scale(1.04)';
        }
      });
      el.addEventListener('mouseleave', function () {
        var img = el.querySelector('img');
        if (img) {
          img.style.transition = 'transform 0.5s var(--ease-spring)';
          img.style.transform = 'translate(0, 0) scale(1)';
        }
      });
    });

    // Smooth follow with spring feel
    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      wrapper.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
      requestAnimationFrame(updateCursor);
    }

    updateCursor();
  }

  /* ==========================================
     4. Split-words animation
     ========================================== */
  function initSplitWords() {
    var elements = document.querySelectorAll('.split-words');

    elements.forEach(function (el) {
      var text = el.textContent.trim();
      var words = text.split(/\s+/);
      el.innerHTML = '';

      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'word';
        span.textContent = word + ' ';
        span.style.transitionDelay = (i * 0.06) + 's';
        el.appendChild(span);
      });
    });

    // Animate on scroll
    if (typeof ScrollTrigger !== 'undefined') {
      elements.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: function () {
            el.classList.add('animate');
          },
          // Replay every time
          onLeaveBack: function () {
            el.classList.remove('animate');
          }
        });
      });
    } else {
      // Fallback: animate immediately
      elements.forEach(function (el) {
        el.classList.add('animate');
      });
    }
  }

  /* ==========================================
     5. Hero entrance
     ========================================== */
  function animateHero() {
    if (typeof gsap === 'undefined') {
      // Fallback: just show everything
      document.querySelectorAll('.hero__logo-text, .hero__subtitle, .hero__scroll').forEach(function (el) {
        el.style.opacity = '1';
      });
      return;
    }

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero__logo-text', {
      opacity: 1,
      duration: 1.2
    }, 0)
    .to('.hero__subtitle', {
      opacity: 1,
      duration: 1.0
    }, 0.4)
    .to('.hero__scroll', {
      opacity: 1,
      duration: 0.8
    }, 0.8);
  }

  /* ==========================================
     6. Category filter — accordion
     ========================================== */
  function initCategoryFilter() {
    var catButtons = document.querySelectorAll('.works__cat');
    var projectItems = document.querySelectorAll('.project-item');
    var catTitles = document.querySelectorAll('.category-title');

    if (!catButtons.length) return;

    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-cat');

        // Update active button
        catButtons.forEach(function (b) { b.classList.remove('works__cat--active'); });
        btn.classList.add('works__cat--active');

        // Update category title
        catTitles.forEach(function (t) { t.classList.remove('active-category'); });
        var activeTitle = document.querySelector('.category-title[data-cat-title="' + cat + '"]');
        if (activeTitle) activeTitle.classList.add('active-category');

        // Sort by year descending, filter by category
        var items = Array.from(projectItems);

        items.sort(function (a, b) {
          var getYear = function (el) {
            var t = el.querySelector('.project-year');
            var y = t ? parseInt(t.textContent.trim(), 10) : NaN;
            return isNaN(y) ? Infinity : y;
          };
          return getYear(b) - getYear(a); // newest first
        });

        // Reorder and filter
        var list = document.querySelector('.project-list');
        items.forEach(function (item, i) {
          var cats = item.getAttribute('data-category').split(' ');
          if (cat === 'all' || cats.indexOf(cat) !== -1) {
            item.style.display = '';
            item.style.order = i;
          } else {
            item.style.display = 'none';
          }
          list.appendChild(item);
        });
      });
    });

    // Initial sort (newest first)
    var items = Array.from(projectItems);
    items.sort(function (a, b) {
      var getYear = function (el) {
        var t = el.querySelector('.project-year');
        var y = t ? parseInt(t.textContent.trim(), 10) : NaN;
        return isNaN(y) ? Infinity : y;
      };
      return getYear(b) - getYear(a);
    });
    var list = document.querySelector('.project-list');
    items.forEach(function (item) {
      list.appendChild(item);
    });
  }

  /* ==========================================
     7. Horizontal scroll — inspiration section
     ========================================== */
  function initHorizontalScroll() {
    var scrollContent = document.getElementById('scroll-content');
    var thumbs = document.querySelectorAll('.thumbs-list .thumb');

    if (!scrollContent || !thumbs.length) return;

    // Thumb navigation
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var targetId = thumb.getAttribute('data-scroll-section');
        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }

        // Update active thumb
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
    });

    // Update active thumb on scroll
    scrollContent.addEventListener('scroll', function () {
      var sections = scrollContent.querySelectorAll('.content-section');
      var scrollLeft = scrollContent.scrollLeft;
      var centerX = scrollLeft + scrollContent.offsetWidth / 2;

      sections.forEach(function (section, i) {
        var rect = section.getBoundingClientRect();
        var containerRect = scrollContent.getBoundingClientRect();
        var sectionCenter = rect.left - containerRect.left + rect.width / 2;

        if (Math.abs(sectionCenter - scrollContent.offsetWidth / 2) < rect.width / 2) {
          thumbs.forEach(function (t) { t.classList.remove('active'); });
          if (thumbs[i]) thumbs[i].classList.add('active');
        }
      });
    });
  }

  /* ==========================================
     8. Image hover gallery cycling
     ========================================== */
  function initHoverGallery() {
    document.querySelectorAll('.b-hover-gallery .container-img').forEach(function (container) {
      var images = container.querySelectorAll('img.media');
      if (images.length < 2) return;

      var currentIndex = 0;
      var interval = null;

      // Show first image
      images.forEach(function (img, i) {
        img.style.display = i === 0 ? '' : 'none';
      });

      function showNext() {
        images[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.display = '';
      }

      container.addEventListener('mouseenter', function () {
        if (!interval) {
          interval = setInterval(showNext, 1000);
        }
      });

      container.addEventListener('mouseleave', function () {
        clearInterval(interval);
        interval = null;
        // Reset to first image
        images.forEach(function (img, i) {
          img.style.display = i === 0 ? '' : 'none';
        });
        currentIndex = 0;
      });
    });
  }

  /* ==========================================
     9. Noise texture canvas
     ========================================== */
  function initNoise() {
    var canvas = document.querySelector('.noise-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      var w = canvas.width, h = canvas.height;
      if (!w || !h) return;

      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;

      for (var i = 0; i < data.length; i += 4) {
        var val = Math.floor(Math.random() * 256);
        data[i] = data[i + 1] = data[i + 2] = val;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    resize();
    draw();
    window.addEventListener('resize', function () { resize(); draw(); });
    setInterval(draw, 3000);
  }

  /* ==========================================
     10. About background text parallax
     ========================================== */
  function initAboutParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var bgText = document.querySelector('.about__bg-text');
    if (!bgText) return;

    gsap.to(bgText, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }


  /* ==========================================
     11. Settings panel — font + theme switcher
     ========================================== */
  function initSettings() {
    var btn = document.getElementById('settings-btn');
    var panel = document.getElementById('settings-panel');
    if (!btn || !panel) return;

    // Font schemes
    var cnFonts = {
      'default': "'Taipei Sans TC', sans-serif",
      'system': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Microsoft YaHei', sans-serif",
      'serif': "'Noto Serif SC', 'Times New Roman', '宋体', 'SimSun', serif"
    };
    var enFonts = {
      'default': "'Konatu', monospace",
      'system': "'JetBrains Mono', 'SF Mono', 'Courier New', monospace",
      'sans': "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    };

    // Toggle panel
    btn.addEventListener('click', function () {
      var isOpen = panel.classList.contains('settings-panel--open');
      if (isOpen) {
        panel.classList.remove('settings-panel--open');
        btn.classList.remove('settings-btn--open');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        panel.classList.add('settings-panel--open');
        btn.classList.add('settings-btn--open');
        panel.setAttribute('aria-hidden', 'false');
      }
    });

    // Close panel on outside click
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        panel.classList.remove('settings-panel--open');
        btn.classList.remove('settings-btn--open');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // Helper: set active in group
    function setActive(group, target) {
      group.querySelectorAll('.settings-option').forEach(function (opt) {
        opt.classList.remove('settings-option--active');
      });
      target.classList.add('settings-option--active');
    }

    // CN Font switcher
    var cnGroup = document.getElementById('cn-font-options');
    if (cnGroup) {
      cnGroup.addEventListener('click', function (e) {
        var opt = e.target.closest('.settings-option');
        if (!opt) return;
        var key = opt.getAttribute('data-font-cn');
        document.documentElement.style.setProperty('--font-1', cnFonts[key] || cnFonts['default']);
        setActive(cnGroup, opt);
        localStorage.setItem('hazel-font-cn', key);
      });
    }

    // EN Font switcher
    var enGroup = document.getElementById('en-font-options');
    if (enGroup) {
      enGroup.addEventListener('click', function (e) {
        var opt = e.target.closest('.settings-option');
        if (!opt) return;
        var key = opt.getAttribute('data-font-en');
        document.documentElement.style.setProperty('--font-2', enFonts[key] || enFonts['default']);
        setActive(enGroup, opt);
        localStorage.setItem('hazel-font-en', key);
      });
    }

    // Theme switcher
    var themeGroup = document.getElementById('theme-options');
    if (themeGroup) {
      themeGroup.addEventListener('click', function (e) {
        var opt = e.target.closest('.settings-option');
        if (!opt) return;
        var theme = opt.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        setActive(themeGroup, opt);
        localStorage.setItem('hazel-theme', theme);
        // Update noise canvas opacity for dark mode
        updateNoiseForTheme(theme);
      });
    }

    function updateNoiseForTheme(theme) {
      var canvas = document.querySelector('.noise-canvas');
      if (!canvas) return;
      if (theme === 'dark') {
        canvas.style.opacity = '0.04';
        canvas.style.mixBlendMode = 'screen';
      } else {
        canvas.style.opacity = '0.025';
        canvas.style.mixBlendMode = 'multiply';
      }
    }

    // Reset
    var resetBtn = document.getElementById('settings-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        localStorage.removeItem('hazel-font-cn');
        localStorage.removeItem('hazel-font-en');
        localStorage.removeItem('hazel-theme');
        document.documentElement.style.setProperty('--font-1', cnFonts['default']);
        document.documentElement.style.setProperty('--font-2', enFonts['default']);
        document.documentElement.setAttribute('data-theme', '');
        updateNoiseForTheme('light');

        [cnGroup, enGroup, themeGroup].forEach(function (g) {
          if (!g) return;
          var first = g.querySelector('.settings-option');
          g.querySelectorAll('.settings-option').forEach(function (o) { o.classList.remove('settings-option--active'); });
          if (first) first.classList.add('settings-option--active');
        });
      });
    }

    // Load saved settings
    function loadSettings() {
      var savedCN = localStorage.getItem('hazel-font-cn');
      var savedEN = localStorage.getItem('hazel-font-en');
      var savedTheme = localStorage.getItem('hazel-theme');

      if (savedCN && cnFonts[savedCN] && cnGroup) {
        document.documentElement.style.setProperty('--font-1', cnFonts[savedCN]);
        setActive(cnGroup, cnGroup.querySelector('[data-font-cn="' + savedCN + '"]'));
      }
      if (savedEN && enFonts[savedEN] && enGroup) {
        document.documentElement.style.setProperty('--font-2', enFonts[savedEN]);
        setActive(enGroup, enGroup.querySelector('[data-font-en="' + savedEN + '"]'));
      }
      if (savedTheme && themeGroup) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        setActive(themeGroup, themeGroup.querySelector('[data-theme="' + savedTheme + '"]'));
        updateNoiseForTheme(savedTheme);
      }
    }

    loadSettings();
  }

  /* ==========================================
     Init all
     ========================================== */
  /* ==========================================
     12. Project detail overlay — all 21 projects
     ========================================== */
  function initProjectDetail() {
    var overlay = document.getElementById('project-overlay');
    var titleEl = document.getElementById('project-title');
    var catEl = document.getElementById('project-cat');
    var descEl = document.getElementById('project-desc');
    var galleryEl = document.getElementById('project-gallery');
    var closeBtn = document.getElementById('project-close');
    if (!overlay) return;

    // Helper: generate image paths
    function imgs(prefix, count, extMap) {
      var arr = [];
      for (var i = 1; i <= count; i++) {
        var n = i < 10 ? '0' + i : '' + i;
        var ext = extMap ? (extMap[i] || 'jpg') : 'jpg';
        arr.push('public/images/portfolio/' + prefix + '-' + n + '.' + ext);
      }
      return arr;
    }

    // All 21 project data
    var projects = {
      'poster-国庆2026主视觉海报': {
        cat: 'Poster 海报', title: '国庆2026主视觉海报',
        desc: '国庆主题主视觉海报设计——以红色为基调，在宏大叙事与当代审美之间寻找平衡。三张系列稿分别探索了不同的构图与版式可能。',
        images: imgs('poster-国庆2026主视觉海报', 3)
      },
      'poster-跨越！2026': {
        cat: 'Poster 海报', title: '跨越！2026',
        desc: '新年主题插画海报。以潦草而充满生命力的线条捕捉奔跑的姿态——灵魂画手的涂鸦背后，是对新一年的期许与跨越边界的冲动。',
        images: imgs('poster-跨越！2026', 3, {2:'png',3:'png'})
      },
      'poster-视界之外': {
        cat: 'Poster 海报', title: '视界之外',
        desc: '概念海报系列。视界之外是更大的世界——用构图打破视觉惯性，让观者在画面之外想象更多。三张海报构成连续的视觉叙事。',
        images: imgs('poster-视界之外', 3)
      },
      'poster-信号接收中': {
        cat: 'Poster 海报', title: '信号接收中',
        desc: '赛博朋克风格海报实验。在信号的噪点与断裂中寻找诗意——我们都生活在一个信号交错的时代，等待一个清晰的回音。',
        images: imgs('poster-信号接收中', 2)
      },
      'poster-植物共同呼吸系列海报': {
        cat: 'Poster 海报', title: '植物共同呼吸系列',
        desc: '以植物为主题的系列海报。植物是地球上最古老的呼吸者——五张海报分别捕捉不同植物的形态与气质，用视觉语言探索人与自然共生的关系。',
        images: imgs('poster-植物共同呼吸系列海报', 5)
      },
      'brand-aura': {
        cat: 'Brand 品牌', title: 'aura',
        desc: '品牌视觉系统设计。以"光环"为概念原点——每个品牌都有属于自己的光晕，设计的工作是让它被看见。涵盖 Logo、色彩系统、字体规范、名片、包装等全套识别体系。',
        images: imgs('brand-aura', 5, {5:'png'})
      },
      'brand-厚作goodwill': {
        cat: 'Brand 品牌', title: '厚作 goodwill',
        desc: '以"厚"为概念的品牌视觉系统。用密集的视觉元素堆叠出重量感，Goodwill传递扎实、可靠、有分量的品牌态度——厚重不等于臃肿。',
        images: imgs('brand-厚作goodwill', 4)
      },
      'brand-热点商店': {
        cat: 'Brand 品牌', title: '热点商店',
        desc: '咖啡品牌全案设计。从Logo字体到包装物料，从三维罐体到店面海报——为"热点"构建统一的视觉宇宙。23张图完整记录从概念到落地的全过程。',
        images: imgs('brand-热点商店', 23, {21:'png',22:'png',23:'png'})
      },
      'brand-小角落bean in the nook': {
        cat: 'Brand 品牌', title: '小角落 bean in the nook',
        desc: '在方寸之间推敲品牌表达——角落虽小，却可以是整个世界的缩影。以极简的方式构建完整的品牌识别，让文字与图形找到最恰切的栖息之地。',
        images: imgs('brand-小角落bean in the nook', 1)
      },
      'brand-映相': {
        cat: 'Brand 品牌', title: '映相',
        desc: '影像与品牌交叠的视觉实验。"映"与"相"——镜像与真实、光影与实体之间的张力，转化为可触摸的品牌语言。从Logo到物料，每一处都是对视觉哲学的实践。',
        images: imgs('brand-映相', 5, {4:'png',5:'png'})
      },
      'brand-原麦工坊': {
        cat: 'Brand 品牌', title: '原麦工坊',
        desc: '面包与麦香，从农田到餐桌的视觉旅程。品牌全案涵盖Logo设计、包装系统、空间导视与宣传物料——以质朴的手感传递手工面包的诚意与温度。',
        images: imgs('brand-原麦工坊', 15, {'12':'png','13':'png','14':'png','15':'png'})
      },
      'material-№ name': {
        cat: 'Material 应用', title: '№ name',
        desc: '以编号命名的创意物料设计。在数字与符号之间寻找视觉趣味——三张稿探索了排版、色彩与图形的不同组合方式。',
        images: imgs('material-№ name', 3)
      },
      'material-半句再见-孙燕姿': {
        cat: 'Material 应用', title: '半句再见 · 孙燕姿',
        desc: '音乐主题物料设计。以"半句再见"为灵感，用视觉捕捉旋律中的情绪——未说完的话、未完成的告别，都在画面中定格。',
        images: imgs('material-半句再见-孙燕姿', 2)
      },
      'material-工号：NO.6': {
        cat: 'Material 应用', title: '工号：NO.6',
        desc: '粉丝周边小卡设计。偶像文化与平面设计的桥梁——每一张卡片都是迷你海报，承载视觉与情感的双重表达。',
        images: imgs('material-工号：NO.6', 3)
      },
      'material-华晨宇创意物料': {
        cat: 'Material 应用', title: '华晨宇创意物料',
        desc: '艺人周边与创意物料设计——8张稿涵盖小卡、海报、宣传物料等多种形式，为音乐与视觉之间建立桥梁。',
        images: imgs('material-华晨宇创意物料', 8, {8:'png'})
      },
      'material-圣诞物料制作': {
        cat: 'Material 应用', title: '圣诞物料制作',
        desc: '节日主题物料设计。以非传统的视觉语言重新诠释圣诞——克制中见温暖，留白间藏祝福。四张稿探索了圣诞视觉的不同可能性。',
        images: imgs('material-圣诞物料制作', 4)
      },
      'typeface-百家烟': {
        cat: 'Typeface 字体', title: '百家烟',
        desc: '实验性字体设计。以"烟"的流动感解构汉字笔画，让文字在具象与抽象之间飘忽不定——每一笔都是对汉字形态边界的试探。',
        images: imgs('typeface-百家烟', 2, {2:'png'})
      },
      'typeface-北极光': {
        cat: 'Typeface 字体', title: '北极光',
        desc: '极光主题字体与海报设计。以流动的色彩和透明的层次，再现北极夜空那场盛大而寂静的光之演出——让文字也拥有极光的质感。',
        images: imgs('typeface-北极光', 1)
      },
      'typeface-发财': {
        cat: 'Typeface 字体', title: '发财',
        desc: '字体设计练习。"发财"二字承载着最朴素的中国式愿望——在传统与当代之间寻找字形的张力，让祝福也拥有设计的力量。',
        images: imgs('typeface-发财', 2)
      },
      'typeface-诺亚方舟': {
        cat: 'Typeface 字体', title: '诺亚方舟',
        desc: '字体与概念海报。方舟不只是逃离的载具——三张稿以不同的字形和版式探索"方舟"一词的视觉重量与象征意义。',
        images: imgs('typeface-诺亚方舟', 3)
      },
      'typeface-偏方': {
        cat: 'Typeface 字体', title: '偏方',
        desc: '系列字体实验。以民间偏方的视觉语言为灵感——粗粝、直接、不讲究章法，却自有野生的力量。三张稿全部以PNG格式保留原始质感。',
        images: imgs('typeface-偏方', 3, {1:'png',2:'png',3:'png'})
      }
    };

    function openProject(key) {
      var data = projects[key];
      if (!data) return;
      catEl.textContent = data.cat;
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      galleryEl.innerHTML = '';
      data.images.forEach(function (src) {
        var div = document.createElement('div');
        div.className = 'container-img';
        var img = document.createElement('img');
        img.className = 'media';
        img.src = src;
        img.alt = data.title;
        img.loading = 'lazy';
        div.appendChild(img);
        galleryEl.appendChild(div);
      });
      overlay.classList.add('project-overlay--open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      overlay.scrollTop = 0;
    }

    function closeProject() {
      overlay.classList.remove('project-overlay--open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Click any project item to open detail
    document.querySelectorAll('.project-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        if (e.target.closest('.accordion-content')) return;
        var cat = item.getAttribute('data-category');
        var title = item.querySelector('.project-title');
        if (!title) return;
        var rawTitle = title.textContent.trim();
        // Build key matching the projects object
        var key = cat + '-' + rawTitle;
        // Handle special cases with full names
        var fullNameMap = {
          'poster-跨越！2026': true,
          'poster-植物共同呼吸系列海报': true,
          'brand-厚作 goodwill': 'brand-厚作goodwill',
          'brand-小角落 bean in the nook': 'brand-小角落bean in the nook',
          'material-半句再见 · 孙燕姿': 'material-半句再见-孙燕姿',
          'material-工号：NO.6': 'material-工号：NO.6',
          'material-华晨宇创意物料': true,
          'material-圣诞物料制作': true,
          'typeface-百家烟': true,
          'typeface-北极光': true,
          'typeface-发财': true,
          'typeface-诺亚方舟': true,
          'typeface-偏方': true
        };
        if (fullNameMap[key] === true) { /* key is correct */ }
        else if (typeof fullNameMap[key] === 'string') key = fullNameMap[key];
        openProject(key);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeProject);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('project-overlay--open')) {
        closeProject();
      }
    });
  }

  /* ==========================================
     12. Scroll progress bar
     ========================================== */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    }, { passive: true });
  }

  /* ==========================================
     13. Project list stagger reveal
     ========================================== */
  function initProjectStagger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var items = document.querySelectorAll('.project-item');
    items.forEach(function (item, i) {
      gsap.fromTo(item,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          delay: i * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.project-list',
            start: 'top 88%',
            once: true
          }
        }
      );
      // Inner content stagger
      var inner = item.querySelector('.inner-content');
      if (inner) {
        gsap.fromTo(inner,
          { opacity: 0, x: -15 },
          {
            opacity: 1, x: 0,
            duration: 0.5,
            delay: i * 0.04 + 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.project-list',
              start: 'top 88%',
              once: true
            }
          }
        );
      }
    });
  }

  /* ==========================================
     14. Hero parallax
     ========================================== */
  function initHeroParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var bgChar = document.querySelector('.hero__logo-text');
    if (bgChar) {
      gsap.to(bgChar, {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
      });
    }
    var subtitle = document.querySelector('.hero__subtitle');
    if (subtitle) {
      gsap.to(subtitle, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
    // Gallery cards parallax
    document.querySelectorAll('.gallery-wrapper .project-card').forEach(function (card, i) {
      gsap.to(card, {
        y: -25 * (i + 1), ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    });
  }

  /* ==========================================
     15. Section fade-in reveals
     ========================================== */
  function initSectionReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    // About section
    var aboutContent = document.querySelector('.about__content-row');
    if (aboutContent) {
      gsap.fromTo(aboutContent,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: aboutContent, start: 'top 88%', once: true }
        }
      );
    }
    // Category buttons
    var cats = document.querySelector('.works__categories');
    if (cats) {
      gsap.fromTo(cats,
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.works', start: 'top 92%', once: true }
        }
      );
    }
    // Footer
    var footer = document.querySelector('#footer');
    if (footer) {
      gsap.fromTo(footer,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '#footer', start: 'top 92%', once: true }
        }
      );
    }
  }

  function init() {
    initNoise();
    initLoader();
    initCursor();
    initSplitWords();
    initCategoryFilter();
    initHorizontalScroll();
    initHoverGallery();
    initAboutParallax();
    initSettings();
    initProjectDetail();
    initScrollProgress();
    initProjectStagger();
    initHeroParallax();
    initSectionReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
