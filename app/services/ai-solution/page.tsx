import ServiceDetail from "../../components/ServiceDetail";
import { getServicePricing } from "../../lib/server/pricing";
import ServiceSeo from "../../components/ServiceSeo";
import { pageMeta } from "../../lib/seo";

const faqs = [
  {
    question: "Will the chatbot answer from our own documents?",
    answer:
      "Yes. We index your PDFs, help pages, price lists or product catalogue and the assistant answers from that content with a link to the source, instead of guessing from general knowledge.",
  },
  {
    question: "What does it cost to run each month?",
    answer:
      "Hosting is usually a few dollars; the model usage depends on volume. We size it against your expected traffic before the build and set a hard monthly cap so a traffic spike cannot produce a surprise bill.",
  },
  {
    question: "Can it connect to our CRM or booking system?",
    answer:
      "Yes, where that system has an API. Common integrations are creating a lead in the CRM, booking a slot on a calendar, raising a support ticket, or pushing a summary into Slack or WhatsApp.",
  },
  {
    question: "What happens when the AI does not know the answer?",
    answer:
      "It says so and hands over — to a contact form, a WhatsApp chat or a human inbox, depending on what you prefer. An assistant that invents answers costs more trust than it saves time.",
  },
];

export const metadata = pageMeta({
  title: "AI Solutions — Chatbots, Assistants & Workflow Automation",
  description:
    "Custom AI solutions: website chatbots trained on your own content, document and data assistants, and workflow automations connected to your CRM and support tools.",
  path: "/services/ai-solution",
  keywords: [
    "ai chatbot development company",
    "custom ai solutions",
    "ai workflow automation services",
    "rag chatbot development",
    "ai integration for business",
  ],
});

/*
 * Re-rendered at most once a minute, so a price changed in the admin
 * panel appears here without a rebuild while the page stays cached.
 */
export const revalidate = 60;

export default async function AiSolutionServicePage() {
  const pricing = await getServicePricing("ai-solution");
  return (
    <>
      <ServiceSeo slug="ai-solution" faqs={faqs} />
      <ServiceDetail
        title="AI Solutions"
        category="Automation & Assistants 🤖"
        icon="fa-robot"
        color="#818cf8"
        gradient="from-indigo-500 to-violet-600"
        targetAudience={[
          "Businesses drowning in repeat enquiries",
          "Clinics & services taking bookings by phone",
          "E-commerce stores with support volume",
          "Teams doing manual data entry daily",
          "Products adding an AI feature",
        ]}
        features={[
          "Website chatbot trained on your content",
          "Answers cited back to the source document",
          "Lead capture and handover to a human",
          "WhatsApp and Messenger channels",
          "Document & PDF question answering",
          "Data extraction from invoices and forms",
          "CRM, calendar and helpdesk integrations",
          "Workflow automation between your tools",
          "Usage dashboard and monthly cost caps",
          "Admin panel to update the knowledge base",
        ]}
        description="Chatbots, assistants and automations wired into the tools your team already uses."
        longDescription="The useful AI work in most businesses is unglamorous: answering the same forty questions, reading a document so a person does not have to, moving a record from one system into another. We build exactly that. A website or WhatsApp assistant is grounded in your own content so it answers from your price list and your policies, cites where the answer came from, and hands over to a person the moment it is out of depth. Automations sit behind the scenes — pulling details out of an invoice, creating the CRM record, booking the slot, posting the summary into Slack. Everything runs with a monthly spending cap, an admin panel so your team can update the knowledge base without calling us, and a log of what the assistant said so you can check it."
        price={pricing.price}
        delivery={pricing.delivery}
        benefits={[
          "Answers grounded in your content, with sources",
          "Hands over to a human instead of inventing",
          "Hard monthly cost cap, no surprise bills",
          "Your team updates content, not us",
          "Works on the website, WhatsApp or both",
        ]}
        process={[
          "Workshop: which tasks are worth automating",
          "Content and data audit for the knowledge base",
          "Prototype you can test on real questions",
          "Integrations with CRM, calendar or helpdesk",
          "Accuracy testing and guardrail tuning",
          "Launch, monitoring and monthly review",
        ]}
        technologies={[
          "OpenAI / Claude / Groq APIs",
          "Vector search (pgvector / Pinecone)",
          "Node.js / Python",
          "WhatsApp Business API",
          "n8n / Zapier",
          "MySQL / PostgreSQL",
        ]}
        faqs={faqs}
      />
    </>
  );
}
