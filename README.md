# Deployment with Docker and Github Actions

NestJS 11, Prisma 7 ve PostgreSQL ile geliştirilmiş REST API.

## Gereksinimler

- Docker Desktop
- PostgreSQL (lokal, `5432` portunda)
- Node.js 24 ve Bun (yalnızca Docker olmadan çalıştırmak için)

## Kurulum

```bash
cp .env.example .env
```

`.env` içindeki `POSTGRES_USER`, `POSTGRES_PASSWORD` ve `POSTGRES_DB` değerlerini lokal PostgreSQL bilgilerinle doldur.

## Docker ile çalıştırma

```bash
docker compose up -d --build
docker compose logs -f backend
```

| Adres                      | Açıklama   |
| -------------------------- | ---------- |
| http://localhost:4200/api  | API        |
| http://localhost:4200/docs | Swagger UI |

Loglar terminale akacak şekilde çalıştırmak için:

```bash
docker compose up --build             # Ctrl+C tüm servisleri durdurur
```

Cache temizleyip sıfırdan build almak için:

```bash
docker compose down
docker builder prune -af
docker compose build --no-cache
docker compose up -d && docker compose logs -f migrate backend
```

Durdurmak için:

```bash
docker compose down
```

### Servisler

| Servis    | Görev                                                                       |
| --------- | --------------------------------------------------------------------------- |
| `migrate` | Bekleyen migration'ları uygular ve kapanır. `Exited (0)` beklenen durumdur. |
| `backend` | NestJS uygulaması. `migrate` başarıyla tamamlandıktan sonra başlar.         |

Konteynerler lokal PostgreSQL'e `host.docker.internal:5432` üzerinden bağlanır.

### Sık kullanılan komutlar

```bash
docker compose ps -a                  # servis durumları
docker compose logs migrate           # migration çıktısı
docker compose restart backend        # backend'i yeniden başlat
docker compose run --rm migrate       # migration'ları tekrar çalıştır
```

## Migration

Migration'lar lokalde oluşturulur, Docker başlatılırken otomatik uygulanır:

```bash
npm run db:migrate -- --name <migration_adi>
docker compose up -d --build
```

## Docker olmadan çalıştırma

```bash
npm install
npm run db:generate
npm run db:migrate
npm run start:dev
```

## Sorun giderme

| Belirti                              | Çözüm                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| `P1001: Can't reach database server` | Lokal PostgreSQL'in çalıştığını ve `.env` bilgilerinin doğru olduğunu kontrol et. |
| `backend` başlamıyor                 | `docker compose logs migrate` ile migration hatasını incele.                      |
| Kod değişikliği yansımıyor           | `--build` parametresiyle yeniden başlat.                                          |
| `http://localhost:4200/` 404 dönüyor | Beklenen davranış; tüm endpoint'ler `/api` altındadır.                            |

## Production

`host.docker.internal` yalnızca lokal geliştirme içindir. Production ortamında `DATABASE_URL` hedef veritabanını (ör. RDS) göstermeli ve `NODE_ENV=production` olmalıdır.
