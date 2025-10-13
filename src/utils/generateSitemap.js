// Utilitário para gerar sitemap dinâmico
export const generateSitemap = (viagens = []) => {
  const baseUrl = 'https://khaki-alpaca-178991.hostingersite.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: '/sobre',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    }
  ];

  const viagemPages = viagens.map(viagem => ({
    url: `/viagem/${viagem.id}`,
    lastmod: viagem.updated_at ? new Date(viagem.updated_at).toISOString().split('T')[0] : currentDate,
    changefreq: 'monthly',
    priority: '0.9'
  }));

  const allPages = [...staticPages, ...viagemPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Função para baixar o sitemap como arquivo
export const downloadSitemap = (viagens) => {
  const sitemap = generateSitemap(viagens);
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

