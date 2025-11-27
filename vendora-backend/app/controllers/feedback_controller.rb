class FeedbackController < ApplicationController
  def index
    user_id = params[:user_id]
    
    unless user_id
      return render json: { error: "user_id is required" }, status: :bad_request
    end

    form = Form.find_by(slug: "feedback")
    return render json: { feedbacks: [] } unless form

    submissions = Submission.where(form_id: form.id, user_id: user_id)
      .order(created_at: :desc)
      .includes(:answers)

    feedbacks = submissions.map do |submission|
      answers_hash = {}
      submission.answers.each do |answer|
        question_key = answer.question&.key
        if question_key
          value = answer.value
          if value.is_a?(Hash)
            answers_hash[question_key] = value["text"] || value["number"] || value
          else
            answers_hash[question_key] = value
          end
        end
      end

      {
        id: submission.id,
        type: submission.meta["feedback_type"] || answers_hash["feedback_type"],
        subject: answers_hash["subject"],
        message: answers_hash["message"],
        rating: submission.meta["rating"] || answers_hash["rating"] || 0,
        created_at: submission.created_at
      }
    end

    render json: { feedbacks: feedbacks }
  end

  def submit
    # Find or create feedback form
    form = Form.find_or_create_by(slug: "feedback") do |f|
      f.title = "Feedback Form"
      f.description = "User feedback and suggestions"
      f.tags = [ "feedback", "support" ]
    end

    # Ensure form has questions (create if they don't exist)
    ensure_feedback_questions(form)

    # Create submission
    submission = Submission.new(
      form: form,
      user_id: params[:user_id],
      submitter_type: "user",
      status: "completed",
      meta: {
        feedback_type: params[:type],
        rating: params[:rating]
      }
    )

    if submission.save
      # Create answers for each field
      create_feedback_answers(submission, form, params)

      # Create notification for user
      if params[:user_id]
        Notification.create(
          user_id: params[:user_id],
          title: "Feedback Submitted",
          message: "Thank you for your feedback! We'll review it and get back to you soon.",
          notification_type: "feedback_submitted",
          seen: false,
          deeplink: "/feedback",
          metadata: {
            submission_id: submission.id,
            feedback_type: params[:type],
            rating: params[:rating]
          }
        )
      end

      render json: {
        success: true,
        message: "Thank you for your feedback! We'll review it and get back to you soon.",
        submission: submission.as_json(include: [ :form, :answers ])
      }, status: :created
    else
      render json: {
        success: false,
        errors: submission.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def ensure_feedback_questions(form)
    questions_data = [
      { key: "feedback_type", type: "select", order: 1, required: true, text: "Feedback Type" },
      { key: "subject", type: "text", order: 2, required: true, text: "Subject" },
      { key: "message", type: "textarea", order: 3, required: true, text: "Message" },
      { key: "rating", type: "number", order: 4, required: false, text: "Rating" }
    ]

    questions_data.each do |q_data|
      question = form.questions.find_or_initialize_by(key: q_data[:key])
      if question.new_record?
        question.type = q_data[:type]
        question.order = q_data[:order]
        question.required = q_data[:required]
        question.is_active = true
        question.save

        # Create question text
        question.question_texts.find_or_create_by(locale: "en") do |qt|
          qt.text = q_data[:text]
        end
      end
    end
  end

  def create_feedback_answers(submission, form, params)
    # Feedback Type
    type_question = form.questions.find_by(key: "feedback_type")
    if type_question && params[:type].present?
      Answer.create(
        submission: submission,
        question: type_question,
        value: { text: params[:type] }
      )
    end

    # Subject
    subject_question = form.questions.find_by(key: "subject")
    if subject_question && params[:subject].present?
      Answer.create(
        submission: submission,
        question: subject_question,
        value: { text: params[:subject] }
      )
    end

    # Message
    message_question = form.questions.find_by(key: "message")
    if message_question && params[:message].present?
      Answer.create(
        submission: submission,
        question: message_question,
        value: { text: params[:message] }
      )
    end

    # Rating
    rating_question = form.questions.find_by(key: "rating")
    if rating_question && params[:rating].present?
      Answer.create(
        submission: submission,
        question: rating_question,
        value: { number: params[:rating].to_i }
      )
    end
  end
end
