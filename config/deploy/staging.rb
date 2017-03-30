set :stage, :staging
set :branch, 'staging'

set :node_env, 'staging'

set :with_user, "sambaads"
#ssh_options[:forward_agent] = true  
set :ssh_options, keys: [File.join(ENV["HOME"], ".ssh", "deploy")]

server '52.2.84.81', user: fetch(:with_user),roles: %w{app db web}

set :nvm_type, :user
set :nvm_node, 'v4.4.0'
set :nvm_map_bins, %w{node npm}

set :npm_flags, '--no-spin'
set :npm_roles, :all
set :npm_target_path, -> { [release_path, release_path.join('app/')] }

set :nginx_sever_name, "staging-v2-player.sambaads.com"
set :nginx_host, "http://localhost:3002/"
set :nginx_file_name, "player.conf"
