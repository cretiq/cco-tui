# Claude Code Organizer

[![npm version](https://img.shields.io/npm/v/@mcpware/claude-code-organizer)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![npm downloads](https://img.shields.io/npm/dt/@mcpware/claude-code-organizer?label=downloads)](https://www.npmjs.com/package/@mcpware/claude-code-organizer)
[![GitHub stars](https://img.shields.io/github/stars/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mcpware/claude-code-organizer)](https://github.com/mcpware/claude-code-organizer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Bahasa Indonesia](README.id.md) | [Italiano](README.it.md) | [Português](README.pt-BR.md) | Türkçe | [Tiếng Việt](README.vi.md) | [ไทย](README.th.md)

**Claude Code içindeki tüm memory, skill, MCP server ve hook'larınızı düzenleyin; scope hiyerarşisine göre görün, drag-and-drop ile scope'lar arasında taşıyın.**

![Claude Code Organizer Demo](docs/demo.gif)

## Sorun

Claude Code, siz çalışırken sessizce memory, skill ve MCP config'leri oluşturur; sonra da bunları o anki dizininize uyan scope'a bırakır. Her yerde geçerli olmasını istediğiniz bir tercih mi var? Tek bir Project içinde sıkışır kalır. Sadece belirli bir repo'ya ait olması gereken bir deploy skill'i mi var? Global'a sızar ve diğer tüm projeleri kirletir.

**Bu sadece dağınıklık değil; AI performansını da düşürür.** Claude her oturumda, bulunduğunuz scope'taki tüm config'leri ve üst scope'lardan miras alınan her şeyi context window'a yükler. Yanlış scope'taki öğeler, boşa giden token'lar, kirlenmiş context ve daha düşük doğruluk demektir. Global'da duran bir Python pipeline skill'i, React frontend oturumunuzda da yüklenir. Tekrarlanan MCP kayıtları aynı server'ı iki kez başlatır. Eski memory'ler güncel talimatlarınızla çelişir.

### "Claude düzeltsin" demek kolay

Claude Code'dan kendi config'ini yönetmesini isteyebilirsiniz. Ama iş kısa sürede ileri geri komut çalıştırmaya döner: bir dizinde `ls`, dosya dosya `cat`, sonra da metin parçalarından büyük resmi çıkarmaya çalışma. **Tüm scope'ları, tüm öğeleri ve tüm miras zincirini aynı anda gösteren bir komut yok.**

### Çözüm: görsel bir dashboard

```bash
npx @mcpware/claude-code-organizer
```

Tek komutla Claude'un sakladığı her şeyi, scope hiyerarşisine göre düzenlenmiş halde görün. **Öğeleri scope'lar arasında drag-and-drop ile taşıyın.** Eski memory'leri silin. Kopyaları bulun. Claude'un davranışını gerçekte neyin etkilediğini kontrol altına alın.

### Örnek: Project → Global

Claude'a bir proje içindeyken "I prefer TypeScript + ESM" dediniz; ama bu tercih aslında her yerde geçerli. Dashboard'u açın, o memory'yi Project'ten Global'a sürükleyin. **Bitti. Tek hareket.**

### Örnek: Global → Project

Global'da duran bir deploy skill'i, gerçekte yalnızca tek bir repo için anlamlı olabilir. Onu ilgili Project scope'una taşıyın; diğer projeler artık onu görmez.

### Örnek: Eski memory'leri silmek

Claude bazen gündelik olarak söylediğiniz şeylerden, bazen de *hatırlanmasını istediğinizi sandığı* ayrıntılardan otomatik memory üretir. Bir hafta sonra bunlar alakasız hale gelir ama yine de her oturuma yüklenir. Göz atın, okuyun, silin. **Claude'un sizin hakkınızda ne bildiğini sandığını siz belirlersiniz.**

---

## Özellikler

- **Scope hiyerarşisi görünümü** — Tüm öğeleri Global > Workspace > Project düzeninde, miras göstergeleriyle birlikte görün
- **Drag-and-drop** — memory'leri scope'lar arasında, skill'leri Global ile repo bazlı klasörler arasında, MCP server'larını config'ler arasında taşıyın
- **Taşıma onayı** — Her taşıma işleminde, dosyalara dokunmadan önce bir onay modal'ı açılır
- **Aynı tür güvenliği** — Memory öğeleri yalnızca memory klasörlerine, skill öğeleri skill klasörlerine, MCP kayıtları yalnızca MCP config'lerine taşınabilir
- **Arama ve filtreleme** — Tüm öğelerde anında arama yapın; kategoriye göre filtreleyin (Memory, Skills, MCP, Config, Hooks, Plugins, Plans)
- **Detay paneli** — Herhangi bir öğeye tıklayıp tam metadata'yı, açıklamayı, dosya yolunu görün ve VS Code'da açın
- **Project bazında tam tarama** — Her scope'ta tüm öğe türleri taranır: memory'ler, skill'ler, MCP server'ları, config'ler, hook'lar ve planlar
- **Gerçek dosya taşıma** — Sadece görüntülemez; `~/.claude/` içindeki dosyaları gerçekten taşır
- **45 E2E test** — Her işlemden sonra gerçek dosya sistemi doğrulaması yapan bir Playwright test paketi

## Neden görsel bir dashboard?

Claude Code, CLI üzerinden zaten dosya listeleyip taşıyabiliyor; ama kendi config'inizi anlamak için resmen dedektiflik yapmanız gerekiyor. Dashboard size **tek bakışta tam görünürlük** sağlar:

| İhtiyacınız olan | Claude'a sor | Görsel dashboard |
|---------------|:-----------:|:----------------:|
| **Tüm scope'ları tek seferde görmek** | Dizin dizin `ls` çalıştır, sonra parçaları birleştir | Scope ağacı, tek bakış |
| **Bulunduğum Project'te neler yükleniyor?** | Birden fazla komut çalıştır, hepsini yakaladığını um | Project'i aç → tam miras zincirini gör |
| **Öğeleri scope'lar arasında taşımak** | Encode edilmiş path'leri bul, `mv` ile elle taşı | Onaylı drag-and-drop |
| **Config içeriğini okumak** | Dosya dosya `cat` | Tıkla → yan panel |
| **Kopyaları / eski öğeleri bulmak** | `grep` ile anlaşılmaz dizinlerde ara | Arama + kategori filtresi |
| **Kullanılmayan memory'leri temizlemek** | Hangi dosyaları silmen gerektiğini kendin çıkar | Yerinde gez, oku, sil |

## Hızlı başlangıç

### Seçenek 1: npx (kurulum gerekmez)

```bash
npx @mcpware/claude-code-organizer
```

### Seçenek 2: Global kurulum

```bash
npm install -g @mcpware/claude-code-organizer
claude-code-organizer
```

### Seçenek 3: Claude'a sor

Bunu Claude Code içine yapıştırın:

> `npx @mcpware/claude-code-organizer` komutunu çalıştır; bu araç Claude Code ayarlarını yönetmek için bir dashboard açar. Hazır olunca URL'yi söyle.

`http://localhost:3847` adresinde bir dashboard açılır. Gerçek `~/.claude/` dizininizle çalışır.

## Neleri yönetir

| Tür | Görüntüle | Taşı | Nerede taranır | Neden kilitli? |
|------|:----:|:----:|:----------:|-------------|
| Memory (feedback, user, project, reference) | Evet | Evet | Global + Project | — |
| Skills | Evet | Evet | Global + Project | — |
| MCP Servers | Evet | Evet | Global + Project | — |
| Config (CLAUDE.md, settings.json) | Evet | Kilitli | Global + Project | Sistem ayarları; taşınırsa config bozulabilir |
| Hooks | Evet | Kilitli | Global + Project | Settings context'ine bağlıdır; taşınırsa sessiz hatalara yol açabilir |
| Plans | Evet | Evet | Global + Project | — |
| Plugins | Evet | Kilitli | Global only | Claude Code'un yönettiği cache |

## Scope hiyerarşisi

```
Global                       <- applies everywhere
  Company (workspace)        <- applies to all sub-projects
    CompanyRepo1             <- project-specific
    CompanyRepo2             <- project-specific
  SideProjects (project)     <- independent project
  Documents (project)        <- independent project
```

Alt scope'lar, üst scope'lardaki memory, skill ve MCP server'larını miras alır.

## Nasıl çalışır

1. **`~/.claude/` dizinini tarar** — tüm project'leri, memory'leri, skill'leri, MCP server'larını, hook'ları, plugin'leri ve planları keşfeder
2. **Scope hiyerarşisini belirler** — file system path'lerinden parent-child ilişkilerini çıkarır
3. **Dashboard'u render eder** — scope başlıkları > kategori çubukları > öğe satırları; doğru girintilemeyle
4. **Taşımaları yönetir** — bir öğeyi sürüklediğinizde ya da "Move to..." seçeneğine tıkladığınızda, güvenlik kontrolleriyle dosyaları diskte gerçekten taşır

## Karşılaştırma

Bulabildiğimiz tüm Claude Code config araçlarına baktık. Hiçbiri, bağımsız bir dashboard içinde görsel scope hiyerarşisini ve scope'lar arası drag-and-drop taşımayı birlikte sunmuyordu.

| İhtiyacım olan | Desktop app (600+⭐) | VS Code extension | Full-stack web app | **Claude Code Organizer** |
|---------|:---:|:---:|:---:|:---:|
| Scope hiyerarşisi ağacı | Hayır | Evet | Kısmen | **Evet** |
| Drag-and-drop taşıma | Hayır | Hayır | Hayır | **Evet** |
| Scope'lar arası taşıma | Hayır | Tek tık | Hayır | **Evet** |
| Eski öğeleri silme | Hayır | Hayır | Hayır | **Evet** |
| MCP araçları | Hayır | Hayır | Evet | **Evet** |
| Sıfır bağımlılık | Hayır (Tauri) | Hayır (VS Code) | Hayır (React+Rust+SQLite) | **Evet** |
| Bağımsız çalışma (IDE gerekmez) | Evet | Hayır | Evet | **Evet** |

## Platform desteği

| Platform | Durum |
|----------|:------:|
| Ubuntu / Linux | Destekleniyor |
| macOS (Intel + Apple Silicon) | Destekleniyor (topluluk tarafından Sequoia M3 üzerinde test edildi) |
| Windows | Henüz yok |
| WSL | Muhtemelen çalışır (test edilmedi) |

## Proje yapısı

```
src/
  scanner.mjs       # Scans ~/.claude/ — pure data, no side effects
  mover.mjs         # Moves files between scopes — safety checks + rollback
  server.mjs        # HTTP server — routes only, no logic
  ui/
    index.html       # HTML structure
    style.css        # All styling (edit freely, won't break logic)
    app.js           # Frontend rendering + SortableJS + interactions
bin/
  cli.mjs            # Entry point
```

Frontend ile backend tamamen ayrıdır. Görünümü değiştirmek için `src/ui/` altını düzenlemeniz yeterlidir; logic katmanına dokunmanız gerekmez.

## API

Dashboard bir REST API ile çalışır:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scan` | GET | Tüm özelleştirmeleri tarar; scope'ları, öğeleri ve sayıları döndürür |
| `/api/move` | POST | Bir öğeyi başka bir scope'a taşır (category/name ayrıştırmasını destekler) |
| `/api/delete` | POST | Bir öğeyi kalıcı olarak siler |
| `/api/restore` | POST | Silinen bir dosyayı geri yükler (undo için) |
| `/api/restore-mcp` | POST | Silinen bir MCP server kaydını geri yükler |
| `/api/destinations` | GET | Bir öğe için geçerli taşıma hedeflerini getirir |
| `/api/file-content` | GET | Detay paneli için dosya içeriğini okur |

## Lisans

MIT

## @mcpware'den diğer projeler

| Project | What it does | Install |
|---------|---|---|
| **[Instagram MCP](https://github.com/mcpware/instagram-mcp)** | 23 Instagram Graph API aracı; post'lar, yorumlar, DM'ler, story'ler, analytics | `npx @mcpware/instagram-mcp` |
| **[UI Annotator](https://github.com/mcpware/ui-annotator-mcp)** | Herhangi bir web sayfasında hover label'ları gösterir; AI öğelere adıyla referans verir | `npx @mcpware/ui-annotator` |
| **[Pagecast](https://github.com/mcpware/pagecast)** | MCP üzerinden tarayıcı oturumlarını GIF ya da video olarak kaydeder | `npx @mcpware/pagecast` |
| **[LogoLoom](https://github.com/mcpware/logoloom)** | AI logo tasarımı → SVG → tam brand kit export'u | `npx @mcpware/logoloom` |

## Yazar

[ithiria894](https://github.com/ithiria894) - Claude Code ekosistemi için araçlar geliştiriyor.
````

İsterseniz bir sonraki adımda bunu mevcut [README.tr.md](/home/nicole/MyGithub/claude-code-organizer/README.tr.md) dosyasına uygulanacak tek parça patch formatında da hazırlayabilirim.
