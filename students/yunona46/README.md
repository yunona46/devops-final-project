# Node.js DevOps Project - Full CI/CD Pipeline

**Автор:** Yunona46  
**Дата:** Листопад 2025

## 📋 Зміст

- [Опис проекту](#опис-проекту)
- [Технології](#технології)
- [Архітектура](#архітектура)
- [Локальний запуск](#локальний-запуск)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure as Code](#infrastructure-as-code)
- [Змінні середовища](#змінні-середовища)
- [Deployment](#deployment)

---

## 📖 Опис проекту

Повноцінний Node.js застосунок з PostgreSQL базою даних, автоматичним CI/CD через GitHub Actions, Infrastructure as Code через Terraform, та deployment на AWS EC2.

### Функціонал застосунку:

- 🚀 Express веб-сервер
- 🐘 PostgreSQL база даних
- 📊 Лічильник візитів з persistent storage
- 💾 RESTful API endpoints
- 🐳 Docker containerization
- 🔄 Docker Compose orchestration

### Endpoints:

- \GET /\ - Головна сторінка з лічильником візитів
- \GET /db-check\ - Перевірка підключення до БД
- \GET /stats\ - Статистика візитів
- \GET /health\ - Health check endpoint

---

## 🛠️ Технології

### Backend & Database:
- **Node.js** v18 LTS - JavaScript runtime
- **Express** v4.18 - Web framework
- **PostgreSQL** 15 Alpine - Relational database
- **pg** v8.11 - PostgreSQL client for Node.js

### DevOps & Infrastructure:
- **Docker** - Контейнеризація
- **Docker Compose** - Оркестрація контейнерів
- **GitHub Actions** - CI/CD automation
- **Terraform** - Infrastructure as Code
- **AWS EC2** - Cloud hosting
- **Docker Hub** - Container registry

### Version Control:
- **Git** - Version control system
- **GitHub** - Code hosting platform

---

## 🏗️ Архітектура

\\\
┌─────────────────────────────────────────────────────────────────┐
│                        Developer Workflow                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Git Push to    │
                    │   main branch    │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Actions CI/CD                        │
├─────────────────────────────────────────────────────────────────┤
│  1. Checkout code                                                │
│  2. Setup Docker Buildx                                          │
│  3. Login to Docker Hub                                          │
│  4. Extract Git commit hash                                      │
│  5. Build Docker image                                           │
│  6. Push to Docker Hub (tags: commit-hash + latest)             │
│  7. SSH to EC2                                                   │
│  8. Pull new image                                               │
│  9. Deploy via docker-compose                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Docker Hub     │
                    │   (Registry)     │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Docker Compose Services                       │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────┐    ┌─────────────────┐             │  │
│  │  │  Node.js App    │───▶│  PostgreSQL 15  │             │  │
│  │  │  Container      │    │  Container      │             │  │
│  │  │  (Port 3000)    │    │  (Port 5432)    │             │  │
│  │  └─────────────────┘    └─────────────────┘             │  │
│  │           │                      │                        │  │
│  │           │              Persistent Volume                │  │
│  │           │              (postgres_data)                  │  │
│  │           ▼                                               │  │
│  │    Custom Network                                         │  │
│  │    (app-network)                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         End Users
                    (http://EC2-IP:3000)
\\\

---

## 🚀 Локальний запуск

### Попередні вимоги:

- Node.js v18+ встановлений
- Docker Desktop запущений
- Git встановлений

### Крок 1: Клонування репозиторію

\\\ash
git clone https://github.com/YOUR_USERNAME/devops-final-project.git
cd devops-final-project/students/yunona46
\\\

### Крок 2: Встановлення залежностей

\\\ash
npm install
\\\

### Крок 3: Запуск через Docker Compose

\\\ash
# Збірка і запуск всіх сервісів
docker-compose up --build

# Або у фоновому режимі
docker-compose up -d

# Перегляд логів
docker-compose logs -f

# Зупинка
docker-compose down
\\\

### Крок 4: Перевірка

Відкрийте браузер: \http://localhost:3000\

**API тестування:**
\\\ash
curl http://localhost:3000
curl http://localhost:3000/db-check
curl http://localhost:3000/stats
curl http://localhost:3000/health
\\\

---

## 🔄 CI/CD Pipeline

### Workflow файл: \.github/workflows/deploy.yml\

**Тригер:** Push в гілку \main\

### Етапи pipeline:

#### 1. **Build Stage**
- Checkout коду з репозиторію
- Налаштування Docker Buildx для multi-platform builds
- Авторизація в Docker Hub
- Генерація унікального тегу з Git commit hash
- Збірка Docker образу
- Multi-tag push (commit hash + latest)

#### 2. **Deploy Stage**
- SSH підключення до EC2 через приватний ключ
- Автоматична перевірка і встановлення Docker (якщо потрібно)
- Створення docker-compose.yml на сервері
- Pull нового Docker образу з Docker Hub
- Graceful shutdown старих контейнерів
- Запуск нових контейнерів через docker-compose
- Health check verification
- Логування результатів

### Час виконання:
- Build + Push: ~1-2 хвилини
- Deploy: ~30-45 секунд
- **Загальний час:** ~2-3 хвилини

### Результат:
✅ Автоматичний deployment від commit до production  
✅ Zero-downtime deployment strategy  
✅ Automatic rollback capability  

---

## 🏗️ Infrastructure as Code

### Terraform конфігурація: \	erraform/\

#### Структура файлів:

\\\
terraform/
├── main.tf          # Основна конфігурація (EC2 + Security Group)
├── variables.tf     # Визначення змінних
├── outputs.tf       # Output значення (IP, Instance ID)
└── terraform.tfvars # Значення змінних (не в Git!)
\\\

#### Створювані ресурси:

**1. Security Group (\ws_security_group.nodejs_sg\):**
- SSH (22) - для адміністрування
- HTTP (80) - для веб-трафіку
- HTTPS (443) - для безпечного з'єднання
- Custom (3000) - Node.js застосунок
- Custom (5432) - PostgreSQL

**2. EC2 Instance (\ws_instance.nodejs_server\):**
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.micro (Free Tier)
- Key Pair: nodejs-app-key-2025
- User Data: автоматичне встановлення Docker при створенні
- Tags: Name = nodejs-app-server

#### Використання:

\\\ash
cd terraform

# Ініціалізація (перший раз)
terraform init

# Перегляд змін (без застосування)
terraform plan

# Створення інфраструктури
terraform apply
# Введіть: yes

# Отримання outputs
terraform output instance_ip

# Видалення інфраструктури
terraform destroy
# Введіть: yes
\\\

#### Outputs після apply:

\\\
instance_id = "i-0da96607916d861c5"
instance_ip = "16.171.39.2"
security_group_id = "sg-067aa3937f1d87211"
\\\

---

## 🔐 Змінні середовища

### GitHub Secrets (обов'язкові):

| Secret Name | Опис | Приклад |
|------------|------|---------|
| \DOCKERHUB_USERNAME\ | Docker Hub username | \yunona46\ |
| \DOCKERHUB_TOKEN\ | Docker Hub Personal Access Token | \dckr_pat_...\ |
| \EC2_HOST\ | Public IP EC2 інстансу | \16.171.39.2\ |
| \EC2_USER\ | SSH username для EC2 | \ubuntu\ |
| \EC2_SSH_KEY\ | Private SSH key (.pem) | \-----BEGIN RSA...\ |

### Змінні середовища застосунку:

| Variable | Default | Опис |
|----------|---------|------|
| \NODE_ENV\ | \development\ | Environment mode |
| \PORT\ | \3000\ | Application port |
| \DB_HOST\ | \localhost\ | PostgreSQL host |
| \DB_PORT\ | \5432\ | PostgreSQL port |
| \DB_NAME\ | \mydb\ | Database name |
| \DB_USER\ | \postgres\ | Database user |
| \DB_PASSWORD\ | \postgres123\ | Database password |

### Налаштування Secrets в GitHub:

1. Repository → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**
4. Додайте кожен secret зі списку вище

---

## 📦 Deployment

### Автоматичний деплой:

\\\ash
# Просто зробіть commit і push
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions автоматично:
# 1. Збере Docker образ
# 2. Завантажить у Docker Hub
# 3. Задеплоїть на EC2
\\\

### Ручний деплой на EC2:

\\\ash
# SSH на сервер
ssh -i nodejs-app-key-2025.pem ubuntu@16.171.39.2

# На сервері
cd ~/nodeapp
sudo docker-compose pull
sudo docker-compose up -d

# Перевірка
sudo docker-compose ps
sudo docker-compose logs -f app
\\\

### Rollback до попередньої версії:

\\\ash
# На EC2
cd ~/nodeapp

# Змініть тег в docker-compose.yml на попередній commit hash
sudo nano docker-compose.yml
# Змініть: image: yunona46/nodeapp:NEW_HASH
#      на: image: yunona46/nodeapp:OLD_HASH

# Перезапустіть
sudo docker-compose down
sudo docker-compose up -d
\\\

---

## 📁 Структура проекту

\\\
yunona46/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── terraform/
│   ├── main.tf                 # EC2 + Security Group
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # Output values
│   └── terraform.tfvars        # Variable values (not in Git!)
├── index.js                    # Express app + PostgreSQL
├── package.json                # Dependencies
├── package-lock.json           # Locked dependencies
├── Dockerfile                  # Container image instructions
├── .dockerignore               # Files excluded from image
├── docker-compose.yml          # Multi-container orchestration
├── .gitignore                  # Files excluded from Git
└── README.md                   # This file
\\\

---

## 🐳 Dockerfile оптимізації

### Multi-layer caching:

\\\dockerfile
FROM node:lts                    # Base image

WORKDIR /app                     # Working directory

# Спочатку копіюємо package.json (кешування залежностей)
COPY package*.json ./
RUN npm install

# Потім копіюємо код (часто змінюється)
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
\\\

**Переваги:**
- Шари з \
pm install\ кешуються
- Зміни коду не тригерять reinstall залежностей
- Швидша збірка (30 сек замість 2 хв)

---

## 📊 Моніторинг і логи

### Перегляд логів:

\\\ash
# Всі контейнери
docker-compose logs

# Тільки app
docker-compose logs app

# Реал-тайм
docker-compose logs -f

# Останні 50 рядків
docker-compose logs --tail=50 app
\\\

### Статус контейнерів:

\\\ash
docker-compose ps
docker stats
\\\

---

## 🔧 Troubleshooting

### Проблема: Контейнер не запускається

\\\ash
# Перевірте логи
docker-compose logs app

# Перевірте образ
docker images | grep nodeapp

# Пересоберіть образ
docker-compose build --no-cache
docker-compose up -d
\\\

### Проблема: База даних не підключається

\\\ash
# Перевірте PostgreSQL
docker-compose logs db

# Перевірте health check
docker-compose ps

# Перезапустіть БД
docker-compose restart db
\\\

### Проблема: Порт зайнятий

\\\ash
# Windows
netstat -ano | findstr :3000

# Вб'ємо процес
taskkill /PID <PID> /F
\\\

---

## 📈 Майбутні покращення

- [ ] Додати HTTPS через Let's Encrypt
- [ ] Реалізувати Nginx reverse proxy
- [ ] Додати Prometheus + Grafana моніторинг
- [ ] Реалізувати multi-stage build для Dockerfile
- [ ] Додати automated tests (Jest)
- [ ] Реалізувати blue-green deployment
- [ ] Додати backup стратегію для PostgreSQL
- [ ] Впровадити secrets management (AWS Secrets Manager)

---

## 📝 Ліцензія

Навчальний проект для курсу DevOps.

---

## 👤 Автор

**Yunona46**
- GitHub: [@yunona46](https://github.com/yunona46)
- Docker Hub: [yunona46](https://hub.docker.com/u/yunona46)

---

## 🎓 Acknowledgments

Практичні заняття 9-14 курсу DevOps.  
Інструменти: Git, Docker, GitHub Actions, Terraform, AWS EC2, PostgreSQL.

**Дата завершення:** Листопад 2025

<!-- CI/CD test -->

<!-- CI/CD test -->
