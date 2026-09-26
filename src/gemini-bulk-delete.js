// Gemini Bulk Delete
// Readable source of the bookmarklet in ../bookmarklet.txt.
// Run it on gemini.google.com: it opens a panel that lists your chats,
// lets you filter and select them, and deletes the selected ones.
// Deletion is permanent and uses Gemini's own (undocumented) web endpoint.
(function () {
  // Running the bookmarklet again closes the panel.
  const ex = document.getElementById("gemini-bulk-delete-ui");
  if (ex) {
    ex.remove();
    return;
  }
  function el(t, s, x) {
    const e = document.createElement(t);
    if (s) e.style.cssText = s;
    if (x !== undefined) e.textContent = x;
    return e;
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  // Panel UI (labels are in Turkish).
  const panel = el(
    "div",
    "position:fixed;top:60px;left:10px;z-index:99999;background:#1e1e2e;color:#cdd6f4;border:1px solid #585b70;border-radius:12px;padding:12px;width:300px;font-family:sans-serif;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,.5);",
  );
  panel.id = "gemini-bulk-delete-ui";
  const tr = el(
    "div",
    "font-size:14px;font-weight:600;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;",
  );
  tr.appendChild(el("span", null, "⚡ Gemini Hızlı Sil"));
  const cb0 = el(
    "button",
    "background:none;border:none;color:#cdd6f4;cursor:pointer;font-size:16px;",
    "✕",
  );
  cb0.onclick = () => panel.remove();
  tr.appendChild(cb0);
  panel.appendChild(tr);
  const search = el(
    "input",
    "width:100%;box-sizing:border-box;padding:6px 8px;border-radius:8px;border:1px solid #585b70;background:#11111b;color:#cdd6f4;font-size:12px;margin-bottom:6px;",
  );
  search.placeholder = "🔎 Filtrele...";
  panel.appendChild(search);
  const status = el(
    "div",
    "font-size:11px;color:#a6adc8;margin-bottom:6px;min-height:14px;",
    "Hazır.",
  );
  panel.appendChild(status);
  const pw = el(
    "div",
    "width:100%;height:6px;background:#313244;border-radius:4px;margin-bottom:8px;overflow:hidden;display:none;",
  );
  const pb = el("div", "height:100%;width:0;background:#a6e3a1;transition:width .15s;");
  pw.appendChild(pb);
  panel.appendChild(pw);
  const lr = el("div", "display:flex;gap:6px;margin-bottom:6px;");
  const loadBtn = el(
    "button",
    "flex:1;padding:6px;border:1px solid #89b4fa;border-radius:8px;background:transparent;color:#89b4fa;font-size:11px;cursor:pointer;font-weight:600;",
    "⤓ Tümünü Yükle",
  );
  lr.appendChild(loadBtn);
  panel.appendChild(lr);
  const sar = el(
    "div",
    "display:flex;align-items:center;gap:6px;margin-bottom:6px;padding:4px 0;border-bottom:1px solid #45475a;",
  );
  const sa = el("input", "cursor:pointer;accent-color:#cba6f7;");
  sa.type = "checkbox";
  sa.id = "gem-sa";
  const sal = el(
    "label",
    "cursor:pointer;font-weight:600;font-size:12px;",
    "Görünenleri Seç / Bırak",
  );
  sal.htmlFor = "gem-sa";
  sar.appendChild(sa);
  sar.appendChild(sal);
  panel.appendChild(sar);
  const lc = el("div", "max-height:240px;overflow-y:auto;margin-bottom:10px;");
  panel.appendChild(lc);
  const db = el(
    "button",
    "width:100%;padding:8px;border:none;border-radius:8px;background:#585b70;color:#1e1e2e;font-weight:700;font-size:13px;cursor:pointer;",
    "⚡ Hızlı Sil (0)",
  );
  panel.appendChild(db);
  document.body.appendChild(panel);
  let model = [];
  function gs() {
    return document.querySelector("infinite-scroller");
  }
  // Resolve a sidebar item to its conversation id ("c_<hex>").
  function gid(b) {
    const n =
      b.closest("gem-nav-list-item") || b.closest('[data-test-id="conversation"]');
    if (!n) return null;
    const a = n.querySelector('a[href*="/app/"]');
    if (a) {
      const m = (a.getAttribute("href") || "").match(/\/app\/([a-f0-9]+)/);
      if (m) return "c_" + m[1];
    }
    const j = a ? a.getAttribute("jslog") || "" : "";
    const m2 = j.match(/"(c_[a-f0-9]{8,})"/);
    return m2 ? m2[1] : null;
  }
  // Collect the chats currently rendered in the sidebar.
  // Matches the Turkish and English "more options" button labels.
  function snap() {
    const arr = [];
    document
      .querySelectorAll('[aria-label*="diğer seçenekler"],[aria-label*="more options" i]')
      .forEach((b) => {
        const l = b
          .getAttribute("aria-label")
          .replace(/ için diğer seçenekler$/, "")
          .replace(/^more options for /i, "");
        const id = gid(b);
        if (id) arr.push({ label: l, id });
      });
    return arr;
  }
  function merge(arr) {
    arr.forEach((o) => {
      if (!model.find((m) => m.id === o.id))
        model.push({ label: o.label, id: o.id, checked: false });
    });
  }
  // Scroll the sidebar to the end so every chat gets rendered and collected.
  async function loadAll() {
    const sc = gs();
    if (!sc) {
      status.textContent = "Liste yok.";
      return;
    }
    loadBtn.disabled = true;
    merge(snap());
    let lt = -1,
      st = 0,
      sp = 0;
    sc.scrollTop = 0;
    await sleep(300);
    merge(snap());
    while (sp < 400) {
      sc.scrollTop += 250;
      await sleep(280);
      merge(snap());
      status.textContent = "Yükleniyor... " + model.length;
      if (Math.abs(sc.scrollTop - lt) < 2) {
        st++;
        if (st >= 3) break;
      } else st = 0;
      lt = sc.scrollTop;
      sp++;
    }
    sc.scrollTop = 0;
    loadBtn.disabled = false;
    status.textContent = "✅ " + model.length + " sohbet.";
    render();
  }
  function render() {
    const q = search.value.trim().toLowerCase();
    while (lc.firstChild) lc.removeChild(lc.firstChild);
    const v = model.filter((m) => !q || m.label.toLowerCase().includes(q));
    if (v.length === 0)
      lc.appendChild(
        el(
          "div",
          "font-size:11px;color:#6c7086;padding:8px;",
          q ? "Eşleşme yok." : 'Önce "Tümünü Yükle".',
        ),
      );
    v.forEach((m) => {
      const row = el(
        "div",
        "display:flex;align-items:center;gap:6px;padding:4px 2px;border-bottom:1px solid #313244;",
      );
      const cb = el("input", "cursor:pointer;accent-color:#cba6f7;flex-shrink:0;");
      cb.type = "checkbox";
      cb.checked = m.checked;
      cb.addEventListener("change", () => {
        m.checked = cb.checked;
        ub();
      });
      const lbl = el(
        "label",
        "cursor:pointer;font-size:11px;line-height:1.4;",
        m.label.length > 34 ? m.label.substring(0, 34) + "…" : m.label,
      );
      lbl.title = m.label;
      lbl.onclick = () => {
        cb.checked = !cb.checked;
        m.checked = cb.checked;
        ub();
      };
      row.appendChild(cb);
      row.appendChild(lbl);
      lc.appendChild(row);
    });
    ub();
  }
  function ub() {
    const c = model.filter((m) => m.checked).length;
    db.textContent = "⚡ Hızlı Sil (" + c + ")";
    db.style.background = c > 0 ? "#a6e3a1" : "#585b70";
    const q = search.value.trim().toLowerCase();
    const v = model.filter((m) => !q || m.label.toLowerCase().includes(q));
    const vc = v.filter((m) => m.checked).length;
    sa.checked = v.length > 0 && vc === v.length;
    sa.indeterminate = vc > 0 && vc < v.length;
  }
  search.addEventListener("input", render);
  loadBtn.onclick = loadAll;
  sa.addEventListener("change", () => {
    const q = search.value.trim().toLowerCase();
    model.forEach((m) => {
      if (!q || m.label.toLowerCase().includes(q)) m.checked = sa.checked;
    });
    render();
  });
  // Delete one conversation through Gemini's batchexecute RPC (GzXR5e),
  // using the session tokens the page already has.
  async function fd(id) {
    const w = window.WIZ_global_data;
    const at = w.SNlM0e,
      sid = w.FdrFJe,
      bl = w.cfb2h;
    const pm = location.pathname.match(/^\/u\/(\d+)\//);
    const up = pm ? "/u/" + pm[1] : "";
    const rq = Math.floor(Math.random() * 900000) + 100000;
    const url =
      location.origin +
      up +
      "/_/BardChatUi/data/batchexecute?rpcids=GzXR5e&source-path=" +
      encodeURIComponent(up + "/app") +
      "&bl=" +
      encodeURIComponent(bl) +
      "&f.sid=" +
      encodeURIComponent(sid) +
      "&hl=tr&_reqid=" +
      rq +
      "&rt=c";
    const fr = JSON.stringify([[["GzXR5e", JSON.stringify([id]), null, "generic"]]]);
    const body =
      "f.req=" + encodeURIComponent(fr) + "&at=" + encodeURIComponent(at) + "&";
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
      credentials: "include",
    });
    return r.ok;
  }
  // Delete the selected chats in batches of four, then reload the page.
  db.addEventListener("click", async () => {
    const sel = model.filter((m) => m.checked);
    if (sel.length === 0) {
      status.textContent = "⚠️ Sohbet seçin!";
      return;
    }
    if (
      !confirm(
        sel.length + " sohbet KALICI silinecek (hızlı mod). Geri alınamaz. Emin misiniz?",
      )
    )
      return;
    db.disabled = true;
    loadBtn.disabled = true;
    pw.style.display = "block";
    let ok = 0,
      fail = 0,
      done = 0;
    const bs = 4;
    for (let i = 0; i < sel.length; i += bs) {
      const ch = sel.slice(i, i + bs);
      const rs = await Promise.all(
        ch.map((m) =>
          fd(m.id)
            .then((r) => ({ m, r }))
            .catch(() => ({ m, r: false })),
        ),
      );
      rs.forEach(({ m, r }) => {
        if (r) {
          ok++;
          model = model.filter((x) => x !== m);
        } else fail++;
      });
      done += ch.length;
      pb.style.width = Math.round((done / sel.length) * 100) + "%";
      status.textContent = "⚡ " + done + "/" + sel.length;
      await sleep(150);
    }
    pb.style.width = "100%";
    status.textContent =
      "✅ " +
      ok +
      " silindi" +
      (fail > 0 ? " | ⚠️ " + fail + " hata" : "") +
      ". Yenileniyor...";
    db.disabled = false;
    loadBtn.disabled = false;
    render();
    setTimeout(() => location.reload(), 1500);
  });
  merge(snap());
  render();
  status.textContent = model.length + ' sohbet görünür. Tümü için "Tümünü Yükle".';
})();
