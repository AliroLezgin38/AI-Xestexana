import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack watchOptions yalnız 'npm run dev' üçün lazım idi, 
  // lakin Build (Vercel) zamanı Turbopack ilə konflikt yaratdığı üçün onu təmizlədik.
  // Çünki Build zamanı faylları "izləməyə" ehtiyac yoxdur.
};

export default nextConfig;
