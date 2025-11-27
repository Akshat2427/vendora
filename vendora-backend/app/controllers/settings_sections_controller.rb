class SettingsSectionsController < ApplicationController
  def index
    sections = SettingsSection.active.ordered.includes(:settings_fields)
    
    formatted_sections = sections.map do |section|
      # Group fields by group_label if present
      fields = section.settings_fields.active.ordered
      grouped_fields = fields.group_by(&:group_label)
      
      section_data = {
        id: section.key,
        label: section.label,
        icon: section.icon,
        fields: []
      }

      # Add ungrouped fields first
      if grouped_fields[nil]
        section_data[:fields].concat(grouped_fields[nil].map(&:formatted))
      end

      # Add grouped fields
      grouped_fields.each do |group_label, group_fields|
        next if group_label.nil?
        
        section_data[:fields] << {
          type: "group",
          label: group_label,
          fields: group_fields.map(&:formatted)
        }
      end

      section_data
    end

    render json: { sections: formatted_sections }
  end

  def show
    section = SettingsSection.find_by(key: params[:id])
    
    if section
      render json: { section: section.formatted }
    else
      render json: { error: "Section not found" }, status: :not_found
    end
  end
end

