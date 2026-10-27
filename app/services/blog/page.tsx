import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Which CMS do you use for the blog?",
    answer:
      "Usually a headless CMS such as Sanity, Contentful or Strapi, or MDX files if you prefer writing in Markdown and committing to the repository. All of them give you a fast site; the choice is about how you like to write.",
  },
  {
    question: "Will articles be set up to rank?",
    answer:
      "Each post gets its own metadata, Article schema, canonical URL, internal links and an entry in the sitemap, and the structure supports categories and tags without creating duplicate-content problems. The writing is still what decides whether it ranks.",
  },
  {
    question: "Can we add a newsletter and monetisation?",
    answer:
      "Yes — newsletter signup with Mailchimp, ConvertKit or Resend, plus ad slots, sponsored post layouts or paid-member gating if you want to monetise the content later.",
  },
  {
    question: "How fast will the blog load with hundreds of articles?",
    answer:
      "Posts are statically generated and served from a CDN, so page weight stays the same whether you have 10 posts or 10,000. New posts can publish without rebuilding the whole site.",
  },
];

export const metadata = pageMeta({
  title: "Blog & Content Website Development with CMS",
  description: "Blog and content website development with a CMS, categories, newsletters, schema markup and SEO structure that ranks. Built for publishers and businesses worldwide.",
  path: "/services/blog",
  keywords: ["blog website development", "content website with CMS", "news website development company", "SEO blog development"],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function BlogServicePage() {
  const pricing = await getServicePricing("blog");
  return (
    <>
      <ServiceSeo slug="blog" faqs={faqs} />
      <ServiceDetail
      title="Blog / Content Website"
      category="For Bloggers & Content Creators 📝"
      icon="fa-blog"
      color="#10b981"
      gradient="from-emerald-500 to-teal-600"
      targetAudience={[
        "Bloggers & Writers",
        "Content Creators",
        "News Portals",
        "Magazines",
        "Affiliate Marketers",
      ]}
      features={[
        "Article Publishing System",
        "Categories & Tags Management",
        "Commenting System",
        "Search Functionality",
        "Related Posts Section",
        "Newsletter Integration",
        "SEO Optimized Structure",
        "Social Sharing Buttons",
        "Author Profiles",
        "Analytics Dashboard",
      ]}
      description="Grow your audience and rank on Google with SEO-friendly blogs"
      longDescription="Start your blogging journey with a professional, fast, and SEO-friendly blog website. We build content-focused platforms that help you rank on Google, grow your audience, and monetize your content. With easy-to-use content management, you can focus on writing while your blog handles the technical side perfectly."
      price={pricing.price}
      delivery={pricing.delivery}
      benefits={[
        "Better Google Rankings",
        "Grow Email List Fast",
        "Monetize Your Content",
        "Build Loyal Community",
        "Establish Authority",
      ]}
      process={[
        "Blog Structure Planning",
        "Design & Layout Creation",
        "Development & CMS Setup",
        "SEO Configuration",
        "Content Migration",
        "Launch & Growth Strategy",
      ]}
      technologies={[
        "Next.js / WordPress",
        "Tailwind CSS",
        "MDX / Markdown",
        "Prisma / MongoDB",
        "Google AdSense Ready",
      ]}
        faqs={faqs}
      />
    </>
  );
}
