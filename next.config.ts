const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zulsoupdlavbsrcinybc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;