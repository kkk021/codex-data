const seedBuilds = [
  {
    id: crypto.randomUUID(),
    pokemon: "ガブリアス",
    title: "スカーフエース",
    role: "物理アタッカー",
    nature: "ようき",
    ability: "さめはだ",
    item: "こだわりスカーフ",
    tera: "はがね",
    moves: ["じしん", "げきりん", "ストーンエッジ", "ほのおのキバ"],
    evs: "A252 / S252 / H4",
    guide: "終盤の抜きエース。対面操作後に高火力技を通す。"
  },
  {
    id: crypto.randomUUID(),
    pokemon: "ゲンガー",
    title: "きあいのタスキ対面型",
    role: "特殊アタッカー",
    nature: "おくびょう",
    ability: "のろわれボディ",
    item: "きあいのタスキ",
    tera: "ゴースト",
    moves: ["シャドーボール", "ヘドロばくだん", "きあいだま", "みちづれ"],
    evs: "C252 / S252 / H4",
    guide: "高い素早さを活かした対面処理役。削ってからみちづれで1:1交換を狙える。"
  },
  {
    id: crypto.randomUUID(),
    pokemon: "ロトム(ウォッシュ)",
    title: "クッションサポート",
    role: "サポート",
    nature: "ずぶとい",
    ability: "ふゆう",
    item: "オボンのみ",
    tera: "くさ",
    moves: ["ボルトチェンジ", "ハイドロポンプ", "おにび", "でんじは"],
    evs: "H252 / B212 / S44",
    guide: "物理受け寄りのサイクル要員。状態異常で味方を通しやすくする。"
  }
];

const key = "champions_builds_v1";
const listEl = document.getElementById("buildList");
const detailEl = document.getElementById("buildDetail");
const searchEl = document.getElementById("searchInput");
const roleEl = document.getElementById("roleFilter");
const formEl = document.getElementById("buildForm");

const readBuilds = () => {
  const raw = localStorage.getItem(key);
  if (!raw) return seedBuilds;
  try { return JSON.parse(raw); } catch { return seedBuilds; }
};

const saveBuilds = (builds) => localStorage.setItem(key, JSON.stringify(builds));

let builds = readBuilds();

function renderList() {
  const q = searchEl.value.trim();
  const role = roleEl.value;
  const filtered = builds.filter((b) => {
    const hitText = `${b.pokemon} ${b.title} ${b.moves.join(" ")}`.includes(q);
    const hitRole = !role || b.role === role;
    return hitText && hitRole;
  });

  listEl.innerHTML = "";
  filtered.forEach((b) => {
    const li = document.createElement("li");
    li.className = "build-item";
    li.innerHTML = `<strong>${b.pokemon}</strong> - ${b.title}<div class="meta">${b.role} / ${b.item}</div>`;
    li.onclick = () => renderDetail(b);
    listEl.appendChild(li);
  });
}

function renderDetail(b) {
  detailEl.innerHTML = `
    <h3>${b.pokemon} - ${b.title}</h3>
    <p><b>役割:</b> ${b.role}</p>
    <p><b>性格:</b> ${b.nature} / <b>特性:</b> ${b.ability}</p>
    <p><b>持ち物:</b> ${b.item} / <b>テラスタイプ:</b> ${b.tera || "-"}</p>
    <p><b>技:</b> ${b.moves.join(" / ")}</p>
    <p><b>努力値:</b> ${b.evs}</p>
    <p><b>解説:</b> ${b.guide}</p>
  `;
}

searchEl.addEventListener("input", renderList);
roleEl.addEventListener("change", renderList);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(formEl);
  const b = {
    id: crypto.randomUUID(),
    pokemon: fd.get("pokemon"),
    title: fd.get("title"),
    role: fd.get("role"),
    nature: fd.get("nature"),
    ability: fd.get("ability"),
    item: fd.get("item"),
    tera: fd.get("tera"),
    moves: String(fd.get("moves")).split(",").map((v) => v.trim()).filter(Boolean),
    evs: fd.get("evs"),
    guide: fd.get("guide")
  };

  builds = [b, ...builds];
  saveBuilds(builds);
  renderList();
  renderDetail(b);
  formEl.reset();
});

renderList();
