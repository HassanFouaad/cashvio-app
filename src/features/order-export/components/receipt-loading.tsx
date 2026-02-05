"use client";

export function ReceiptLoading() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden animate-pulse">
        {/* Header Skeleton */}
        <div className="p-6 bg-muted/30">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-muted rounded-xl" />
            <div className="w-32 h-6 bg-muted rounded" />
            <div className="w-48 h-4 bg-muted rounded" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-border" />

        {/* Order Summary Skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="w-20 h-3 bg-muted rounded" />
              <div className="w-24 h-5 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-3 bg-muted rounded" />
              <div className="w-28 h-4 bg-muted rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-6 bg-muted rounded-full" />
            <div className="w-16 h-6 bg-muted rounded-full" />
            <div className="w-18 h-6 bg-muted rounded-full" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-6" />

        {/* Items Skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-muted rounded" />
            <div className="w-12 h-3 bg-muted rounded" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 pb-3 border-b border-border/50 last:border-0">
              <div className="flex justify-between">
                <div className="w-32 h-4 bg-muted rounded" />
                <div className="w-8 h-4 bg-muted rounded" />
              </div>
              <div className="flex justify-between">
                <div className="w-20 h-3 bg-muted rounded" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-6" />

        {/* Pricing Skeleton */}
        <div className="p-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="w-20 h-4 bg-muted rounded" />
              <div className="w-16 h-4 bg-muted rounded" />
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between">
            <div className="w-16 h-5 bg-muted rounded" />
            <div className="w-24 h-6 bg-muted rounded" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="p-6 bg-muted/30">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-40 h-4 bg-muted rounded" />
            <div className="w-24 h-3 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
