import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boza-store.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const { data: produits } = await supabase
    .from('produits')
    .select('slug, created_at')

  const productPages: MetadataRoute.Sitemap = (produits ?? []).map((produit) => ({
    url: `${baseUrl}/produit/${produit.slug}`,
    lastModified: produit.created_at ? new Date(produit.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${baseUrl}/catalogue/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}