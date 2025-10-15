"use client";

export function BetaBanner() {
  const isBetaApp = process.env.NEXT_PUBLIC_BETA_APP === "true";

  if (!isBetaApp) {
    return null;
  }

  return (
    <div className="mx-2 mt-auto mb-2 p-3 bg-[#CFC8FE] rounded-lg text-black text-xs">
      <div className="font-medium mb-2">
        🚀 Бета-версія
      </div>
      <div className="mb-3 leading-relaxed">
        Використовуйте нашу бета-версію та допоможіть вдосконалити продукт разом з командою R&D!
      </div>
    </div>
  );
}