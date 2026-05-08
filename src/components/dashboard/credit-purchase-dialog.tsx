"use client";

import { useMemo, useState } from "react";

import { buttonClass } from "@/src/components/ui/button";
import {
  formatCredits,
  formatTwd,
  getCreditPackageViews,
} from "@/src/lib/billing/credits";
import { cn } from "@/src/lib/cn";

type CreditPurchaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckoutOpened?: (message: string) => void;
};

function renderWindowLoadingHtml() {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>準備付款中</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", sans-serif; background: #f8fafc; color: #0f172a; }
    .container { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    .panel { width: 100%; max-width: 520px; border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; padding: 28px; }
    h1 { margin: 0; font-size: 20px; font-weight: 650; }
    p { margin: 10px 0 0; color: #475569; font-size: 14px; line-height: 1.7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="panel">
      <h1>準備付款中...</h1>
      <p>正在建立綠界付款請求，請稍候。</p>
    </div>
  </div>
</body>
</html>`;
}

export function CreditPurchaseDialog({
  open,
  onOpenChange,
  onCheckoutOpened,
}: CreditPurchaseDialogProps) {
  const packages = useMemo(() => getCreditPackageViews(), []);
  const [loadingPackageCode, setLoadingPackageCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout(packageCode: string) {
    setErrorMessage(null);
    setLoadingPackageCode(packageCode);

    const checkoutWindow = window.open("", "_blank");
    if (!checkoutWindow) {
      setErrorMessage("無法開啟付款視窗，請允許彈出視窗後再試一次。");
      setLoadingPackageCode(null);
      return;
    }

    checkoutWindow.document.open();
    checkoutWindow.document.write(renderWindowLoadingHtml());
    checkoutWindow.document.close();

    try {
      const response = await fetch("/api/billing/ecpay/credits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageCode }),
      });

      const html = await response.text();
      checkoutWindow.document.open();
      checkoutWindow.document.write(html);
      checkoutWindow.document.close();

      if (response.redirected && response.url.includes("/login")) {
        setErrorMessage("登入已過期，請重新登入後再試一次。");
        onCheckoutOpened?.("登入已過期，請重新登入後再試一次。");
        return;
      }

      if (response.ok) {
        const successMessage = "已開啟付款頁。付款完成後請回到此頁刷新餘額。";
        onCheckoutOpened?.(successMessage);
        onOpenChange(false);
        return;
      }

      setErrorMessage("付款頁開啟失敗，請稍後再試。");
      onCheckoutOpened?.("付款頁開啟失敗，請稍後再試。");
    } catch {
      checkoutWindow.close();
      setErrorMessage("目前無法連線到付款服務，請稍後再試。");
      onCheckoutOpened?.("付款頁開啟失敗，請稍後再試。");
    } finally {
      setLoadingPackageCode(null);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-label="關閉購買 credits 對話框"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-[920px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">購買 credits</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              credits 可用於 API 使用量與額外查詢。儲值完成後即加入帳戶，第一版不設到期日。
            </p>
            <p className="text-sm leading-7 text-slate-600">
              付款將透過綠界於新分頁完成，原頁會保留。
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            關閉
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {packages.map((pkg) => (
            <div
              key={pkg.packageCode}
              className={cn(
                "flex h-full flex-col rounded-xl border p-4",
                pkg.highlight === "best_value"
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{pkg.label}</p>
                {pkg.highlight === "best_value" ? (
                  <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                    最划算
                  </span>
                ) : null}
              </div>
              <div className="flex-1">
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {formatTwd(pkg.priceTwd)}
                </p>
                <p className="mt-1 text-sm text-slate-600">入帳 {formatCredits(pkg.credits)} credits</p>
                {pkg.bonusCredits > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    含額外加值 {formatCredits(pkg.bonusCredits)} credits（已計入入帳總額）
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">標準入帳</p>
                )}
              </div>
              <button
                type="button"
                disabled={loadingPackageCode !== null}
                onClick={() => handleCheckout(pkg.packageCode)}
                className={cn(
                  buttonClass(
                    "primary",
                    "mt-4 h-10 w-full rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800",
                  ),
                  loadingPackageCode !== null &&
                    "cursor-not-allowed bg-slate-300 text-slate-600 opacity-70 hover:bg-slate-300",
                )}
              >
                {loadingPackageCode === pkg.packageCode ? "準備付款中..." : "前往付款"}
              </button>
            </div>
          ))}
        </div>

        {errorMessage ? <p className="mt-4 text-xs text-red-600">{errorMessage}</p> : null}
        <p className="mt-1 text-xs text-slate-500">
          注意：client 僅會提交 packageCode，付款金額與入帳 credits 一律由 server 端 catalog 驗證。
        </p>
      </div>
    </div>
  );
}
