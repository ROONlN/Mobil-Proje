# TeknoCast - BSM447 Dönem Ödevi

## Öğrenci ve atama bilgileri

- Öğrenci numarası: **G231210046**
- Konu: **K27 - Podcast ve Sesli Kitap**
- Varyant: **c - Teknoloji podcast'leri**
- API: `https://itunes.apple.com/search?limit=25&term=technology&entity=podcast`
- Ek kural: **2 - A→Z / Z→A sıralama**
- Kalıcı veri yöntemi: **AsyncStorage**

## Uygulamanın amacı

TeknoCast, iTunes Search API'den teknoloji podcast'lerini çalışma anında çeker. Kullanıcı podcast ve yayıncı adına göre arama yapabilir, tür çipleriyle listeyi süzebilir, listeyi A→Z veya Z→A sıralayabilir, ayrıntıları inceleyebilir ve seçtiklerini kalıcı olarak kaydedebilir.

## Özellikler

- React Native + Expo + TypeScript
- `fetch` ve `useEffect` ile canlı API verisi
- `FlatList` ve `collectionId` anahtarı
- Büyük/küçük harfe duyarsız arama
- Tür (`primaryGenreName`) çipleriyle süzme
- A→Z / Z→A sıralama düğmesi
- Bottom Tab + Native Stack navigasyonu
- Navigasyon parametresiyle ayrıntı ekranı
- AsyncStorage ile kalıcı kayıtlar
- Büyük podcast kapağı (`600x600bb`)
- Bölüm sayısı, tür ve son bölüm tarihi
- Son bölüm tarihini "x gün önce" gösterme
- Apple Podcasts bağlantısını açma

## Kurulum

```bash
npm install
npx expo start
```

Kontrolden önce:

```bash
npx expo-doctor
npx tsc --noEmit
```

## APK oluşturma

```bash
npx eas build -p android --profile preview
```

## Ekran görüntüleri

Teslimden önce bu bölüme Liste, Detay ve Kaydedilenler ekran görüntüleri eklenecektir.

## Bağlantılar

- APK: Teslimden önce eklenecek.
- En fazla 1 dakikalık ekran kaydı: Teslimden önce eklenecek.
