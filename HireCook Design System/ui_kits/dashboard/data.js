// Plausible HireCook data — used to populate the kit. Not production.
window.HC_DATA = {
  workspace: { name: "Aurora Robotics 台灣", plan: "團隊方案 · 12 席" },

  roles: [
    { id: "be-l3", title: "Backend Engineer L3", team: "平台組 · 6 人",
      stress: "中等 · 每週循環", collab: "高 · 每日配對",
      autonomy: "High", decisions: "非同步 · RFC 驅動",
      candidates: 12, modeledAt: "2026-05-14" },
    { id: "pm-grw", title: "Growth PM", team: "成長組 · 4 人",
      stress: "高 · 雙週發布", collab: "跨部門密集協作",
      autonomy: "Medium", decisions: "同步 · 資料驅動",
      candidates: 7, modeledAt: "2026-05-11" },
    { id: "cs-lead", title: "Customer Success Lead", team: "GTM 組 · 9 人",
      stress: "高 · 穩定持續", collab: "高 · 客戶接觸密集",
      autonomy: "Medium", decisions: "同步 · 同理導向",
      candidates: 5, modeledAt: "2026-05-03" },
    { id: "des-sr", title: "Senior Product Designer", team: "設計組 · 3 人",
      stress: "中等 · Sprint 節奏", collab: "中等 · 與 PM 配對",
      autonomy: "High", decisions: "工作坊 · 迭代型",
      candidates: 9, modeledAt: "2026-04-29" }
  ],

  candidates: [
    { id: "c-2451", name: "陳子衡", initials: "C", role: "Backend Engineer L3", roleId: "be-l3",
      score: 82.4, ci: 3.1, status: "fit",  retention6mo: 78, sjt: "sjt-3.1", days: 2,
      drivers: [
        { name: "協作密度",  v: +18.2 },
        { name: "壓力調節",      v: +11.5 },
        { name: "自主性偏好",    v:  +6.0 },
        { name: "衝突應對",      v:  -4.3 }
      ],
      pe: { P: [78, 82, 65, 88, 72, 80], E: [80, 76, 72, 70, 84, 78] },
      management: [
        "讓他在前兩份 RFC 中與資深工程師配對，以確立決策風格基準。",
        "透過 1:1 節奏浮現壓力信號——此候選人習慣低報工作負荷。",
        "書面溝通優先：第 1–2 週減少同步會議，讓他在文字頻道上先建立信任。"
      ],
      comms: {
        primary: "非同步書面",
        cadence: "每週 1:1 · 30 分鐘",
        meetingLoad: "每週 ≤ 8 小時",
        feedback: "直接、具體、會後書面確認",
        notes: "在文字頻道提出阻塞問題的頻率是會議的 2 倍。所有評審會議前請提供非同步預讀材料。"
      },
      onboarding: [
        { phase: "第 1–30 天", title: "建立決策風格基準",
          items: [
            "在前兩份 RFC 中搭配資深工程師配對——評審風格定下來，磨合期自然縮短。",
            "第一週讓他端對端獨立交付一個小型、範圍明確的功能。信心從小成就開始疊加。",
            "每週保留 4 小時非結構性探索時間；這是他的學習模式。"
          ] },
        { phase: "第 31–60 天", title: "擴大自主範疇",
          items: [
            "移交一個聚焦的子系統（如資料攝取 pipeline）。單線程所有權優於廣度。",
            "刻意介紹他認識跨部門夥伴——他不會主動社交破冰。",
            "第 45 天跑一次書面復盤。他在文字上會說實話。"
          ] },
        { phase: "第 61–90 天", title: "穩固並拉伸",
          items: [
            "提名他參與非直屬團隊 RFC 的評審。可以觀察他在更大範疇的決策風格。",
            "確認職涯方向：繼續 IC 路徑，或啟動 Tech Lead 延伸？",
            "第 90 天校準留任信號——這是模型的第一個分叉點。"
          ] }
      ],
      warnings: [
        { signal: "書面討論串沉默超過 3 天",  threshold: "≥ 3 天沉默", severity: "watch",
          why: "書面是他的主要頻道，沉默是先行指標，而非落後指標。" },
        { signal: "開始要求更多會議，而非更少",   threshold: "連續 2 週增加", severity: "risk",
          why: "與其基準相反——通常代表他已對非同步溝通失去信心。" },
        { signal: "衝突應對模式轉為退讓",      threshold: "30 天內出現 2 次以上 RFC 退讓", severity: "watch",
          why: "衝突應對本已是弱項；進一步軟化預示抽離。" }
      ] },

    { id: "c-2447", name: "Aida Sørensen", initials: "AS", role: "Backend Engineer L3", roleId: "be-l3",
      score: 71.2, ci: 4.0, status: "watch", retention6mo: 64, sjt: "sjt-3.1", days: 4,
      drivers: [
        { name: "自主性偏好",    v: +14.8 },
        { name: "協作密度",  v:  -8.6 },
        { name: "壓力調節",      v:  +5.1 },
        { name: "衝突應對",      v:  +2.0 }
      ],
      pe: { P: [88, 60, 84, 70, 66, 74], E: [80, 76, 72, 70, 84, 78] },
      management: [
        "留意——自主性需求超出團隊協作常模，有漸趨孤立的風險。",
        "設置明確的協作接觸點，避免對齊問題悄悄累積。",
        "壓力信號穩定；信任其自己的節奏調控。"
      ] },

    { id: "c-2438", name: "Marcus Lai",  initials: "ML", role: "Growth PM", roleId: "pm-grw",
      score: 88.6, ci: 2.4, status: "fit", retention6mo: 86, sjt: "sjt-2.4", days: 1,
      drivers: [
        { name: "決策速度",      v: +21.0 },
        { name: "數據流暢度",           v: +14.2 },
        { name: "跨部門同理心", v: +9.5 },
        { name: "非同步容忍度",        v: -3.1 }
      ],
      pe: { P: [90, 86, 70, 92, 80, 76], E: [88, 82, 72, 90, 78, 70] },
      management: [
        "儘早賦予啟動所有權——否則容易陷入低效狀態。",
        "每週與研究端夥伴對接；直覺強，但對證據保持好奇心。",
        "非同步偏好低於團隊基準——保護他的會議衛生，不要過度排程。"
      ] },

    { id: "c-2401", name: "Priya Raman", initials: "PR", role: "Customer Success Lead", roleId: "cs-lead",
      score: 48.3, ci: 5.8, status: "risk",  retention6mo: 42, sjt: "sjt-2.4", days: 6,
      drivers: [
        { name: "壓力調節",       v: -22.4 },
        { name: "衝突應對",       v: -16.0 },
        { name: "客戶同理心",        v: +12.0 },
        { name: "模糊情境決策",v:  -7.6 }
      ],
      pe: { P: [60, 56, 92, 50, 64, 70], E: [78, 80, 88, 70, 76, 72] },
      management: [
        "錯配——持續高壓環境對應需要恢復週期的偏好，結構性衝突明顯。",
        "若仍決定錄用，第一季減輕升級處理負擔，搭配沉穩導師配對。",
        "客戶同理心是真實優勢；可考慮 CSM 個人貢獻者職位，而非 Lead 職。"
      ] },

    { id: "c-2399", name: "Jonas Weber", initials: "JW", role: "Senior Product Designer", roleId: "des-sr",
      score: 76.8, ci: 3.6, status: "fit", retention6mo: 73, sjt: "sjt-3.0", days: 8,
      drivers: [
        { name: "深度工藝",            v: +18.0 },
        { name: "跨部門同理心", v: +8.4 },
        { name: "衝突應對",      v:  +3.2 },
        { name: "非同步容忍度",        v:  -2.0 }
      ],
      pe: { P: [82, 78, 70, 76, 80, 84], E: [78, 74, 70, 72, 80, 80] },
      management: [
        "給他兩週不受打斷的獨立工作時間，讓他在進入配對前先建立信心。",
        "第三週搭配 PM 配對；研究導向的直覺可靠，搭配夥伴後更有力。",
        "發布壓力下留意非同步容忍度的變化。"
      ] }
  ]
};
