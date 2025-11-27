class Faq < ApplicationRecord
  validates :category, presence: true
  validates :question, presence: true
  validates :answer, presence: true

  scope :active, -> { where(is_active: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :ordered, -> { order(:order, :created_at) }

  # Group FAQs by category
  def self.grouped_by_category
    active.ordered.group_by(&:category).transform_values do |faqs|
      faqs.map do |faq|
        {
          q: faq.question,
          a: faq.answer
        }
      end
    end
  end

  # Get formatted FAQs with category metadata
  def self.formatted
    categories_metadata = {
      "getting-started" => {
        id: "getting-started",
        title: "Getting Started",
        icon: "MdHelpOutline"
      },
      "bidding" => {
        id: "bidding",
        title: "Bidding & Auctions",
        icon: "MdQuestionAnswer"
      },
      "selling" => {
        id: "selling",
        title: "Selling on Vendora",
        icon: "MdFeedback"
      },
      "account" => {
        id: "account",
        title: "Account & Security",
        icon: "MdHelpOutline"
      },
      "payments" => {
        id: "payments",
        title: "Payments & Refunds",
        icon: "MdQuestionAnswer"
      }
    }

    grouped = grouped_by_category
    categories_metadata.map do |category_key, metadata|
      {
        id: metadata[:id],
        title: metadata[:title],
        icon: metadata[:icon],
        questions: grouped[category_key] || []
      }
    end.select { |cat| cat[:questions].any? }
  end
end

