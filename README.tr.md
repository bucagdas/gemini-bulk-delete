# Gemini Bulk Delete (Gemini Hızlı Sil)

[English](README.md)

Gemini sohbetlerini toplu silmenizi sağlayan bir yer imi.

Gemini sohbetleri tek tek silmenize izin veriyor: menüyü aç, sil'e
bas, onayla, tekrarla. Bu yer imi gemini.google.com'a küçük bir panel
ekliyor. Tüm sohbetlerinizi yükleyip başlığa göre filtreleyebilir,
istediklerinizi işaretleyip tek seferde silebilirsiniz.

![Filtre uygulanmış ve iki sohbetin seçili olduğu panel](docs/03-filtre-secim.png)

## Kurulum

1. Tarayıcınızda yeni bir yer imi oluşturun (herhangi bir sayfa,
   herhangi bir ad).
2. Yer imini düzenleyin ve adres kısmına
   [`bookmarklet.txt`](bookmarklet.txt) dosyasının tamamını yapıştırın.
3. Kaydedin, tercihen yer imleri çubuğuna.

İsterseniz [proje sayfasındaki](https://bucagdas.com/proje/gemini-hizli-sil/)
hazır düğmeyi yer imleri çubuğuna sürükleyerek de kurabilirsiniz.

## Kullanım

1. [gemini.google.com](https://gemini.google.com) adresini açın ve
   oturum açın.
2. Yer imine tıklayın. Solda bir panel açılır.
3. **Tümünü Yükle**'ye basın. Panel sohbet listesini baştan sona
   kaydırıp bütün sohbetleri toplar.
4. Filtre kutusuna yazarak listeyi başlığa göre daraltın.
5. Sohbetleri tek tek işaretleyin ya da **Görünenleri Seç / Bırak**
   ile o an görünenlerin hepsini seçin.
6. **Hızlı Sil (n)**'ye basın, onay penceresini onaylayın ve bekleyin.
   İş bitince sayfa kendiliğinden yenilenir.

Paneli kapatmak için yer imine tekrar ya da köşedeki ✕'e basın.

## Kullanmadan önce

- **Silme kalıcı.** Geri alma yok. Silinen sohbetler geri gelmez;
  onlardan oluşturduğunuz herkese açık paylaşım linkleri de çalışmaz
  hale gelir.
- **Resmi değil.** Silme işlemi, Gemini sayfasının kendi içinde
  kullandığı web bağlantısı üzerinden yapılıyor (`batchexecute`, RPC
  `GzXR5e`). Belgelenmiş bir API değil; Google değiştirirse yer imi
  çalışmayı bırakır.
- **Arayüz dili.** Sohbetler kenar çubuğundaki "diğer seçenekler"
  düğmelerinden bulunuyor. Gemini arayüzü Türkçe ya da İngilizce ise
  çalışır.
- **Hız.** Sohbetler dörder dörder, aralarında kısa beklemelerle
  siliniyor.

## Gizlilik

Her şey kendi tarayıcı sekmenizde, zaten açık olan oturumunuzla
çalışıyor. gemini.google.com dışında hiçbir yere veri gönderilmiyor.

## Dosyalar

- `bookmarklet.txt`: Yer imi adresi olarak yapıştırılmaya hazır hali.
- `src/gemini-bulk-delete.js`: Aynı kodun okunabilir, açıklamalı hali.

## Lisans

MIT
