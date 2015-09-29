namespace :load do
  task :defaults do
  	set :nginx_sever_name, ""
		set :nginx_host, ""
		set :nginx_config_dir, -> { "/etc/nginx/conf.d" }
    set :nginx_roles, -> { :web }
    set :nginx_file_name, -> { "sambaads_default_#{fetch(:application)}.conf" }
    set :nginx_from, -> { "../templates/nginx" }
  end
end

namespace :nginx do
	desc "setup config nginx as template defined"
	task :setup do
	  on roles fetch(:nginx_roles) do
	  	erb = File.read(File.expand_path("#{fetch(:nginx_from)}/#{fetch(:nginx_file_name)}.erb", __FILE__))
		  data = ERB.new(erb).result(binding)
	    upload!  StringIO.new(data), "/tmp/nginx_#{fetch(:nginx_file_name)}"
	    
	    destination = "#{fetch(:nginx_config_dir)}/#{fetch(:nginx_file_name)}"
	    execute :sudo, "mv -u /tmp/nginx_#{fetch(:nginx_file_name)} #{destination}"
	    execute :sudo, "chown root:root #{destination}"
    	execute :sudo, "chmod 644 #{destination}"
	  end
	end
end