class Todo < ApplicationRecord
    acts_as_taggable_on :tags
    default_scope { order(created_at: :asc) }
end
