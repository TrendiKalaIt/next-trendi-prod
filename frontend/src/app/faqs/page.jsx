'use client'; 

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('General Questions');

  const faqData = [
    {
      topic: 'General Questions',
      faqs: [
        {
          question: 'What types of women clothing do you offer?',
          answer: "We offer a wide range of women's clothing including sarees, dresses, tops, skirts, and ethnic wear.",
        },
        {
          question: 'Do you have size charts available?',
          answer: 'Yes, size charts are available on each product page to help you choose the right fit.',
        },
        {
          question: 'Can I return or exchange products?',
          answer: 'Yes, we offer easy returns and exchanges within 7 days of delivery. Please check our Cancellation & Return policy for details.',
        },
      ],
    },
    {
      topic: 'Ordering & Payment',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, net banking, UPI, and cash on delivery (COD) for select locations.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely! We use secure payment gateways with SSL encryption to keep your data safe.',
        },
      ],
    },
    {
      topic: 'Shipping & Delivery',
      faqs: [
        {
          question: 'What are the delivery timelines?',
          answer: 'Delivery usually takes 4-7 business days depending on your location.',
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes, we offer free shipping on orders above ₹1000.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes, you will receive a tracking link via email/SMS once your order is shipped.',
        },
      ],
    },
    {
      topic: 'Product Care',
      faqs: [
        {
          question: 'How should I wash my sarees and delicate fabrics?',
          answer: 'We recommend dry cleaning or gentle hand wash with mild detergent to maintain fabric quality.',
        },
        {
          question: 'Do your products come with care instructions?',
          answer: 'Yes, each product includes detailed care instructions on its page.',
        },
      ],
    },
  ];

  const currentTopicFAQs = faqData.find((data) => data.topic === selectedTopic)?.faqs || [];

  useEffect(() => {
    setOpenFAQIndex(null);
  }, [selectedTopic]);

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-[90px] p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/4">
          <nav className="font-home space-y-4 mb-12">
            {faqData.map((data, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(data.topic)}
                className={`block w-full text-left py-2 px-4 rounded-md transition-colors duration-200
                  ${selectedTopic === data.topic
                    ? 'bg-[#9CAF88] text-white'
                    : 'hover:text-white hover:bg-[#9CAF88]'
                  }`}
              >
                {data.topic}
              </button>
            ))}
          </nav>
        </div>

        <div className="w-full lg:w-3/4">
          <h1 className="font-heading text-4xl font-bold mb-8 text-[#9CAF88]">{selectedTopic}</h1>
          <div className="space-y-4">
            {currentTopicFAQs.length > 0 ? (
              currentTopicFAQs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-6 cursor-pointer transition-all duration-300
                    ${openFAQIndex === index ? 'bg-[#9caf88bf]' : 'bg-[#9caf8830]'}
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-body text-xl font-semibold">{faq.question}</h3>
                    {openFAQIndex === index ? (
                      <ChevronUp className="h-6 w-6 text-white" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-[#9CAF88]" />
                    )}
                  </div>
                  {openFAQIndex === index && (
                    <p className="font-body mt-4">{faq.answer}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="font-body text-[#9CAF88] text-lg">No FAQs available for this topic yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
