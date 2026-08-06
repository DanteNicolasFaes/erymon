interface UpdateSeoParams {
  title: string
  description: string
  path: string
}

export function updateSeo({ title, description, path }: UpdateSeoParams) {
  const url = `https://erymon.com${path}`

  document.title = title

  document.getElementById('meta-description')?.setAttribute('content', description)
  document.getElementById('canonical-link')?.setAttribute('href', url)

  document.getElementById('og-title')?.setAttribute('content', title)
  document.getElementById('og-description')?.setAttribute('content', description)
  document.getElementById('og-url')?.setAttribute('content', url)

  document.getElementById('twitter-title')?.setAttribute('content', title)
  document.getElementById('twitter-description')?.setAttribute('content', description)
}
