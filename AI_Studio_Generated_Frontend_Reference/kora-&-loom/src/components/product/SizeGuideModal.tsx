import { Ruler, X } from 'lucide-react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  isBlouse?: boolean;
}

export function SizeGuideModal({ open, onClose, isBlouse = false }: SizeGuideModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg border border-[#E5E0D8] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-[#14532D]" />
            <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
              {isBlouse ? 'Tailored Blouse Size Guide' : 'Saree Drape & Measurement Guide'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="rounded p-1.5 text-[#57534E] hover:bg-[#F2EFE9]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isBlouse ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-[#57534E]">
              Every Kora &amp; Loom blouse includes a 2-inch inner seam allowance on both sides for easy local adjustment.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm tabular-nums border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E0D8] text-xs uppercase text-[#57534E]">
                    <th className="py-2 pr-4">Size</th>
                    <th className="py-2 pr-4">Bust</th>
                    <th className="py-2 pr-4">Underbust</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">S (34)</td>
                    <td className="py-2.5 pr-4">34 in</td>
                    <td className="py-2.5 pr-4">28–29 in</td>
                    <td className="py-2.5">14.5 in</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">M (36)</td>
                    <td className="py-2.5 pr-4">36 in</td>
                    <td className="py-2.5 pr-4">30–31 in</td>
                    <td className="py-2.5">15.0 in</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">L (38)</td>
                    <td className="py-2.5 pr-4">38 in</td>
                    <td className="py-2.5 pr-4">32–33 in</td>
                    <td className="py-2.5">15.0 in</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold">XL (40)</td>
                    <td className="py-2.5 pr-4">40 in</td>
                    <td className="py-2.5 pr-4">34–35 in</td>
                    <td className="py-2.5">15.5 in</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-[#57534E]">
            <div className="rounded-md bg-[#FAF9F6] p-3.5 border border-[#E5E0D8] space-y-1.5 text-[#1C1917]">
              <p className="font-semibold">Standard Full-Length Drape: 5.5m Saree + 0.85m–0.9m Blouse</p>
              <p className="text-xs text-[#57534E]">
                Width: 45–47 inches · Comfortably accommodates heights from 4&apos;11&quot; to 5&apos;10&quot; with 5–7 full front pleats.
              </p>
            </div>
            <p>
              Need fall &amp; pico finishing before dispatch? Mention it at checkout—all handloom silk sarees arrive tassel-knotted and ready for ceremonies.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F3F22]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
