-- ============================================================================
-- SEED FAQ DATA
-- ============================================================================
-- This file populates the FAQ tables with all existing FAQ content

-- Insert FAQ Categories
INSERT INTO faq_categories (name, icon, slug, display_order) VALUES
  ('General Questions', '❓', 'general-questions', 1),
  ('Dosing and Administration', '💉', 'dosing-and-administration', 2),
  ('Benefits and Effects', '✨', 'benefits-and-effects', 3),
  ('Side Effects and Contraindications', '⚠️', 'side-effects-and-contraindications', 4),
  ('Stacking and Combinations', '🔗', 'stacking-and-combinations', 5),
  ('Safety and Precautions', '🛡️', 'safety-and-precautions', 6),
  ('Ordering and Shipping', '📦', 'ordering-and-shipping', 7),
  ('Payment and Process', '💳', 'payment-and-process', 8),
  ('Product Information', '🧪', 'product-information', 9),
  ('Group Buy vs Individual', '👥', 'group-buy-vs-individual', 10),
  ('Shipping Costs and Local Delivery', '🚚', 'shipping-costs-and-local-delivery', 11),
  ('About the Seller', '👤', 'about-the-seller', 12);

-- Get category IDs for reference (we'll use them in the questions insert)
DO $$
DECLARE
  cat_general UUID;
  cat_dosing UUID;
  cat_benefits UUID;
  cat_side_effects UUID;
  cat_stacking UUID;
  cat_safety UUID;
  cat_ordering UUID;
  cat_payment UUID;
  cat_product UUID;
  cat_group_buy UUID;
  cat_shipping_costs UUID;
  cat_seller UUID;
BEGIN
  -- Get category UUIDs
  SELECT id INTO cat_general FROM faq_categories WHERE slug = 'general-questions';
  SELECT id INTO cat_dosing FROM faq_categories WHERE slug = 'dosing-and-administration';
  SELECT id INTO cat_benefits FROM faq_categories WHERE slug = 'benefits-and-effects';
  SELECT id INTO cat_side_effects FROM faq_categories WHERE slug = 'side-effects-and-contraindications';
  SELECT id INTO cat_stacking FROM faq_categories WHERE slug = 'stacking-and-combinations';
  SELECT id INTO cat_safety FROM faq_categories WHERE slug = 'safety-and-precautions';
  SELECT id INTO cat_ordering FROM faq_categories WHERE slug = 'ordering-and-shipping';
  SELECT id INTO cat_payment FROM faq_categories WHERE slug = 'payment-and-process';
  SELECT id INTO cat_product FROM faq_categories WHERE slug = 'product-information';
  SELECT id INTO cat_group_buy FROM faq_categories WHERE slug = 'group-buy-vs-individual';
  SELECT id INTO cat_shipping_costs FROM faq_categories WHERE slug = 'shipping-costs-and-local-delivery';
  SELECT id INTO cat_seller FROM faq_categories WHERE slug = 'about-the-seller';

  -- Insert General Questions
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_general, 'What are peptides, and how are they used in research?', 'Peptides are short chains of amino acids researched for their potential effects on metabolism, tissue repair, anti-aging, neuroprotection, and more. The information provided is for laboratory and educational purposes only, compiled from clinical trials and research protocols as of September 25, 2025.', 'what-are-peptides-and-how-are-they-used-in-research', 1),
    (cat_general, 'Is this guide intended for human or veterinary use?', 'No, this guide is not intended for human or veterinary use unless prescribed by a licensed medical professional. It is for research purposes only.', 'is-this-guide-intended-for-human-or-veterinary-use', 2),
    (cat_general, 'Where can I find instructions for preparing and injecting peptides?', 'Refer to the Prep & Injection Guide linked in the peptide dosing guide for proper reconstitution, syringe sizing, and injection protocols.', 'where-can-i-find-instructions-for-preparing-and-injecting-peptides', 3),
    (cat_general, 'Do you have a minimum order?', 'No. There is no minimum order for individual or group buys.', 'do-you-have-a-minimum-order', 4),
    (cat_general, 'What is Tirzepatide and where does it come from?', 'U.S. FDA-approved Tirzepatide brands are Mounjaro and Zepbound. Other sources are typically from China.', 'what-is-tirzepatide-and-where-does-it-come-from', 5);

  -- Insert Dosing and Administration
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_dosing, 'How should I dose Semaglutide for weight loss research?', 'For Semaglutide (3MG), mix with 0.6mL BAC water and dose once weekly subcutaneously, starting at 4 units (0.25mg) and increasing up to 40 units (2.5mg) over 4-week intervals.', 'how-should-i-dose-semaglutide-for-weight-loss-research', 1),
    (cat_dosing, 'What is the typical dosing schedule for BPC-157 in tissue repair studies?', 'For BPC-157 (5MG), mix with 2mL BAC water and dose 250-500mcg (25-50 units) daily subcutaneously.', 'what-is-the-typical-dosing-schedule-for-bpc-157-in-tissue-repair-studies', 2),
    (cat_dosing, 'How often should Retatrutide be administered?', 'Retatrutide (6MG) should be mixed with 1.2mL BAC water and dosed weekly subcutaneously, titrating from 20 units (1mg) over 4 weeks up to 120 units (6mg).', 'how-often-should-retatrutide-be-administered', 3);

  -- Insert Benefits and Effects
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_benefits, 'What are the benefits of using Ipamorelin in research?', 'Ipamorelin increases growth hormone for muscle growth, improves sleep, metabolism, and energy, based on research data.', 'what-are-the-benefits-of-using-ipamorelin-in-research', 1),
    (cat_benefits, 'Can Melanotan 2 help with tanning?', 'Yes, Melanotan 2 promotes skin pigmentation for UV protection, as shown in research models.', 'can-melanotan-2-help-with-tanning', 2),
    (cat_benefits, 'What does NAD+ do in anti-aging studies?', 'NAD+ enhances energy, DNA repair, and supports anti-aging and metabolic functions by boosting sirtuins and mitochondrial activity.', 'what-does-nad-do-in-anti-aging-studies', 3);

  -- Insert Side Effects and Contraindications
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_side_effects, 'What are common side effects of Tirzepatide?', 'Common side effects include nausea, vomiting, diarrhea, and injection site reactions, with rare risks like pancreatitis or thyroid tumors.', 'what-are-common-side-effects-of-tirzepatide', 1),
    (cat_side_effects, 'Who should avoid using HGH Fragment 176-191?', 'Avoid use if hypersensitive, as it may cause mild head rush or injection pain.', 'who-should-avoid-using-hgh-fragment-176-191', 2),
    (cat_side_effects, 'Are there contraindications for Thymosin Alpha-1?', 'Yes, avoid in cases of autoimmune disease due to its immune-enhancing effects.', 'are-there-contraindications-for-thymosin-alpha-1', 3);

  -- Insert Stacking and Combinations
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_stacking, 'Can I stack Semaglutide with other peptides?', 'Yes, it can be stacked with Tirzepatide for enhanced weight loss, Cagrilintide for satiety, AOD-9604 for lipolysis, or BPC-157 to mitigate GI side effects.', 'can-i-stack-semaglutide-with-other-peptides', 1),
    (cat_stacking, 'What peptides pair well with BPC-157 for repair?', 'BPC-157 stacks well with TB-500 for comprehensive healing and GHK-Cu for skin and connective tissue support.', 'what-peptides-pair-well-with-bpc-157-for-repair', 2),
    (cat_stacking, 'Is stacking Ipamorelin and CJC-1295 effective?', 'Yes, combining Ipamorelin with CJC-1295 (NO dac or With dac) provides synergistic growth hormone release.', 'is-stacking-ipamorelin-and-cjc-1295-effective', 3);

  -- Insert Safety and Precautions
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_safety, 'What should I do if I experience side effects?', 'Discontinue use and consult research protocols or a professional, as side effects vary (e.g., nausea with Tirzepatide, flushing with NAD+).', 'what-should-i-do-if-i-experience-side-effects', 1),
    (cat_safety, 'Are there peptides to avoid with certain conditions?', 'Yes, avoid EPO if you have cancer or cardiovascular disease, and avoid Dermorphin if sensitive to opioids due to respiratory depression risks.', 'are-there-peptides-to-avoid-with-certain-conditions', 2),
    (cat_safety, 'How often should I cycle peptides like Epitalon?', 'Epitalon (10MG) is dosed 5-10mg daily for 10-20 days, cycled twice a year.', 'how-often-should-i-cycle-peptides-like-epitalon', 3);

  -- Insert Ordering and Shipping
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_ordering, 'What is the individual buy minimum order?', '1 full box (10 vials). Order ships straight to your door with its own tracking number. Can be purchased anytime (no need to wait for others).', 'what-is-the-individual-buy-minimum-order', 1),
    (cat_ordering, 'What are the individual buy shipping tiers?', '$45 = up to 3 peptides + 1 BAC water. $60 = up to 5 peptides + 2 BAC waters or 3 peptides + 3 BAC waters. $70 = 9–13 peptides.', 'what-are-the-individual-buy-shipping-tiers', 2),
    (cat_ordering, 'What are the group buy details?', 'Order any number of vials (up to 15 boxes total/person/batch). Shipping is cheaper (cost split). Can buy per vial. Ships to seller first, then sent locally.', 'what-are-the-group-buy-details', 3),
    (cat_ordering, 'Can I mix peptides in one box?', 'No. Boxes are pre-packed with 10 vials of the same peptide directly from the factory.', 'can-i-mix-peptides-in-one-box', 4),
    (cat_ordering, 'How long does delivery take?', 'Turnaround from the factory to the Philippines is usually 2–3 weeks (or 7–10 days). Wait time is ~2 weeks for individual and ~3 weeks for group buy.', 'how-long-does-delivery-take', 5),
    (cat_ordering, 'How do I track my order?', 'Tracking number and link to the third-party freight forwarder''s page will be sent. Tracking updates take 24–48 hours. Public carriers (LBC, DHL, UPS) are not used.', 'how-do-i-track-my-order', 6),
    (cat_ordering, 'What if my package is held by customs?', 'The seller will re-ship it if it gets held by customs.', 'what-if-my-package-is-held-by-customs', 7),
    (cat_ordering, 'Can I order from overseas?', 'Group buy overseas shipping is not allowed. You must have a local PH address. Items confiscated/held overseas will not be reshipped or replaced.', 'can-i-order-from-overseas', 8);

  -- Insert Payment and Process
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_payment, 'How do I place an order? (Step 1: Collect Orders)', 'Send your final order with the name, milligrams, and quantity of each item.', 'how-do-i-place-an-order-step-1-collect-orders', 1),
    (cat_payment, 'How do I place an order? (Step 2: Get Total)', 'Receive the total amount in pesos (with conversion and shipping fee).', 'how-do-i-place-an-order-step-2-get-total', 2),
    (cat_payment, 'How do I place an order? (Step 3: Make Payment)', 'Make payment via Union Bank, ChinaBank, GoTyme, SeaBank (MariBank), GCash, BPI, or PayMaya. Avoid Bitcoin/PayPal (5–10% handling fees).', 'how-do-i-place-an-order-step-3-make-payment', 3),
    (cat_payment, 'How do I place an order? (Step 4: Shipping Details)', 'Send: Full name, complete address with ZIP code, and phone number.', 'how-do-i-place-an-order-step-4-shipping-details', 4),
    (cat_payment, 'When is payment due?', 'Payment must be made the same day the invoice is sent, or the order will be forfeited. Orders placed through DM will not be counted.', 'when-is-payment-due', 5),
    (cat_payment, 'What happens after I pay?', 'Upon making payment, you will be added to a private group exclusively for verified buyers.', 'what-happens-after-i-pay', 6);

  -- Insert Product Information
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_product, 'Do you have stock on hand?', 'No. Orders are placed directly with the source. Stock is only for personal use (weight loss, longevity, etc.).', 'do-you-have-stock-on-hand', 1),
    (cat_product, 'What is the peptide shelf life?', 'Lyophilized (freeze-dried) peptides last 18–24 months (sealed/refrigerated/frozen). Reconstituted peptides last up to 28 days in the fridge.', 'what-is-the-peptide-shelf-life', 2),
    (cat_product, 'Is Bacteriostatic Water (BAC Water) included?', 'No. Must be bought separately. 10 ml (10 vials) costs $35 (now ₱10); 3 ml (10 vials) costs $30 (now ₱8).', 'is-bacteriostatic-water-bac-water-included', 3),
    (cat_product, 'Can I use sterile water instead of BAC water?', 'No. Use bacteriostatic water for multi-use vials (like peptides, Tirzepatide, HCG); sterile water is for single-use only.', 'can-i-use-sterile-water-instead-of-bac-water', 4),
    (cat_product, 'Are supplies (dosing guide, syringe, label, pads) included?', 'No. Supplies are not included as the order is direct from the factory. Resellers usually add these extras.', 'are-supplies-dosing-guide-syringe-label-pads-included', 5),
    (cat_product, 'What are the recommended syringe brands?', 'Embesta BD Ultra-fine insulin syringe 6mm and Sure Guard Insulin syringe.', 'what-are-the-recommended-syringe-brands', 6),
    (cat_product, 'Do you have a COA (Certificate of Analysis)?', 'Digital COA is available upon request (COA 7/2025 & 8/2025). Tirzepatide COA is already in the works (shipped to a US lab).', 'do-you-have-a-coa-certificate-of-analysis', 7);

  -- Insert Group Buy vs Individual
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_group_buy, 'What is the difference between individual and group buy?', 'Individual: 1 full box (10 vials) minimum, ships to your door. Group buy: Any number of vials (up to 15 boxes total/person/batch), cheaper shipping (cost split), ships to seller first then locally.', 'what-is-the-difference-between-individual-and-group-buy', 1);

  -- Insert Shipping Costs and Local Delivery
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_shipping_costs, 'What is the standard international shipping fee?', 'Standard rate is $45 (around ₱2,622.15 at ₱58.21 = $1, or ₱2,542.25 at ₱56.50 = $1). Covers up to four (4) boxes only/up to 3 peptides + 1 BAC water.', 'what-is-the-standard-international-shipping-fee', 1),
    (cat_shipping_costs, 'Why is the standard shipping rate $45?', 'In the grey market, most vendors start shipping fees around $45. The vendor uses a freight forwarder who bases the cost on size and weight, not per batch.', 'why-is-the-standard-shipping-rate-45', 2),
    (cat_shipping_costs, 'What are the group buy shipping fee updates?', 'International shipping cost is split (approx. ₱550 per person). Local shipping is now FREE (was ₱500 per address).', 'what-are-the-group-buy-shipping-fee-updates', 3),
    (cat_shipping_costs, 'What is the local delivery cost?', 'Once items arrive, local delivery (via Lalamove) is a separate cost (usually ₱100–₱230). LBC shipping is a standard ₱250 fee.', 'what-is-the-local-delivery-cost', 4);

  -- Insert About the Seller
  INSERT INTO faq_questions (category_id, question, answer, slug, display_order) VALUES
    (cat_seller, 'What is Mica''s current peptide stack (Weekly)?', 'Mondays: Tirzepatide (AM or mid-day). Thursdays/Sundays: Thymosin Alpha-1.', 'what-is-mica-s-current-peptide-stack-weekly', 1),
    (cat_seller, 'What is Mica''s current peptide stack (Mon-Fri)?', 'Mornings: NAD+ (25–50 mg), Semax, Selank, GHK-Cu topical. Evenings: Tesamorelin, DSIP, GLOW.', 'what-is-mica-s-current-peptide-stack-mon-fri', 2),
    (cat_seller, 'How does the vendor partnership and compensation work?', 'Seller works with a trusted grey market vendor and receives peptides (not cash) to help manage ADHD. For transparency, they do not earn money.', 'how-does-the-vendor-partnership-and-compensation-work', 3),
    (cat_seller, 'Is this 100% safe from scams?', '100% guaranteed safe from scams. Two types of scammers: those who take money and send nothing, and those who send inert peptides (salt).', 'is-this-100-safe-from-scams', 4),
    (cat_seller, 'Are there support groups available?', 'There is one support group open to everyone and an exclusive one for verified buyers.', 'are-there-support-groups-available', 5),
    (cat_seller, 'How do I contact for orders (Luzon & Visayas)?', 'DM @Phoebe for individual purchases and updates.', 'how-do-i-contact-for-orders-luzon-visayas', 6),
    (cat_seller, 'How do I contact for orders (Mindanao)?', 'DM @Gilia for individual buys and ALL orders and updates.', 'how-do-i-contact-for-orders-mindanao', 7);

END $$;

-- Verify the data
SELECT 
  c.name as category,
  c.icon,
  COUNT(q.id) as question_count
FROM faq_categories c
LEFT JOIN faq_questions q ON q.category_id = c.id
GROUP BY c.id, c.name, c.icon, c.display_order
ORDER BY c.display_order;

