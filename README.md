# 📄 README — ContratoExpress (nome provisório)

Gere contratos profissionais em minutos. Simples. Rápido. Automatizado.

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Next.js-14-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Supabase-Postgres-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Node.js-18-brightgreen?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-blueviolet?style=for-the-badge"/>
</p>

---

## 🚀 ContratoExpress — Automação de contratos para qualquer pessoa

O **ContratoExpress** é uma aplicação **SaaS** que permite a geração de contratos e termos profissionais de forma automática, rápida e acessível.  
O usuário escolhe um modelo, preenche dados simples e o sistema gera um **PDF pronto**, liberado após pagamento.

O objetivo é atender MEIs, freelancers, autônomos e pequenos negócios que precisam de contratos rápidos e profissionais.

---

## 🧩 Funcionalidades (MVP – Versão 1.0)

### ✔️ Autenticação
- Login e cadastro com e-mail/senha  
- Gerenciamento de sessão  
- Logout seguro  

### ✔️ Modelos de contrato
- 3 a 5 modelos iniciais (ex.: Prestação de Serviços, Compra e Venda, Termo de Responsabilidade…)  
- Cada modelo possui campos editáveis específicos  

### ✔️ Geração de Contrato
- Substituição automática das variáveis do template  
- Preview completo  
- Exportação para PDF com layout profissional  

### ✔️ Pagamentos
- Pagamento por contrato (modelo *Pay-per-PDF*)  
- PDF liberado após pagamento confirmado  
- Histórico de compras registrado  

### ✔️ Dashboard do usuário
- Histórico de contratos  
- Pagamentos realizados  
- Acesso rápido aos PDFs anteriores  

### ✔️ Hospedagem otimizada
- Deploy automático via Vercel  
- Banco e autenticação via Supabase  

---

## 🛠 Tecnologias Utilizadas

### **Frontend**
- Next.js 14 (App Router)  
- React  
- TailwindCSS  
- ShadCN UI  

### **Backend**
- API Routes (Next.js)  
- PDFLib (geração de PDFs)  
- Stripe ou Mercado Pago  

### **Banco de Dados**
- Supabase (PostgreSQL)

### **Tabelas**
- `users`  
- `modelos`  
- `contratos`  
- `pagamentos`  

### **Autenticação**
- Supabase Auth

### **Deploy**
- Vercel

---

## 🧱 Arquitetura do Projeto
```
contratoexpress/
├─ app/
│ ├─ (public)/
│ ├─ login/
│ ├─ dashboard/
│ ├─ modelos/
│ ├─ gerar/
│ ├─ pagamento/
│ ├─ api/
│ │ ├─ contratos/
│ │ ├─ pdf/
│ │ └─ pagamentos/
│ └─ layout.tsx
├─ components/
├─ lib/
│ ├─ supabase.ts
│ ├─ stripe.ts
│ └─ pdf.ts
├─ supabase/
├─ public/
├─ package.json
└─ README.md
```
## 🗄 Estrutura do Banco de Dados (Supabase)

### **Tabela: modelos**

| Campo      | Tipo      | Descrição                                  |
|------------|-----------|----------------------------------------------|
| id         | uuid      | PK                                           |
| nome       | text      | Nome do modelo                               |
| descricao  | text      | Descrição breve                               |
| template   | text      | Texto com variáveis (ex.: {{nome}}, {{data}}) |
| campos     | json      | Lista de campos necessários                   |
| criado_em  | timestamp | Data de criação                               |

---

### **Tabela: contratos**

| Campo      | Tipo      |
|------------|-----------|
| id         | uuid      |
| user_id    | uuid      |
| modelo_id  | uuid      |
| dados      | json      |
| pdf_url    | text      |
| criado_em  | timestamp |

---

### **Tabela: pagamentos**

| Campo        | Tipo                         |
|--------------|------------------------------|
| id           | uuid                         |
| user_id      | uuid                         |
| contrato_id  | uuid                         |
| valor        | numeric                      |
| status       | text (pending, paid, failed) |
| criado_em    | timestamp                    |

---

## 💰 Modelo de Monetização

### **1. Pagamento por contrato (inicial)**
- Visualização gratuita  
- PDF pago (R$ 9,90 sugerido)

### **2. Assinatura mensal (fase 2)**
- Contratos ilimitados  
- R$ 19 a R$ 29/mês

### **3. Planos empresariais (futuro)**
- Uso intensivo  
- R$ 99 a R$ 199/mês
---
## 📜 Licença
Este projeto é proprietário. Todos os direitos reservados © 2025 Gustavo Giacoia.
---
## Autor
Gustavo Giacoia <br>
Desenvolvedor Web • Engenharia de Software