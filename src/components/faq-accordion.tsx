'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Link as LinkIcon } from 'lucide-react'
import { FAQCategoryWithQuestions } from '@/lib/api/faq-client'
import { incrementFAQViewClient } from '@/lib/api/faq-client'

interface FAQAccordionProps {
  faqData: FAQCategoryWithQuestions[]
  showAll?: boolean
  maxCategories?: number
}

export function FAQAccordion({ faqData, showAll = false, maxCategories = 4 }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Handle hash navigation on mount and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove the #
      if (hash) {
        // Open the item
        setOpenItems(new Set([hash]))
        
        // Wait for DOM to update, then scroll
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            
            // Highlight for 3 seconds
            setHighlightedItem(hash)
            setTimeout(() => {
              setHighlightedItem(null)
            }, 3000)
          }
        }, 100)
      }
    }

    // Check on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggleItem = (itemSlug: string, questionId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(itemSlug)) {
      newOpenItems.delete(itemSlug)
    } else {
      newOpenItems.add(itemSlug)
      // Track view when opening
      incrementFAQViewClient(questionId).catch(console.error)
    }
    setOpenItems(newOpenItems)
  }

  const copyLinkToClipboard = (itemSlug: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${itemSlug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(itemSlug)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const categoriesToShow = showAll ? faqData : faqData.slice(0, maxCategories)

  return (
    <div className="space-y-8">
      {categoriesToShow.map((category) => (
        <div key={category.id} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-xl font-bold">{category.name}</h3>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {category.questions.map((faq) => {
              const isOpen = openItems.has(faq.slug)
              const isHighlighted = highlightedItem === faq.slug
              const isCopied = copiedId === faq.slug
              
              return (
                <Card 
                  key={faq.id} 
                  id={faq.slug}
                  className={`border-border/50 shadow-sm hover:shadow-md transition-all duration-300 scroll-mt-24 ${
                    isHighlighted ? 'ring-2 ring-primary shadow-lg bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="relative group">
                      <button
                        onClick={() => toggleItem(faq.slug, faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground pr-12">
                          {faq.question}
                        </h4>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Copy Link Button */}
                      <button
                        onClick={() => copyLinkToClipboard(faq.slug)}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-md"
                        title="Copy link to this FAQ"
                      >
                        {isCopied ? (
                          <span className="text-xs text-green-600 font-medium">Copied!</span>
                        ) : (
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    
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
