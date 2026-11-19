import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#F2EFE9]/60 text-[#1C1917]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-display text-2xl font-bold tracking-tight">Kora &amp; Loom</p>
            <p className="text-sm leading-relaxed text-[#57534E]">
              Weaver-direct handloom sarees, cotton-lined stitched blouses, and heritage jewellery crafted in Kanchipuram,
              Varanasi, Chanderi, and Maheshwar.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#57534E]">Shop Collections</h3>
            <ul className="space-y-2 text-sm text-[#1C1917]">
              <li>
                <Link to="/collections/silk-sarees" className="hover:text-[#14532D] hover:underline">
                  Heirloom Silk Sarees
                </Link>
              </li>
              <li>
                <Link to="/collections/cotton-linen" className="hover:text-[#14532D] hover:underline">
                  Summer Cottons &amp; Linens
                </Link>
              </li>
              <li>
                <Link to="/collections/blouses-jewellery" className="hover:text-[#14532D] hover:underline">
                  Ready-Made Blouses &amp; Jhumkas
                </Link>
              </li>
              <li>
                <Link to="/collections/under-1500" className="hover:text-[#14532D] hover:underline">
                  Everyday Under ₹1,500
                </Link>
              </li>
              <li>
                <Link to="/campaign/diwali" className="hover:text-[#14532D] hover:underline">
                  The Diwali Loom Edit
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#57534E]">Customer Care</h3>
            <ul className="space-y-2 text-sm text-[#1C1917]">
              <li>
                <Link to="/account" className="hover:text-[#14532D] hover:underline">
                  Track Order &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-[#14532D] hover:underline">
                  30-Second Saree Finder
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#14532D] hover:underline">
                  Buy More – Save More Guide
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#14532D] hover:underline">
                  7-Day Returns &amp; Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#57534E]">Payment &amp; Trust</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Silk Mark verified weaves · Cash on Delivery (COD), UPI, and all major Cards accepted pan-India.
            </p>
            <p className="text-xs text-[#57534E]">
              Studio Desk: Mon–Sat, 10 AM – 7 PM IST · care@koraandloom.in
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[#E5E0D8] pt-6 text-xs text-[#57534E] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Kora &amp; Loom Textiles Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/support" className="hover:text-[#1C1917]">
              Privacy &amp; Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/support" className="hover:text-[#1C1917]">
              Shipping &amp; COD Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
