class JwtBlacklist < ApplicationRecord
  def self.blacklisted?(jti)
    exists?(jti: jti)
  end

  def self.add_to_blacklist(jti, expires_at)
    create!(jti: jti, expires_at: expires_at)
  end

  def self.cleanup_expired
    where('expires_at < ?', Time.current).delete_all
  end
end

