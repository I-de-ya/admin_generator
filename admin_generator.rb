class AdminGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)

  def generate_admin_layout
    directory "assets/stylesheets", "app/assets/stylesheets"
    directory "assets/images", "app/assets/images"
    directory "assets/javascripts", "app/assets/javascripts/"
    directory "controllers/admin", "app/controllers/admin"
    directory "helpers", "app/helpers"
    directory "views/admin", "app/views/admin"
    directory "views/layouts", "app/views/layouts"
    copy_file "tasks/seeds.rb", "db/seeds.rb"
    copy_file "tasks/reset_db.rake", "lib/tasks/reset_db.rake"
  end

  def setup_routes
    route("namespace :admin do end")
  end

end
