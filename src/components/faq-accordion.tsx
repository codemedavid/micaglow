'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, HelpCircle } from 'lucide-react'

// FAQ Data
const faqData = [
  {
    category: 'General Questions',
    icon: '❓',
    questions: [
      {
        question: 'What are peptides, and how are they used in research?',
        answer: 'Peptides are short chains of amino acids researched for their potential effects on metabolism, tissue repair, anti-aging, neuroprotection, and more. The information provided is for laboratory and educational purposes only, compiled from clinical trials and research protocols as of September 25, 2025.',
      },
      {
        question: 'Is this guide intended for human or veterinary use?',
        answer: 'No, this guide is not intended for human or veterinary use unless prescribed by a licensed medical professional. It is for research purposes only.',
      },
      {
        question: 'Where can I find instructions for preparing and injecting peptides?',
        answer: 'Refer to the Prep & Injection Guide linked in the peptide dosing guide for proper reconstitution, syringe sizing, and injection protocols.',
      },
      {
        question: 'Do you have a minimum order?',
        answer: 'No. There is no minimum order for individual or group buys.',
      },
      {
        question: 'What is Tirzepatide and where does it come from?',
        answer: 'U.S. FDA-approved Tirzepatide brands are Mounjaro and Zepbound. Other sources are typically from China.',
      },
    ],
  },
  {
    category: 'Dosing and Administration',
    icon: '💉',
    questions: [
      {
        question: 'How should I dose Semaglutide for weight loss research?',
        answer: 'For Semaglutide (3MG), mix with 0.6mL BAC water and dose once weekly subcutaneously, starting at 4 units (0.25mg) and increasing up to 40 units (2.5mg) over 4-week intervals.',
      },
      {
        question: 'What is the typical dosing schedule for BPC-157 in tissue repair studies?',
        answer: 'For BPC-157 (5MG), mix with 2mL BAC water and dose 250-500mcg (25-50 units) daily subcutaneously.',
      },
      {
        question: 'How often should Retatrutide be administered?',
        answer: 'Retatrutide (6MG) should be mixed with 1.2mL BAC water and dosed weekly subcutaneously, titrating from 20 units (1mg) over 4 weeks up to 120 units (6mg).',
      },
    ],
  },
  {
    category: 'Benefits and Effects',
    icon: '✨',
    questions: [
      {
        question: 'What are the benefits of using Ipamorelin in research?',
        answer: 'Ipamorelin increases growth hormone for muscle growth, improves sleep, metabolism, and energy, based on research data.',
      },
      {
        question: 'Can Melanotan 2 help with tanning?',
        answer: 'Yes, Melanotan 2 promotes skin pigmentation for UV protection, as shown in research models.',
      },
      {
        question: 'What does NAD+ do in anti-aging studies?',
        answer: 'NAD+ enhances energy, DNA repair, and supports anti-aging and metabolic functions by boosting sirtuins and mitochondrial activity.',
      },
    ],
  },
  {
    category: 'Side Effects and Contraindications',
    icon: '⚠️',
    questions: [
      {
        question: 'What are common side effects of Tirzepatide?',
        answer: 'Common side effects include nausea, vomiting, diarrhea, and injection site reactions, with rare risks like pancreatitis or thyroid tumors.',
      },
      {
        question: 'Who should avoid using HGH Fragment 176-191?',
        answer: 'Avoid use if hypersensitive, as it may cause mild head rush or injection pain.',
      },
      {
        question: 'Are there contraindications for Thymosin Alpha-1?',
        answer: 'Yes, avoid in cases of autoimmune disease due to its immune-enhancing effects.',
      },
    ],
  },
  {
    category: 'Stacking and Combinations',
    icon: '🔗',
    questions: [
      {
        question: 'Can I stack Semaglutide with other peptides?',
        answer: 'Yes, it can be stacked with Tirzepatide for enhanced weight loss, Cagrilintide for satiety, AOD-9604 for lipolysis, or BPC-157 to mitigate GI side effects.',
      },
      {
        question: 'What peptides pair well with BPC-157 for repair?',
        answer: 'BPC-157 stacks well with TB-500 for comprehensive healing and GHK-Cu for skin and connective tissue support.',
      },
      {
        question: 'Is stacking Ipamorelin and CJC-1295 effective?',
        answer: 'Yes, combining Ipamorelin with CJC-1295 (NO dac or With dac) provides synergistic growth hormone release.',
      },
    ],
  },
  {
    category: 'Safety and Precautions',
    icon: '🛡️',
    questions: [
      {
        question: 'What should I do if I experience side effects?',
        answer: 'Discontinue use and consult research protocols or a professional, as side effects vary (e.g., nausea with Tirzepatide, flushing with NAD+).',
      },
      {
        question: 'Are there peptides to avoid with certain conditions?',
        answer: 'Yes, avoid EPO if you have cancer or cardiovascular disease, and avoid Dermorphin if sensitive to opioids due to respiratory depression risks.',
      },
      {
        question: 'How often should I cycle peptides like Epitalon?',
        answer: 'Epitalon (10MG) is dosed 5-10mg daily for 10-20 days, cycled twice a year.',
      },
    ],
  },
  {
    category: 'Ordering and Shipping',
    icon: '📦',
    questions: [
      {
        question: 'What is the individual buy minimum order?',
        answer: '1 full box (10 vials). Order ships straight to your door with its own tracking number. Can be purchased anytime (no need to wait for others).',
      },
      {
        question: 'What are the individual buy shipping tiers?',
        answer: '$45 = up to 3 peptides + 1 BAC water. $60 = up to 5 peptides + 2 BAC waters or 3 peptides + 3 BAC waters. $70 = 9–13 peptides.',
      },
      {
        question: 'What are the group buy details?',
        answer: 'Order any number of vials (up to 15 boxes total/person/batch). Shipping is cheaper (cost split). Can buy per vial. Ships to seller first, then sent locally.',
      },
      {
        question: 'Can I mix peptides in one box?',
        answer: 'No. Boxes are pre-packed with 10 vials of the same peptide directly from the factory.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Turnaround from the factory to the Philippines is usually 2–3 weeks (or 7–10 days). Wait time is ~2 weeks for individual and ~3 weeks for group buy.',
      },
      {
        question: 'How do I track my order?',
        answer: 'Tracking number and link to the third-party freight forwarder\'s page will be sent. Tracking updates take 24–48 hours. Public carriers (LBC, DHL, UPS) are not used.',
      },
      {
        question: 'What if my package is held by customs?',
        answer: 'The seller will re-ship it if it gets held by customs.',
      },
      {
        question: 'Can I order from overseas?',
        answer: 'Group buy overseas shipping is not allowed. You must have a local PH address. Items confiscated/held overseas will not be reshipped or replaced.',
      },
    ],
  },
  {
    category: 'Payment and Process',
    icon: '💳',
    questions: [
      {
        question: 'How do I place an order? (Step 1: Collect Orders)',
        answer: 'Send your final order with the name, milligrams, and quantity of each item.',
      },
      {
        question: 'How do I place an order? (Step 2: Get Total)',
        answer: 'Receive the total amount in pesos (with conversion and shipping fee).',
      },
      {
        question: 'How do I place an order? (Step 3: Make Payment)',
        answer: 'Make payment via Union Bank, ChinaBank, GoTyme, SeaBank (MariBank), GCash, BPI, or PayMaya. Avoid Bitcoin/PayPal (5–10% handling fees).',
      },
      {
        question: 'How do I place an order? (Step 4: Shipping Details)',
        answer: 'Send: Full name, complete address with ZIP code, and phone number.',
      },
      {
        question: 'When is payment due?',
        answer: 'Payment must be made the same day the invoice is sent, or the order will be forfeited. Orders placed through DM will not be counted.',
      },
      {
        question: 'What happens after I pay?',
        answer: 'Upon making payment, you will be added to a private group exclusively for verified buyers.',
      },
    ],
  },
  {
    category: 'Product Information',
    icon: '🧪',
    questions: [
      {
        question: 'Do you have stock on hand?',
        answer: 'No. Orders are placed directly with the source. Stock is only for personal use (weight loss, longevity, etc.).',
      },
      {
        question: 'What is the peptide shelf life?',
        answer: 'Lyophilized (freeze-dried) peptides last 18–24 months (sealed/refrigerated/frozen). Reconstituted peptides last up to 28 days in the fridge.',
      },
      {
        question: 'Is Bacteriostatic Water (BAC Water) included?',
        answer: 'No. Must be bought separately. 10 ml (10 vials) costs $35 (now ₱10); 3 ml (10 vials) costs $30 (now ₱8).',
      },
      {
        question: 'Can I use sterile water instead of BAC water?',
        answer: 'No. Use bacteriostatic water for multi-use vials (like peptides, Tirzepatide, HCG); sterile water is for single-use only.',
      },
      {
        question: 'Are supplies (dosing guide, syringe, label, pads) included?',
        answer: 'No. Supplies are not included as the order is direct from the factory. Resellers usually add these extras.',
      },
      {
        question: 'What are the recommended syringe brands?',
        answer: 'Embesta BD Ultra-fine insulin syringe 6mm and Sure Guard Insulin syringe.',
      },
      {
        question: 'Do you have a COA (Certificate of Analysis)?',
        answer: 'Digital COA is available upon request (COA 7/2025 & 8/2025). Tirzepatide COA is already in the works (shipped to a US lab).',
      },
    ],
  },
  {
    category: 'Group Buy vs Individual',
    icon: '👥',
    questions: [
      {
        question: 'What is the difference between individual and group buy?',
        answer: 'Individual: 1 full box (10 vials) minimum, ships to your door. Group buy: Any number of vials (up to 15 boxes total/person/batch), cheaper shipping (cost split), ships to seller first then locally.',
      },
    ],
  },
  {
    category: 'Shipping Costs and Local Delivery',
    icon: '🚚',
    questions: [
      {
        question: 'What is the standard international shipping fee?',
        answer: 'Standard rate is $45 (around ₱2,622.15 at ₱58.21 = $1, or ₱2,542.25 at ₱56.50 = $1). Covers up to four (4) boxes only/up to 3 peptides + 1 BAC water.',
      },
      {
        question: 'Why is the standard shipping rate $45?',
        answer: 'In the grey market, most vendors start shipping fees around $45. The vendor uses a freight forwarder who bases the cost on size and weight, not per batch.',
      },
      {
        question: 'What are the group buy shipping fee updates?',
        answer: 'International shipping cost is split (approx. ₱550 per person). Local shipping is now FREE (was ₱500 per address).',
      },
      {
        question: 'What is the local delivery cost?',
        answer: 'Once items arrive, local delivery (via Lalamove) is a separate cost (usually ₱100–₱230). LBC shipping is a standard ₱250 fee.',
      },
    ],
  },
  {
    category: 'About the Seller',
    icon: '👤',
    questions: [
      {
        question: 'What is Mica\'s current peptide stack (Weekly)?',
        answer: 'Mondays: Tirzepatide (AM or mid-day). Thursdays/Sundays: Thymosin Alpha-1.',
      },
      {
        question: 'What is Mica\'s current peptide stack (Mon-Fri)?',
        answer: 'Mornings: NAD+ (25–50 mg), Semax, Selank, GHK-Cu topical. Evenings: Tesamorelin, DSIP, GLOW.',
      },
      {
        question: 'How does the vendor partnership and compensation work?',
        answer: 'Seller works with a trusted grey market vendor and receives peptides (not cash) to help manage ADHD. For transparency, they do not earn money.',
      },
      {
        question: 'Is this 100% safe from scams?',
        answer: '100% guaranteed safe from scams. Two types of scammers: those who take money and send nothing, and those who send inert peptides (salt).',
      },
      {
        question: 'Are there support groups available?',
        answer: 'There is one support group open to everyone and an exclusive one for verified buyers.',
      },
      {
        question: 'How do I contact for orders (Luzon & Visayas)?',
        answer: 'DM @Phoebe for individual purchases and updates.',
      },
      {
        question: 'How do I contact for orders (Mindanao)?',
        answer: 'DM @Gilia for individual buys and ALL orders and updates.',
      },
    ],
  },
]

interface FAQAccordionProps {
  showAll?: boolean
  maxCategories?: number
}

export function FAQAccordion({ showAll = false, maxCategories = 4 }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId)
    } else {
      newOpenItems.add(itemId)
    }
    setOpenItems(newOpenItems)
  }

  const categoriesToShow = showAll ? faqData : faqData.slice(0, maxCategories)

  return (
    <div className="space-y-8">
      {categoriesToShow.map((category, categoryIdx) => (
        <div key={categoryIdx} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-xl font-bold">{category.category}</h3>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {category.questions.map((faq, faqIdx) => {
              const itemId = `${categoryIdx}-${faqIdx}`
              const isOpen = openItems.has(itemId)
              
              return (
                <Card key={faqIdx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleItem(itemId)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <h4 className="font-semibold text-foreground pr-4">
                        {faq.question}
                      </h4>
                      <ChevronDown 
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
