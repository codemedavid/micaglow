'use client'

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
