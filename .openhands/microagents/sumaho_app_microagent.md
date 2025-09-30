
---
name: sumaho_app_microagent
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers: []
---

# スマホアプリ登録自動化マイクロエージェント

## 概要
このマイクロエージェントは、旧メーター・新メーターの登録作業を自動化・半自動化し、ヒューマンエラーを低減します。旧メーターはカメラ読取・OCR・Gemini API構造化で自動登録、新メーターはQRコード読取で自動入力。データはDBに保存され、管理画面で確認・検索・CSV出力が可能です。

## 機能要件
- 旧メーター登録：カメラ→OCR→Gemini API→自動入力
- 旧メーター番号から顧客番号自動取得（DB紐付けチェック、未紐付時エラー表示）
- 新メーター登録：QRコード→自動入力
- データ入力画面：事業者コード・旧/新メーター番号・交換/取付指針・口径・取付年月日をDB保存
- 管理画面：データ確認・検索・CSV出力・IP制限
- 三層API連携（スマホアプリ・API・DB）

## 非機能要件
- セキュリティ：API認証・IP制限・暗号化・監査ログ
- 信頼性：OCR/QRリトライ・エラーハンドリング・整合性チェック
- 拡張性：データ項目追加時の後方互換性
- 運用性：監視指標・障害対応・バックアップ

## データベーススキーマ案
- tbl_business, tbl_customer, tbl_meter_old, tbl_meter_new, tbl_registration, tbl_audit
- 詳細は要件定義書参照

## API仕様例
- 認証: POST /api/auth/login
- 登録: POST /api/registrations
- 検索: GET /api/registrations?filter=
- CSV出力: GET /api/registrations/export
- 顧客・メータ関連: GET /api/customers/{old_meter_number} など
- 管理画面: GET /admin/health, GET /admin/logs, POST /admin/export

## テスト計画
- 単体・結合・API・UIテスト
- OCR/QR信頼性試験
- バリデーション・エラーハンドリング・DB整合性・CSV出力・パフォーマンス

## 注意事項
- トリガーはありません。手動で実行してください。
