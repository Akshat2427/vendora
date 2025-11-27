# Seed FAQs data
faqs_data = [
  # Getting Started
  {
    category: "getting-started",
    question: "How do I create an account?",
    answer: "Click on the 'Sign Up' button in the top right corner, enter your email address, create a password, and verify your email. You can also sign up using Google, Apple, or Facebook.",
    order: 1
  },
  {
    category: "getting-started",
    question: "How do I place a bid?",
    answer: "Browse available auctions, select an item you're interested in, and click 'Place Bid'. Enter your bid amount and confirm. You can also enable auto-bidding to automatically bid up to your maximum limit.",
    order: 2
  },
  {
    category: "getting-started",
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards, UPI, PayPal, and bank transfers. You can add multiple payment methods in your Settings under Payment & Billing.",
    order: 3
  },
  {
    category: "getting-started",
    question: "How does shipping work?",
    answer: "After winning an auction, you'll receive payment instructions. Once payment is confirmed, the seller will ship your item. Shipping times vary by seller and method selected.",
    order: 4
  },
  # Bidding & Auctions
  {
    category: "bidding",
    question: "What is auto-bidding?",
    answer: "Auto-bidding allows you to set a maximum bid amount. The system will automatically bid on your behalf up to that limit, helping you stay competitive without constant monitoring.",
    order: 1
  },
  {
    category: "bidding",
    question: "Can I retract a bid?",
    answer: "Bids are generally final. However, you may retract a bid within 5 minutes of placing it if you made an error. After that, bids cannot be retracted.",
    order: 2
  },
  {
    category: "bidding",
    question: "What happens if I win an auction?",
    answer: "You'll receive an email notification and payment instructions. Complete payment within 48 hours. The seller will then ship your item to the address on file.",
    order: 3
  },
  {
    category: "bidding",
    question: "How do I know if I've been outbid?",
    answer: "You'll receive notifications via email, SMS, or push notifications (based on your preferences) when you're outbid. You can also check your 'My Bids' section.",
    order: 4
  },
  # Selling on Vendora
  {
    category: "selling",
    question: "How do I list an item for auction?",
    answer: "Go to 'Sell' in the navigation, click 'Create Listing', upload photos, add a description, set your starting bid and reserve price, choose auction duration, and publish.",
    order: 1
  },
  {
    category: "selling",
    question: "What fees do sellers pay?",
    answer: "Sellers pay a 10% commission on final sale price, plus payment processing fees. There are no listing fees or monthly subscriptions.",
    order: 2
  },
  {
    category: "selling",
    question: "When do I receive payment?",
    answer: "Payment is released to your account 3-5 business days after the buyer confirms receipt of the item. You can set up payout methods in Settings.",
    order: 3
  },
  {
    category: "selling",
    question: "Can I cancel an auction?",
    answer: "You can cancel an auction before any bids are placed. Once bidding starts, you can only end it early if you accept the current highest bid.",
    order: 4
  },
  # Account & Security
  {
    category: "account",
    question: "How do I change my password?",
    answer: "Go to Settings > Security & Login > Change Password. Enter your current password and create a new one. We recommend using a strong, unique password.",
    order: 1
  },
  {
    category: "account",
    question: "How do I enable two-factor authentication?",
    answer: "Navigate to Settings > Security & Login > Two-Factor Authentication. Choose your preferred method (Email, SMS, or Authenticator App) and follow the setup instructions.",
    order: 2
  },
  {
    category: "account",
    question: "How do I update my profile information?",
    answer: "You can edit your profile in Settings > Account Settings. Update your name, email, phone, address, and profile photo. Changes are saved immediately.",
    order: 3
  },
  {
    category: "account",
    question: "What should I do if I notice suspicious activity?",
    answer: "Immediately change your password and enable 2FA if not already active. Contact our support team and review your login activity in Settings > Security & Login.",
    order: 4
  },
  # Payments & Refunds
  {
    category: "payments",
    question: "How do I add a payment method?",
    answer: "Go to Settings > Payment & Billing > Payment Methods. Click 'Add Payment Method' and enter your card details, UPI ID, or PayPal information.",
    order: 1
  },
  {
    category: "payments",
    question: "What is your refund policy?",
    answer: "Refunds are handled on a case-by-case basis. If an item doesn't match its description or arrives damaged, contact support within 7 days of delivery for a refund request.",
    order: 2
  },
  {
    category: "payments",
    question: "How long do refunds take?",
    answer: "Refunds are processed within 5-10 business days after approval. The time may vary depending on your payment method and bank processing times.",
    order: 3
  },
  {
    category: "payments",
    question: "Are there any transaction fees?",
    answer: "Buyers pay the final bid amount plus shipping. Sellers pay a 10% commission and payment processing fees. All fees are clearly displayed before you commit.",
    order: 4
  }
]

faqs_data.each do |faq_data|
  Faq.find_or_create_by(
    category: faq_data[:category],
    question: faq_data[:question]
  ) do |faq|
    faq.answer = faq_data[:answer]
    faq.order = faq_data[:order]
    faq.is_active = true
  end
end

puts "Seeded #{Faq.count} FAQs"

