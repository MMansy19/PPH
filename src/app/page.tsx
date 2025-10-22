import { Hero } from '@/components/Landing/Hero'
import { generateWebApplicationSchema, generateOrganizationSchema } from '@/lib/schema'

export default function LandingPage() {
  const webAppSchema = generateWebApplicationSchema()
  const orgSchema = generateOrganizationSchema()

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Hero />
    </>
  )
}
