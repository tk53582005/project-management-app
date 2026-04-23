# Project Management App

## Overview
シンプルなプロジェクト管理アプリです。  
React + AWS (API Gateway / Lambda / DynamoDB) を使ってCRUD機能を実装しています。  
フロントエンドとサーバーレスバックエンドを統合したアプリです。

---

## Tech Stack

- React (Vite)
- Tailwind CSS
- AWS API Gateway
- AWS Lambda
- Amazon DynamoDB

---

## Features

- プロジェクト作成
- プロジェクト一覧表示
- ステータス更新（planned / in-progress / completed）
- プロジェクト削除
- ステータスフィルター
- 検索機能（プロジェクト名 / クライアント名）

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
GET    /projects              # プロジェクト一覧取得
POST   /projects              # プロジェクト作成
PUT    /projects/{projectId}  # ステータス更新
DELETE /projects/{projectId}  # 削除
```