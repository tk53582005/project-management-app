# Project Management App

## Overview
シンプルなプロジェクト管理アプリです。  
React + AWS (API Gateway / Lambda / DynamoDB / Cognito) を使ってCRUD機能を実装しています。  
フロントエンドとサーバーレスバックエンドを統合したアプリです。

---

## Architecture

![architecture](./architecture.png)

Serverless architecture using AWS (API Gateway, Lambda, DynamoDB, Cognito)

---

## Tech Stack

- React (Vite / JavaScript / JSX)
- Tailwind CSS
- AWS API Gateway
- AWS Lambda (Node.js)
- Amazon DynamoDB
- Amazon Cognito

---

## Features

- プロジェクト作成
- プロジェクト一覧表示
- ステータス更新（planned / in-progress / completed）
- プロジェクト削除
- ステータスフィルター
- 検索機能（プロジェクト名 / クライアント名）
- 請求書管理（作成 / 更新 / 削除）
- ユーザー認証（Cognito + JWT）
- ユーザーごとのデータ分離

---

## UI

- Tailwind CSS を使用
- カードUI
- ステータスに応じたカラー表示

---

## Screenshot

![app](./screenshot.png)

---

## How to Run

```bash
npm install
npm run dev
```

---

## API

```
# Projects
GET    /projects
POST   /projects
PUT    /projects/{projectId}
DELETE /projects/{projectId}

# Invoices
GET    /invoices
POST   /invoices
PUT    /invoices/{invoiceId}
DELETE /invoices/{invoiceId}
```