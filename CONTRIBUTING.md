# Contributing

## Stacked PRs 與合併順序（防「連帶自動關閉」事故）

**已發生兩次事故（#69、#63/PR2）**：當一個 PR 的 base 是「另一個 PR 的分支」（stacked PR），
若 parent PR 合併並**刪除其 head 分支**，GitHub 會讓 child PR 的 base 指向一個已被刪除的分支
→ **自動關閉 child PR**。這不是人為否決，且很容易漏看，導致已審通過的碼被留在分支、沒進 main。

### 規則（擇一遵守，優先 1）
1. **合併 stacked PR 前，先把 child PR 的 base re-target 到 `main`**（GitHub PR 頁 Edit → 改 base），
   再合併 parent。
2. 或 **bottom-up 合併**：child 先合、parent 後合。
3. **不要刪除仍是某個 open PR 之 base 的分支。** repo 若開了「Automatically delete head branches」，
   合併 stacked parent 前先確認沒有 child 還指著它。

### Repo 設定層面的防呆（owner 可選）
- Settings → General → 可**關閉「Automatically delete head branches」**（改人工刪，刪前確認無 child PR 指著）。
- 保留自動刪除亦可，但務必遵守上面的合併順序。

### 若已誤關
child 分支通常還在。**rebase 到最新 `main` → 重開新 PR** 取代之（前例：#70 取代 #69；本 PR 取代 #63/PR2）。
重開時附 `git diff` 佐證與原審碼一致、無夾帶。
